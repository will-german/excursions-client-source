<script setup>
    import { ref, onMounted, useTemplateRef } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userStore';
    import { useTripStore } from '@/stores/tripStore';
    import { useExcursionStore } from '@/stores/excursionStore';
    import { ExcursionCard, FormInput, FormTextarea, FormSelect, FormButton, FontAwesomeIcon, Modal } from '@/components/exporter';

    const router = useRouter();

    const userStore = useUserStore();
    const tripStore = useTripStore();
    const excursionStore = useExcursionStore();

    const user = ref(userStore.getUser);
    const excursions = ref([]);
    const trips = ref([]);
    const hosted = ref([]);
    const shared = ref([]);

    const addExcursionModal = useTemplateRef('add-excursion-modal');

    const excursionName = ref('');
    const excursionDescription = ref('');
    const excursionTrips = ref([]);
    const excursionParticipants = ref([]);

    onMounted(async () => {
        await GetExcursions();
        await userStore.getUsersData();

        excursions.value.forEach(excursion => {
            if (excursion.host[0]._id === user.value._id) {
                hosted.value.push(excursion);
            } else {
                shared.value.push(excursion);
            }
        });

        trips.value = tripStore.getTrips;
    });

    async function GetExcursions() {
        let response = await excursionStore.getExcursionsData();

        if (response.status === 200) {
            excursions.value = excursionStore.getExcursions;
        }
    }

    async function CreateExcursion() {
        const data = {
            name: excursionName.value,
            description: excursionDescription.value,
            trips: excursionTrips.value,
        };

        let response = await excursionStore.createExcursion(data);

        console.log(response);

        if (response.ok) {
            if (response.status === 201) {
                // Toast User

                router.push({
                    name: 'excursions',
                });
            }
        } else {
            // throw errors
        }

        addExcursionModal.value.closeModal();
    }

    async function CancelExcursion() {
        excursionName.value = '';
        excursionDescription.value = '';
        excursionTrips.value = [];

        addExcursionModal.value.closeModal();
    }
</script>

<template>
    <div id="wrapper"
         class="grid">

        <main class="">

            <section class="section section--header">
                <h1 class="title">Excursions</h1>
                <p>Select an excursion to view details.</p>
            </section>

            <section class="section section--body"
                     v-if="hosted.length > 0">
                <h2 class="subheading">Hosted</h2>
                <p>Excursions you host.</p>
            </section>

            <ul class="excursion_card_list grid"
                role="list"
                v-if="hosted.length > 0">

                <li v-for="excursion in hosted">
                    <ExcursionCard :data="excursion"></ExcursionCard>
                </li>
            </ul>

            <section class="section section--body"
                     v-if="shared.length > 0">
                <h2 class="subheading">Shared</h2>
                <p>Excursions you participate in.</p>
            </section>

            <ul class="excursion_card_list grid"
                role="list"
                v-if="shared.length > 0">

                <li v-for="excursion in shared">
                    <ExcursionCard :data="excursion"></ExcursionCard>
                </li>
            </ul>
        </main>

        <aside class="park_actions flex--col">
            <ul class="park_actions_list"
                role="list">
                <li id="add_trip">
                    <FormButton text="Add Excursion"
                                type="button"
                                customClasses="button--dark--solid--round"
                                @click.stop.prevent="addExcursionModal.openModal()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-plus" />
                        </template>
                    </FormButton>
                </li>
            </ul>

            <Modal ref="add-excursion-modal">
                <template #header>
                    <p class="modal_heading subheading">Create Excursion</p>
                </template>
                <template #main>
                    <div class="modal_form">
                        <FormInput label="name"
                                   type="text"
                                   name="name"
                                   placeholder="Excursion"
                                   isPassword="false"
                                   required="true"
                                   v-model="excursionName">
                        </FormInput>
                        <FormTextarea label="description"
                                      name="description"
                                      placeholder="Describe your excursion!"
                                      required="true"
                                      v-model="excursionDescription">
                        </FormTextarea>
                        <FormSelect label="trips"
                                    name="trips"
                                    required="true"
                                    multiple="true"
                                    :data="trips"
                                    v-model="excursionTrips"
                                    v-if="trips.length > 0">
                        </FormSelect>
                    </div>
                </template>
                <template #footer>
                    <div class="modal-actions">
                        <FormButton text="Create Excursion"
                                    type="button"
                                    customClasses="button--dark--solid--square"
                                    @click.stop.prevent="CreateExcursion()">
                        </FormButton>
                        <FormButton text="Cancel"
                                    type="button"
                                    customClasses="button--outline--square"
                                    @click.stop.prevent="CancelExcursion()">
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

    .excursion_card_list {
        --gap: #{$gap};
        padding-block: $padding-xl;
    }

    .section--body {
        padding-top: $padding-xl;
    }

    .subheading {
        font-weight: $fw-bold;
        padding-bottom: $padding-xs;
    }

    .park_actions {
        --gap: #{$gap};

        padding-block: $padding-lg;

        position: fixed;

        right: calc(#{$padding-xl} * 2);
        bottom: $padding-lg;
    }

    .park_actions > .subtitle {
        margin-bottom: calc(#{$padding-xs} * 1.5);
    }

    #add_trip > button[class*="button"] {
        --_bg: var(--semantic-warn-400);
        --_color: #{$text-inverse};
        --_border-color: var(--_bg);
    }

</style>