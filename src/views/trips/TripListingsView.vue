<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useTripStore } from '@/stores/tripStore';
    import { TripCard } from '@/components/exporter';

    const tripStore = useTripStore();

    const trips = ref([]);

    onMounted(async () => {
        await GetTrips();
    });

    async function GetTrips() {
        let response = await tripStore.getTripsData();

        if (response.status === 200) {
            trips.value = tripStore.getTrips;

            trips.value.forEach(trip => {
                trip.startDate = new Date(trip.startDate);
                trip.endDate = new Date(trip.endDate);
            });
        }
    }

</script>

<template>
    <div id="wrapper"
         class="grid">

        <main class="">

            <section class="section section--header">
                <h1 class="title">Trips</h1>
                <p>Select a trip to view details.</p>
            </section>

            <ul class="trip_card_list grid"
                role="list"
                v-if="trips.length > 0">

                <li v-for="trip in trips">
                    <TripCard :data="trip"></TripCard>
                </li>

            </ul>
        </main>
    </div>
</template>

<style lang="scss"
       scoped>

    @use "@/sass/abstracts" as *;

    .trip_card_list {
        --gap: #{$gap};
        padding-block: $padding-xl;
    }

</style>