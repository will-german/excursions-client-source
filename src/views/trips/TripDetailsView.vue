<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userStore';
    import { useParkStore } from '@/stores/parkStore';
    import { useTripStore } from '@/stores/tripStore';
    import { QueryBuilder } from '@/scripts/exporter';
    import { FormInput, FormTextarea, FormButton, FontAwesomeIcon } from '@/components/exporter';

    const router = useRouter();

    const userStore = useUserStore();
    const parkStore = useParkStore();
    const tripStore = useTripStore();

    const queryBuilder = new QueryBuilder();

    const trip = ref({});

    const name = ref('');
    const description = ref('');
    const startDate = ref('');
    const endDate = ref('');

    const isEditing = ref(false);
    const inputs = ref([]);

    onMounted(async () => {
        trip.value = tripStore.getTripDetails;

        name.value = trip.value.name;
        description.value = trip.value.description;

        const start = new Date(trip.value.startDate);
        const end = new Date(trip.value.endDate);

        startDate.value = start.toISOString().slice(0, 16);
        endDate.value = end.toISOString().slice(0, 16);

        const elements = document.querySelectorAll('.field_input');

        elements.forEach(element => {
            element.setAttribute('disabled', '');
        });

        inputs.value = elements;

        // trip.value = await AggregateTrip(trip.value);
        // await AggregateTrip(trip.value);
    });

    // TODO: Aggregate data to show a more robust trip

    function ToggleEditing() {
        isEditing.value = !isEditing.value;

        if (isEditing.value) {
            inputs.value.forEach(input => {
                input.removeAttribute('disabled');
            });
        } else {
            inputs.value.forEach(input => {
                input.setAttribute('disabled', '');
            });

            name.value = trip.value.name;
            description.value = trip.value.description;

            const start = new Date(trip.value.startDate);
            const end = new Date(trip.value.endDate);

            startDate.value = start.toISOString().slice(0, 16);
            endDate.value = end.toISOString().slice(0, 16);
        }
    }

    async function updateTrip() {
        const data = {
            "name": name.value,
            "description": description.value,
            "startDate": startDate.value,
            "endDate": endDate.value,
        };

        for (const [key, value] of Object.entries(trip.value._id, data)) {
            if (!value) {
                delete data[key];
            }
        }

        let response = await tripStore.updateTrip(trip.value._id, data);

        if (response.status === 200) {
            console.log("Trip Updated");

            // TODO: Toast User

            if (data.name) {
                trip.value.name = data.name;
            }

            if (data.description) {
                trip.value.description = data.description;
            }

            if (data.startDate) {
                trip.value.startDate = data.startDate;
            }

            if (data.endDate) {
                trip.value.endDate = data.endDate;
            }
        } else {
            throw new Error({ Error: 'Failed to update trip.' });
        }

        ToggleEditing();
    }

    async function deleteTrip() {
        let response = await tripStore.deleteTrip(trip.value._id, {});

        if (response.status === 200) {
            console.log("Deleted Trip");

            // TODO: Toast User

            router.push({
                "name": "trips",
            });
        }
    }
</script>

<template>
    <div id="wrapper"
         class="grid">
        <main class="">
            <section class="section section--header">
                <h1 class="title">Trip Details</h1>
                <p>Manage trip details.</p>
            </section>
            <section class="section section--body">
                <form action=""
                      class="form grid">

                    <FormInput label="Name"
                               type="text"
                               name="name"
                               required="true"
                               v-model="name">
                    </FormInput>

                    <FormTextarea label="Description"
                                  type="text"
                                  name="description"
                                  required="true"
                                  v-model="description">
                    </FormTextarea>

                    <div class="trip_dates flex--row">
                        <FormInput label="Start Date"
                                   type="datetime-local"
                                   name="startDate"
                                   required="true"
                                   v-model="startDate">
                        </FormInput>

                        <FormInput label="End Date"
                                   type="datetime-local"
                                   name="endDate"
                                   required="true"
                                   v-model="endDate">
                        </FormInput>
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
                    <FormButton text="Delete Trip"
                                type="button"
                                customClasses="button--dark--solid--square"
                                @click.prevent.stop="deleteTrip()">
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
        grid-template-columns: repeat(2, minmax(0, 1fr));

        padding-block: $padding-xl;
    }

    .form > :where(*:nth-child(1), *:nth-child(2)) {
        grid-column: 1 / span 2;
    }

    .form > .field,
    .form .field {
        --gap: 0;
        // --label-color: #{$text};
        --label-color: var(--primary-400);
    }

    .trip_dates {
        width: 100%;
        align-items: center;
        justify-content: space-between;
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

</style>