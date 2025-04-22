<script setup>
    import { ref, useTemplateRef } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { useParkStore } from '@/stores/parkStore';
    import { useTripStore } from '@/stores/tripStore';
    import { FormInput, FormTextarea, FormSelect, FormButton, FontAwesomeIcon, Modal } from '@/components/exporter';

    const router = useRouter();

    const parkStore = useParkStore();
    const tripStore = useTripStore();

    const park = ref(parkStore.getParkDetails.park);
    const campgrounds = ref(parkStore.getParkDetails.campgrounds);
    const thingstodo = ref(parkStore.getParkDetails.thingstodo);

    const addTripModal = useTemplateRef('add-trip-modal');

    const tripName = ref('');
    const tripDescription = ref('');
    const tripStartDate = ref();
    const tripEndDate = ref();
    const tripParkId = ref(parkStore.getParkDetails.park.id);
    const tripCampgroundId = ref();
    const tripThingsToDoIds = ref();

    // cosmetic only
    const tripParkName = ref(parkStore.getParkDetails.park.fullName);


    async function CreateTrip() {

        const data = {
            name: tripName.value,
            description: tripDescription.value,
            park: tripParkId.value,
        };

        if (tripStartDate.value) {
            let start = new Date(tripStartDate.value);
            data['startDate'] = start.toISOString();
        }

        if (tripEndDate.value) {
            let end = new Date(tripEndDate.value);
            data['endDate'] = end.toISOString();
        }

        if (tripCampgroundId.value) {
            data['campground'] = tripCampgroundId.value;
        }

        if (tripThingsToDoIds.value) {
            data['thingstodo'] = tripThingsToDoIds.value;
        }

        let response = await tripStore.createTrip(data);

        console.log(response);

        if (response.ok) {
            if (response.status === 201) {
                // TODO: Toast User
            }
        } else {
            // throw errors
        }
    }

    function CancelTrip() {
        tripName.value = '';
        tripDescription.value = '';
        tripStartDate.value = '';
        tripEndDate.value = '';
        tripParkId.value = parkStore.getParkDetails.park.id;
        tripCampgroundId.value = '';
        tripThingsToDoIds.value = '';

        addTripModal.value.closeModal();
    }

</script>

<template>
    <div id="wrapper"
         class="grid">

        <main class="">

            <div class="banner_wrapper">
                <img :src="park.images[0].url"
                     :alt="park.images[0].altText"
                     class="banner">
            </div>

            <div class="content flex--col">
                <section class="section section--header">
                    <h1 class="title">{{ park.fullName }}</h1>
                    <p class="address">
                        <font-awesome-icon icon="fa-solid fa-location-dot" />
                        {{ park.addresses[0].line1 }}
                        {{ park.addresses[0].city }}
                        {{ park.addresses[0].stateCode }}
                        {{ park.addresses[0].postalCode }}
                    </p>
                </section>

                <section v-if="campgrounds.length > 0"
                         class="section">
                    <h2 class="subtitle">{{ campgrounds.length }} Campgrounds</h2>
                    <ul class="details_list grid"
                        role="list">
                        <li v-for="campground in campgrounds">
                            <div class="campground_card">
                                <input type="hidden"
                                       :value="campground.id">

                                <img v-if="campground.images.length > 0"
                                     :src="campground.images[0].url"
                                     :alt="campground.images[0].altText"
                                     class="campground_card_image">

                                <div class="campground_card_body">
                                    <p class="campground_card_name">{{ campground.name }}</p>

                                    <p class="campground_card_description">
                                        {{ campground.description }}
                                    </p>

                                    <div class="campground_card_notes">
                                        <p class="campground_card_campsites">
                                            <font-awesome-icon icon="fa-solid fa-tents" />
                                            {{ campground.campsites.totalSites }} Campsites
                                        </p>

                                        <!-- <p class="campground_card_reservationInfo">
                                        <font-awesome-icon icon="fa-solid fa-exclamation" />
                                        {{ campground.reservationInfo }}
                                    </p> -->
                                    </div>

                                    <a :href="campground.url"
                                       target="_blank"
                                       class="campground_card_link">
                                        Learn More
                                        <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
                                    </a>

                                </div>
                            </div>
                        </li>
                    </ul>
                </section>

                <section v-if="thingstodo.length > 0"
                         class="section">
                    <h2 class="subtitle">{{ thingstodo.length }} Things To Do</h2>
                    <ul class="details_list details_list--ttd grid"
                        role="list">
                        <li v-for="thingtodo in thingstodo">
                            <div class="campground_card thingtodo_card">
                                <input type="hidden"
                                       :value="thingtodo.id">

                                <div class="campground_card_body">
                                    <p class="thingtodo_name">{{ thingtodo.title }}</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </section>
            </div>
        </main>

        <aside class="park_actions flex--col">
            <ul class="park_actions_list"
                role="list">
                <li id="add_trip">
                    <FormButton text="Add Trip"
                                type="button"
                                customClasses="button--dark--solid--round"
                                @click.stop.prevent="addTripModal.openModal()">
                        <template #prefix-icon>
                            <font-awesome-icon icon="fa-solid fa-plus" />
                        </template>
                    </FormButton>
                </li>
            </ul>

            <Modal ref="add-trip-modal">
                <template #header>
                    <p class="modal_heading subheading">Create Trip</p>
                </template>
                <template #main>
                    <div class="modal_form">
                        <FormInput label="name"
                                   type="text"
                                   name="name"
                                   placeholder="Trip"
                                   required="true"
                                   v-model="tripName">
                        </FormInput>
                        <FormTextarea label="description"
                                      name="description"
                                      placeholder="Describe your trip!"
                                      required="true"
                                      v-model="tripDescription">
                        </FormTextarea>
                        <div class="modal_dates grid">
                            <FormInput label="Start Date"
                                       type="datetime-local"
                                       name="startDate"
                                       required="true"
                                       v-model="tripStartDate">
                            </FormInput>
                            <FormInput label="End Date"
                                       type="datetime-local"
                                       name="endDate"
                                       required="true"
                                       v-model="tripEndDate">
                            </FormInput>
                        </div>
                        <input type="hidden"
                               name="parkId"
                               :value="tripParkId">
                        <FormInput label="park"
                                   type="text"
                                   name="park"
                                   required="true"
                                   disabled="true"
                                   v-model="tripParkName">
                        </FormInput>
                        <FormSelect label="campground"
                                    name="campground"
                                    required="true"
                                    :data="campgrounds"
                                    v-model="tripCampgroundId"
                                    v-if="campgrounds.length > 0">
                        </FormSelect>
                        <FormSelect label="things to do"
                                    name="thingstodo"
                                    required="true"
                                    multiple="true"
                                    :data="thingstodo"
                                    v-model="tripThingsToDoIds"
                                    v-if="thingstodo.length > 0">
                        </FormSelect>
                    </div>
                </template>
                <template #footer>
                    <div class="modal-actions">
                        <FormButton text="Create Trip"
                                    type="button"
                                    customClasses="button--dark--solid--square"
                                    @click.stop.prevent="CreateTrip()">
                        </FormButton>
                        <FormButton text="Cancel"
                                    type="button"
                                    customClasses="button--outline--square"
                                    @click.stop.prevent="CancelTrip()">
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

    .content {
        gap: calc(#{$gap-xl} * 2);
    }

    .section--header {
        padding-bottom: calc($padding-xl * 2);
    }

    .banner_wrapper {
        --_max-height: 24rem;
    }

    .banner_wrapper::after {
        content: '';

        display: block;

        position: fixed;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
        // max-height: var(--_max-height);

        background: rgba(0, 0, 0, 0.65);
        // backdrop-filter: blur(4px);

        object-fit: cover;

        z-index: -1;
    }

    .banner {
        display: block;

        position: fixed;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
        // max-height: var(--_max-height);

        object-fit: cover;

        z-index: -1;

        box-shadow: $box-shadow-default;
    }

    .address {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $gap-sm;

        padding-left: $padding-sm;
    }

    .address > i {
        color: var(--primary-400);
    }

    .subtitle {
        // color: var(--primary-400);
        width: max-content;

        font-size: $fs-heading;
        padding-bottom: $padding-xs;

        margin-bottom: $margin-xs;

        position: relative;
    }

    .subtitle::after {
        content: '';
        width: 50%;
        height: 100%;

        position: absolute;
        inset: 0 0;

        border-bottom: $border-width-wide $border-style-default var(--primary-400);
        border-radius: $border-radius-default;
    }

    .details_list {
        --gap: #{$gap-sm};
        grid-template-columns: repeat(1, minmax(0, 1fr));

        padding-block: $padding;
    }

    .campground_card {
        display: flex;
        flex-direction: row;
        gap: $gap;

        align-items: center;

        background: $bg-inverse;
        color: $text-inverse;

        padding: calc(#{$padding} * 1.2);

        border-radius: $border-radius-default;

        box-shadow: $box-shadow-default;
    }

    .campground_card_image {
        width: 100%;
        max-width: 20rem;
        aspect-ratio: 1.75 / 1;

        object-fit: cover;

        border-radius: $border-radius-default;

        box-shadow: $box-shadow-default;
    }

    .campground_card_body {
        display: flex;
        flex-direction: column;
        gap: $gap;

        width: 100%;

        position: relative;
    }

    .campground_card_name {
        width: max-content;

        padding-inline: $padding-xs;

        font-size: var(--font-size-500);
        font-weight: $fw-semibold;

        border-left: $border-width-wide $border-style-default var(--primary-400);
        border-radius: $border-radius-default;
    }

    .campground_card_notes {
        display: flex;
        flex-direction: row;
        gap: $gap-lg;
        align-items: center;

        // padding-block: $padding-sm;
    }

    .campground_card_description {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .campground_card_campsites,
    .campground_card_reservationInfo {
        display: flex;
        flex-direction: row;
        gap: $gap-sm;
        align-items: center;
    }

    .campground_card_campsites > i,
    .campground_card_reservationInfo > i {
        color: var(--primary-400);
    }

    .campground_card_link {
        position: absolute;
        top: 0;
        right: 0;

        color: var(--primary-500);

        display: flex;
        flex-direction: row;
        gap: $gap-sm;
        align-items: center;

        border: 0;
    }

    .details_list--ttd {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .thingtodo_card {
        height: 100%;
    }

    .thingtodo_name {
        text-wrap: wrap;

        padding-inline: $padding-xs;

        font-size: var(--font-size-400);
        font-weight: $fw-default;
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