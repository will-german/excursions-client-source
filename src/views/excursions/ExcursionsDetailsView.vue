<script setup>
    import { ref, onMounted, useTemplateRef } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userStore';
    import { useTripStore } from '@/stores/tripStore';
    import { useExcursionStore } from '@/stores/excursionStore';
    import { FormInput, FormTextarea, FormButton, FontAwesomeIcon, Modal } from '@/components/exporter';
    import FormSelect from '@/components/FormSelect.vue';

    const router = useRouter();

    const userStore = useUserStore();
    const tripStore = useTripStore();
    const excursionStore = useExcursionStore();

    const user = ref(userStore.getUser);
    const users = ref(userStore.getUsers);

    const friendId = ref('');

    const hostedTrips = ref([]);

    const excursion = ref({});
    const trips = ref([]);
    const participants = ref([]);

    const excursionName = ref('');
    const excursionDescription = ref('');
    const excursionTrips = ref([]);
    const excursionParticipants = ref([]);

    const isEditing = ref(false);
    const isHost = ref(false);

    const inputs = ref([]);
    const select = ref();
    const buttons = ref([]);

    onMounted(async () => {
        await tripStore.getTripsData();
        hostedTrips.value = tripStore.getTrips;

        excursion.value = excursionStore.getExcursionDetails;
        trips.value = excursion.value.trips;
        participants.value = excursion.value.participants;

        excursionName.value = excursion.value.name;
        excursionDescription.value = excursion.value.description;

        users.value = userStore.getUsers;

        if (excursion.value.host[0]._id === user.value._id) {
            isHost.value = true;
        }

        const elements = document.querySelectorAll('.field_input');

        elements.forEach(element => {
            element.setAttribute('disabled', '');

            if (element.closest('.modal') !== null) {
                element.removeAttribute('disabled');
            }
        });

        inputs.value = elements;
    });

    const addParticipantModal = useTemplateRef('add-participant-modal');

    function ToggleEditing() {
        isEditing.value = !isEditing.value;

        if (isEditing.value) {
            inputs.value.forEach(input => {
                input.removeAttribute('disabled');
            });

            trips.value = hostedTrips.value;
        } else {
            inputs.value.forEach(input => {
                input.setAttribute('disabled', '');
            });

            excursionName.value = excursion.value.name;
            excursionDescription.value = excursion.value.description;
            excursionTrips.value = excursion.value.trips;
            trips.value = excursion.value.trips;
        }
    }

    async function updateExcursion() {
        const data = {
            "name": excursionName.value,
            "description": excursionDescription.value,
            "trips": [],
        };

        if (excursionTrips.value) {
            excursionTrips.value.forEach(trip => {
                data.trips.push(trip);
            });
        }

        for (const [key, value] of Object.entries(excursion.value._id, data)) {
            if (!value) {
                delete data[key];
            }
        }

        let response = await excursionStore.updateExcursion(excursion.value._id, data);

        if (response.status === 200) {
            if (data.name) {
                excursion.value.name = data.name;
            }

            if (data.description) {
                excursion.value.description = data.description;
            }

            if (data.trips) {
                data.trips.forEach(dataTrip => {
                    console.log(dataTrip);
                    hostedTrips.value.forEach(hostedTrip => {
                        console.log(hostedTrip);
                        if (dataTrip === hostedTrip._id) {
                            excursion.value.trips.push(hostedTrip);
                        }
                    });
                });

                // excursion.value.trips = data.trips;
            }
        } else {
            // errors
        }

        ToggleEditing();
    }

    async function deleteExcursion() {
        let id = excursion.value._id;

        let response = await excursionStore.deleteExcursion(id, {});

        if (response.ok) {
            if (response.status === 200) {
                router.push({
                    name: 'excursions',
                });
            }
        }
    }

    async function inviteUser() {
        let id = excursion.value._id;
        const token = userStore.getBearerToken;
        const url = `https://excursions-api-server.azurewebsites.net/share/excursion/${id}`;

        const data = {
            "friendId": friendId.value,
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 201) {
                console.log(response);
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not invite user.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not invite user.");
            }
        }

        addParticipantModal.value.closeModal();

    }

    async function leaveExcursion() {
        let id = excursion.value._id;
        const token = userStore.getBearerToken;
        const url = `https://excursions-api-server.azurewebsites.net/leave/excursions/${id}`;

        const options = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                router.push({
                    name: "excursions",
                });
            }
        } else {
            if (response.stauts === 400) {
                throw new Error({ "Bad Request": "Could not leave Excursion." });
            }

            if (response.stauts === 401) {
                throw new Error({ "Unauthorized": "Could not leave Excursion." });
            }

            if (response.stauts === 403) {
                throw new Error({ "Forbidden": "Could not leave Excursion." });
            }

            if (response.stauts === 500) {
                throw new Error({ "Internal Server Error": "Could not leave Excursion." });
            }
        }

        return response;
    }

    async function removeUser(participantId) {
        let id = excursion.value._id;
        const token = userStore.getBearerToken;

        const url = `https://excursions-api-server.azurewebsites.net/remove/excursions/${id}`;

        const data = {
            "participantId": participantId
        };

        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                console.log(response);
            }
        } else {
            // errors
        }

        return response;

    }

</script>

<template>
    <div id="wrapper"
         class="grid">

        <main class="">
            <section class="section section--header">
                <h1 class="title">Excursion Details</h1>
                <p>Manage excursion and participant details.</p>
            </section>
            <section class="section section--body">
                <form action=""
                      class="form grid">

                    <FormInput label="Name"
                               type="text"
                               name="name"
                               required="true"
                               v-model="excursionName">
                    </FormInput>

                    <FormTextarea label="Description"
                                  type="text"
                                  name="description"
                                  required="true"
                                  v-model="excursionDescription">
                    </FormTextarea>

                    <FormSelect label="Trips"
                                name="trips"
                                required="true"
                                multiple="true"
                                user="true"
                                :data="trips"
                                v-model="excursionTrips">
                    </FormSelect>

                    <div class="participants"
                         v-if="participants.length > 0">
                        <p class="participants_label">Participants</p>
                        <ul class="participants_list"
                            role="list">
                            <li v-for="participant in participants">
                                <div class="participant_card">
                                    <p>{{ participant.firstName }} {{ participant.lastName }}</p>
                                    <button type="button"
                                            class="participant_button"
                                            v-if="isHost"
                                            @click.prevent.stop="removeUser(participant._id)">
                                        <font-awesome-icon icon="fa-solid fa-minus" />
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>

                </form>
            </section>
        </main>

        <aside class="profile_actions">
            <ul class="grid"
                role="list"
                v-if="isHost">
                <li id="edit"
                    v-show="!isEditing">
                    <FormButton text="Enable Editing"
                                type="button"
                                customClasses="button--light--outline--square"
                                @click="ToggleEditing()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-pencil" />
                        </template>
                    </FormButton>
                </li>
                <li id="update"
                    v-show="isEditing">
                    <FormButton text="Save Changes"
                                type="button"
                                customClasses="button--dark--solid--square"
                                @click.prevent.stop="updateExcursion()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-floppy-disk" />
                        </template>
                    </FormButton>
                </li>
                <li id="cancel"
                    v-show="isEditing">
                    <FormButton text="Cancel"
                                type="button"
                                customClasses="button--light--outline--square"
                                @click="ToggleEditing()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-ban" />
                        </template>
                    </FormButton>
                </li>
                <li id="delete"
                    v-show="!isEditing">
                    <FormButton text="Delete Excursion"
                                type="button"
                                customClasses="button--dark--solid--square"
                                @click.prevent.stop="deleteExcursion()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-trash" />
                        </template>
                    </FormButton>
                </li>
                <li id="invite"
                    v-show="!isEditing">
                    <FormButton text="Invite Participant"
                                type="button"
                                customClasses="button--dark--solid--square"
                                @click.prevent.stop="addParticipantModal.openModal()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-trash" />
                        </template>
                    </FormButton>
                </li>
            </ul>

            <ul class="grid"
                role="list"
                v-else>
                <li id="delete">
                    <FormButton text="Leave Excursion"
                                type="button"
                                customClasses="button--dark--solid--square"
                                @click.prevent.stop="leaveExcursion()">
                        <template #suffix-icon>
                            <font-awesome-icon icon="fa-solid fa-person-walking-dashed-line-arrow-right" />
                        </template>
                    </FormButton>
                </li>
            </ul>

            <Modal ref="add-participant-modal">
                <template #header>
                    <p class="modal_heading subheading">Invite Participants</p>
                </template>
                <template #main>
                    <div class="modal_form">
                        <FormSelect label="participants"
                                    name="participants"
                                    required="true"
                                    multiple="false"
                                    user="true"
                                    :data="users"
                                    v-model="friendId">

                        </FormSelect>
                    </div>
                </template>
                <template #footer>
                    <div class="modal-actions">
                        <FormButton text="Invite User"
                                    type="button"
                                    customClasses="button--dark--solid--square"
                                    @click.stop.prevent="inviteUser()">
                        </FormButton>
                        <FormButton text="Cancel"
                                    type="button"
                                    customClasses="button--outline--square"
                                    @click.stop.prevent="addParticipantModal.closeModal()">
                        </FormButton>
                    </div>
                </template>
            </Modal>
        </aside>

    </div>
</template>

<style lang="scss"
       scoped>

    @use "@/sass/abstracts" as *;

    // #region Modal

    .modal_form {
        display: grid;
        gap: $gap;
    }

    .modal_dates {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .modal_heading.subheading {
        --_color: #{$text-inverse};
        color: var(--_color);
        font-weight: $fw-bold;
    }

    .modal_content {
        gap: $gap;
    }

    .modal-actions {
        display: flex;
        flex-direction: row;
        gap: $gap;
    }

    .modal-actions > button:last-child {
        --_color: #{$text-inverse};
    }

    // #endregion

    // #region participants
    .participants_label {
        --label-color: var(--primary-400);
        color: var(--label-color, #{$text-inverse});
        font-weight: $fw-semibold;
        text-transform: capitalize;
        padding-bottom: $padding-xs;
    }

    .participant_card {
        --_padding: #{$form-input-padding};
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        padding-block: calc(var(--_padding) / 1.5);
        padding-inline: var(--_padding);

        background: $bg-inverse;
        color: $text-inverse;

        text-transform: capitalize;

        border-width: $form-input-border-width;
        border-style: $form-input-border-style;
        border-color: var(--_border-color);
        border-radius: $form-input-border-radius;

        box-shadow: $form-input-box-shadow;
    }

    .participant_button {
        width: max-content;
        aspect-ratio: 1 / 1;

        background: var(--semantic-error-400);
        color: $text;

        padding: $padding-xs;

        border: $border-width-default $border-style-default var(--semantic-error-400);
        border-radius: $border-radius-default;

        cursor: pointer;
    }

    // #endregion

    #wrapper {
        --gap: calc(#{$gap-xl} * 2);
        grid-template-columns: repeat(2, minmax(0, max-content));
        padding-inline: $padding-xl;
    }

    main {
        width: 100%;
        min-width: 32rem;
        max-width: 64rem;
    }

    .section {
        position: relative;
    }

    .form {
        --gap: #{$gap-xl};
        grid-template-columns: repeat(1, minmax(0, 1fr));

        padding-block: $padding-xl;
    }

    .form > .field {
        --gap: 0;
        // --label-color: #{$text};
        --label-color: var(--primary-400);
    }

    .profile_actions {
        --gap: #{$gap-lg};
        min-width: 24rem;

        padding-block: calc($padding-xl * 4.675);
    }

    .profile_actions [class*="button"] {}

    .profile_actions #edit [class*="button"] {
        --_bg: transparent;
        --_color: #{$text};
        --_border-color: #{$bg-inverse};
    }

    .profile_actions #update [class*="button"] {
        --_bg: transparent;
        --_color: var(--primary-400);
        --_border-color: var(--primary-400);
    }

    .profile_actions #delete [class*="button"],
    .profile_actions #cancel [class*="button"] {
        --_bg: var(--semantic-error-400);
        --_color: var(--neutral-050);
        --_border-color: var(--semantic-error-400);
    }

    .profile_actions #invite [class*="button"] {
        --_bg: var(--semantic-warn-400);
        --_color: #{$text-inverse};
        --_border-color: var(--semantic-warn-400);
    }

    .excursion_trips {}

    .excursion_participants {}
</style>