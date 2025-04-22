<script setup>
    import { ref, defineProps, watchEffect, onMounted, onUpdated } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { useParkStore } from '@/stores/parkStore';
    import { useTripStore } from '@/stores/tripStore';
    import { FontAwesomeIcon } from './exporter';

    const router = useRouter();

    const tripStore = useTripStore();

    const { data } = defineProps(['data']);

    function ViewTripDetails() {
        tripStore.setTripDetails(data);

        router.push({
            "name": 'trip',
        });
    }
</script>

<template>
    <div class="trip_card grid"
         @click.prevent.stop="ViewTripDetails()">
        <input type="hidden"
               :value="data._id">
        <p class="trip_name">{{ data.name }}</p>
        <p class="trip_description">{{ data.description }}</p>
        <div class="trip_dates flex--row">
            <p>
                <span class="trip_start">{{ data.startDate }}</span>
                <span class="trip_end">{{ data.endDate }}</span>
            </p>
        </div>
    </div>
</template>

<style lang="scss"
       scoped>

    @use "@/sass/abstracts" as *;

    .trip_card {
        --gap: #{$gap};

        background: $bg-inverse;
        color: $text-inverse;

        padding: $padding-xl;

        border: $border-width-default $border-style-default var(--neutral-400);
        border-radius: $border-radius-default;

        transform: scale(1.0);
        transition: all 200ms ease-in-out;

        cursor: pointer;
    }

    .trip_card:is(:hover, :focus) {
        transform: scale(1.025);
        cursor: pointer;
        border: $border-width-default $border-style-default var(--primary-400);
    }

    .trip_name {
        max-width: 80%;

        padding-left: $padding-sm;

        font-size: $fs-subheading;
        font-weight: $fw-bold;

        text-wrap: balance;

        position: relative;

        isolation: isolate;
    }

    .trip_name::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;

        width: 0.375rem;
        height: 100%;

        background: var(--neutral-400);
        border-radius: $border-radius-default;

        z-index: -1;
    }

    .trip_description {}

    .trip_dates {
        --gap: #{$gap};
        opacity: 65%;
    }

    .trip_start {
        display: block;
    }

    .trip_end {
        display: block;
    }

</style>