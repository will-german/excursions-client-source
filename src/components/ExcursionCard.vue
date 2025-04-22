<script setup>
    import { ref, defineProps, watchEffect, onMounted, onUpdated } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { useExcursionStore } from '@/stores/excursionStore';
    import { FontAwesomeIcon } from './exporter';

    const router = useRouter();

    const excursionStore = useExcursionStore();

    const { data } = defineProps(['data']);

    function ViewExcursionDetails() {
        excursionStore.setExcursionDetails(data);

        router.push({
            "name": 'excursion',
        });
    }
</script>

<template>
    <div class="excursion_card grid"
         @click.prevent.stop="ViewExcursionDetails()">
        <input type="hidden"
               :value="data._id">
        <p class="excursion_name">{{ data.name }}</p>
        <p class="excursion_description">{{ data.description }}</p>
        <div class="excursion_stats flex--row">
            <p v-if="data.trips.length !== 1">
                <font-awesome-icon icon="fa-solid fa-users" />
                <span>{{ data.trips.length }} Trips</span>
            </p>
            <p v-else>
                <font-awesome-icon icon="fa-solid fa-users" />
                <span>{{ data.trips.length }} Trip</span>
            </p>

            <p v-if="data.participants.length !== 1">
                <font-awesome-icon icon="fa-solid fa-road" />
                <span>{{ data.participants.length }} Participants</span>
            </p>
            <p v-else>
                <font-awesome-icon icon="fa-solid fa-road" />
                <span>{{ data.participants.length }} Participant</span>
            </p>
        </div>
    </div>
</template>

<style lang="scss"
       scoped>

    @use "@/sass/abstracts" as *;

    .excursion_card {
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

    .excursion_card:is(:hover, :focus) {
        transform: scale(1.025);
        cursor: pointer;
        border: $border-width-default $border-style-default var(--primary-400);
    }

    .excursion_name {
        max-width: 80%;

        padding-left: $padding-sm;

        font-size: $fs-subheading;
        font-weight: $fw-bold;

        text-wrap: balance;

        position: relative;

        isolation: isolate;
    }

    .excursion_name::after {
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

    .excursion_stats {
        gap: $gap-xl;
    }

    .excursion_stats > p > i {
        color: var(--primary-600);
    }

    .excursion_stats > p {
        display: flex;
        flex-direction: row;
        gap: $gap-sm;

        align-items: center;

        opacity: 65%;
    }
</style>