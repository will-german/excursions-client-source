<script setup>
    import { ref, defineProps, watchEffect, onMounted, onUpdated } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { useParkStore } from '@/stores/parkStore';
    import { FontAwesomeIcon } from './exporter';

    const router = useRouter();

    const parkStore = useParkStore();

    const { data } = defineProps(['data']);

    /**
     *  Pass data.park.parkCode through router (:id) as param.
     * 
     *  Use this to fetch the associated park, campgrounds, and thingstodo
     *  from the parkStore and populate a "parkDetails" page.
     * 
     *  From the details page users can create trips.
     *  Create an Excursions Store for this functionality.
     * 
     *  Prior to create any trips or excursions, delete the associated trips and
     *  excursions objects connected to "Joe User" as they may cause problems
     *  with testing.
     */
    function storeParkDetails() {
        parkStore.setParkDetails(data);

        router.push({
            "name": 'park-details',
        });
    }

</script>

<template>
    <div class="park_card grid"
         :data-id="data.park.id"
         @click.prevent.stop="storeParkDetails()">
        <h2 class="park_card_name heading">{{ data.park.name }}</h2>

        <div class="park_card_badge_list flex--row flex--align-center--justify-start">
            <div class="park_card_badge flex--row--align-center">
                <font-awesome-icon icon="fa-solid fa-campground" />
                <p v-if="data.campgrounds.length === 1">{{ data.campgrounds.length }}
                    Campground</p>
                <p v-else>{{ data.campgrounds.length }}
                    Campgrounds</p>
            </div>

            <div class="park_card_badge flex--row--align-center">
                <font-awesome-icon icon="fa-solid fa-person-walking-luggage" />
                <p v-if="data.thingstodo.length === 1">{{ data.thingstodo.length }}
                    Things To Do</p>
                <p v-else>{{ data.thingstodo.length }}
                    Things To Do</p>
            </div>
        </div>

        <!-- <RouterLink to=""
                    class="park_card_link">
            <font-awesome-icon icon="fa-solid fa-arrow-right" />
        </RouterLink> -->

        <p class="park_card_description">{{ data.park.description }}</p>

        <img class="park_card_image"
             :src="data.park.images[0].url"
             :alt="data.park.images[0].altText"
             :title="data.park.images[0].title">
    </div>
</template>

<style lang="scss"
       scoped>

    @use '@/sass/abstracts' as *;

    .park_card {
        --gap: #{$park-card-gap};
        --_columns: 2;
        --_padding: #{$park-card-padding};

        grid-template-columns: repeat(var(--_columns), minmax(0, 1fr));

        width: 100%;
        height: max-content;

        padding-block: calc(var(--_padding) / 1.5);
        padding-inline: var(--_padding);

        border: $park-card-border;
        border-radius: $park-card-border-radius;

        box-shadow: $box-shadow-default;

        overflow: hidden;

        position: relative;
    }

    .park_card:is(:hover, :focus, :focus-within) {
        border: $park-card-border-interactive;
        cursor: pointer;
    }

    .park_card::after {
        content: '';
        position: absolute;
        inset: 0 0;

        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(4px);

        width: 100%;
        height: 100%;

        z-index: -1;
    }

    .park_card:is(:hover, :focus, :focus-within)::after {
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(0px);
    }

    .park_card_name {
        grid-column: 1 / span 2;
        max-width: 80%;

        padding-left: $padding-sm;

        font-size: $park-card-name-font-size;
        text-wrap: balance;

        position: relative;

        isolation: isolate;
    }

    .park_card_name::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;

        width: 0.5rem;
        height: 100%;

        background: var(--neutral-400);
        border-radius: $border-radius-default;

        z-index: -1;
    }

    .park_card:is(:hover, :focus, :focus-within) > .park_card_name::after {
        background: var(--primary-400);
    }

    .park_card_badge_list {
        --gap: #{$gap};
        grid-column: 1 / span 2;
        width: 100%;
    }

    .park_card_badge {
        --gap: 0;
        width: max-content;
    }

    .park_card_description {
        grid-column: 1 / span 2;
        max-width: 80%;

        text-align: justify;
        text-indent: 1.5rem;
    }

    .park_card_image {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        object-fit: cover;

        filter: brightness(0.25) grayscale(1);

        z-index: -2;
    }

    .park_card:is(:hover, :focus, :focus-within) > .park_card_image {
        filter: brightness(1) grayscale(0);
    }

    [class*="fa-solid"] {
        display: grid;
        place-content: center;

        width: 3rem;
        aspect-ratio: 1 / 1;

        color: $park-card-icon-text;
    }

    .park_card_link {
        display: grid;
        place-content: center;

        position: absolute;
        top: 0;
        right: 0;

        width: max-content;
        height: 100%;

        background: $park-card-link-bg;
        background: $park-card-link-bg-gradient;

        padding-inline: $padding-xl;

        border: 0;

        transform: translateX(200%);
        opacity: 0;
    }

    .park_card:is(:hover, :focus, :focus-within) > .park_card_link {
        transform: translateX(0%);
        opacity: 1;
    }

</style>