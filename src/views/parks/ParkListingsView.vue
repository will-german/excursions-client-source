<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { Header, ParkCard, FontAwesomeIcon } from '@/components/exporter';
    import { useParkStore } from '@/stores/parkStore';
    import { useSearchStore } from '@/stores/searchStore';

    const router = useRouter();

    const parkStore = useParkStore();
    const searchStore = useSearchStore();

    const data = ref([]);
    const parks = ref(searchStore.getResults);
    const campgrounds = ref([]);
    const thingstodo = ref([]);

    const query = ref();
    const count = ref();

    onMounted(async () => {
        query.value = searchStore.getQuery[0];
        count.value = searchStore.getResults.length;

        await GetCampgrounds();
        await GetThingsToDo();

        parks.value.forEach(park => {
            let matchedCampgrounds = [];
            let matchedThingstodo = [];

            campgrounds.value.forEach(campground => {
                if (park.parkCode === campground.parkCode) {
                    matchedCampgrounds.push(campground);
                }
            });

            thingstodo.value.forEach(thingtodo => {
                thingtodo.relatedParks.forEach(relatedPark => {
                    if (park.parkCode === relatedPark.parkCode) {
                        matchedThingstodo.push(thingtodo);
                    }
                });
            });

            const obj = {
                "park": park,
                "campgrounds": matchedCampgrounds,
                "thingstodo": matchedThingstodo,
            };

            data.value.push(obj);
        });
    });

    async function GetCampgrounds() {
        let codes = [];
        parks.value.forEach(park => {
            codes.push(park.parkCode);
        });

        let response = await parkStore.getCampgroundData(codes);

        if (response.status === 200) {
            campgrounds.value = response.data.data;
        }

        console.log("Fetched Campgrounds");
    }

    async function GetThingsToDo() {
        let codes = [];
        parks.value.forEach(park => {
            codes.push(park.parkCode);
        });

        let response = await parkStore.getThingsToDoData(codes);

        if (response.status === 200) {
            thingstodo.value = response.data.data;
        }

        console.log("Fetched Thingstodo");
    }

    /**
     *  TODO: Push to new page (search-results? --> Parks?)
     *  Full Page Image of first image on NPS object stored in parkStore
     *  
     *  Show the results in a card-style grid.
     *  Pre-fetch all campground data related to parks
     *  Explore pre-fetch on things-to-do as well, but do not stress it
     * 
     *  When a user clicks on a card it takes them to the full-details page.
     *  Has a 100vw x 100vh image with summary details and then is scrollable
     *  for more details like campgrounds. There are action buttons like "Create Trip"
     *  which will let the user go into the Create Trip page with the Park Data.
     */

</script>

<template>
    <div id="wrapper"
         class="grid">
        <main class="">
            <section class="section section--header">
                <h1 class="title">Search Results</h1>
                <p>Showing {{ count }} results for {{ query }}. Click on a park to view details.</p>
            </section>

            <!--
                TODO: Implement pagination for more than 10 items at a time
            -->
            <ul class="park_card_list grid"
                role="list"
                v-if="parks.length > 0">

                <li v-for="item in data">
                    <ParkCard :data="item"></ParkCard>
                </li>

            </ul>
        </main>
    </div>
</template>

<style lang="scss"
       scoped>

    @use "@/sass/abstracts" as *;

    .park_card_list {
        --gap: #{$gap};
        padding-block: $padding-xl;
    }

</style>