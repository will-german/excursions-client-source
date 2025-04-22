<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userStore';
    import { useTripStore } from '@/stores/tripStore';
    import { useExcursionStore } from '@/stores/excursionStore';
    import { FormInput, FormTextarea, FormButton, FontAwesomeIcon } from '@/components/exporter';
    import FormSelect from '@/components/FormSelect.vue';

    const router = useRouter();

    const userStore = useUserStore();
    const tripStore = useTripStore();
    const excursionStore = useExcursionStore();

    const hostedTrips = ref([]);

    const excursion = ref({});
    const trips = ref([]);
    const participants = ref([]);

    const excursionName = ref('');
    const excursionDescription = ref('');
    const excursionTrips = ref([]);
    const excursionParticipants = ref([]);

    const isEditing = ref(false);
    const inputs = ref([]);
    const select = ref();
    const buttons = ref([]);

    onMounted(async () => {
        await tripStore.getTripsData();
        hostedTrips.value = tripStore.getTrips;

        excursion.value = excursionStore.getExcursionDetails;
        trips.value = excursion.value.trips;
        participants.value = excursion.value.participants;

        console.log(excursion.value);

        excursionName.value = excursion.value.name;
        excursionDescription.value = excursion.value.description;

        const elements = document.querySelectorAll('.field_input');

        elements.forEach(element => {
            element.setAttribute('disabled', '');
        });

        inputs.value = elements;
    });

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
            // bullshit
        };

        for (const [key, value] of Object.entries(excursion.value._id, data)) {
            if (!value) {
                delete data[key];
            }
        }
    }

    async function deleteExcursion() { }

    async function inviteUser() {

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
                                :data="trips"
                                v-model="excursionTrips">
                    </FormSelect>

                    <div class="participants">
                        <p class="participants_label">Participants</p>
                        <ul class="participants_list"
                            role="list">
                            <li v-for="participant in participants">
                                <div class="participant_card">
                                    <p>{{ participant.firstName }} {{ participant.lastName }}</p>
                                    <button type="button"
                                            class="participant_button">
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
                role="list">
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
                                @click.prevent.stop="updateTrip()">
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
                                @click.prevent.stop="inviteUser()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-trash" />
                        </template>
                    </FormButton>
                </li>
            </ul>
        </aside>

    </div>
</template>

<style lang="scss"
       scoped>

    @use "@/sass/abstracts" as *;

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
        --_bg: transparent;
        --_color: var(--semantic-error-400);
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