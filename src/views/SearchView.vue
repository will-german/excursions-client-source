<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { Header, FormInput, FormButton, FontAwesomeIcon } from '@/components/exporter';
    import { useParkStore } from '@/stores/parkStore';
    import { useSearchStore } from '@/stores/searchStore';

    const router = useRouter();

    const parkStore = useParkStore();
    const searchStore = useSearchStore();

    const summaries = ref(parkStore.getSummaries);
    const location = ref('');
    const query = ref('');

    onMounted(() => {
        if (summaries.value.length === 0 || !summaries.value) {
            GetParkSummaries();
        }
    });

    async function GetParkSummaries() {
        /**
         *  For some ungodly reason this is taking FOREVER to get a
         *  response back. Either we hit the 100 NPS Call Cap OR
         *  my IP was blacklisted by Azure.
         */
        console.log("Attempting to fetch park summaries...");

        let response = await parkStore.getSummaryData();

        if (response.ok) {
            summaries.value = parkStore.getSummaries;
            console.log(`Fetch park summaries response: ${response.status}`);
        }
    }

    async function SearchParks() {
        console.log("Attempting to search parks...");

        searchStore.setQuery(location.value);
        query.value = searchStore.getQuery;

        let results = [];

        console.log(summaries.value);

        // there is a problem with this code
        summaries.value.forEach(summary => {
            query.value.forEach(query => {

                if (results.includes(query)) {
                    return;
                }

                if (summary.parkCode.includes(query) ||
                    summary.fullName.includes(query) ||
                    summary.description.includes(query)) {
                    results.push(summary.parkCode);
                }
            });
        });

        let response = await parkStore.getParkData(results);

        console.log(response);

        if (response.status === 200) {
            searchStore.results = response.data.data;

            router.push({
                name: 'park-listings'
            });
        } else {
            // handle errors
        }

        return response;
    }

</script>

<template>
    <!-- <Header>

        This should just be the user profile or a hamburger menu that opens into a sidebar

    </Header> -->
    <main class="container grid--content-center">
        <h1 class="subheading">Your great adventure starts here!</h1>

        <form action=""
              class="form grid--content-center">

            <FormInput type="text"
                       name="location"
                       placeholder="Yellowstone"
                       required="true"
                       v-model="location">
                <template #icon>
                    <font-awesome-icon icon="fa-solid fa-location-dot" />
                </template>
            </FormInput>

            <!--
                TODO: Implement a dropdown menu (scrollable) that will show a list of results
                that match the input from the user.
            -->

            <!--
                TODO: Replace default icon (pseudo-elm hide) with custom icon
                TODO: Attach event listener to open the date picker to the new icon
            -->

            <FormButton text="Get Started"
                        type="submit"
                        customClasses="button--dark--solid--round"
                        @click.prevent.stop="SearchParks()">
                <template #prefix-icon>
                    <font-awesome-icon icon="fa-solid fa-rocket" />
                </template>
            </FormButton>
        </form>
    </main>
</template>

<style lang="scss"
       scoped>

    @use '@/sass/abstracts' as *;

    main {
        --gap: #{$gap-xl};
    }

    main::before,
    main::after {
        --_border-size: 0.25rem;
        --_border-style: solid;
        --_border-color: var(--neutral-400);
        --_spacer: #{$margin-xl};

        content: '';
        position: absolute;

        width: 15%;
        aspect-ratio: 1 / 1;
    }

    main::before {
        top: var(--_spacer);
        left: var(--_spacer);

        border-top: var(--_border-size) var(--_border-style) var(--_border-color);
        border-left: var(--_border-size) var(--_border-style) var(--_border-color);
    }

    main::after {
        bottom: var(--_spacer);
        right: var(--_spacer);

        border-bottom: var(--_border-size) var(--_border-style) var(--_border-color);
        border-right: var(--_border-size) var(--_border-style) var(--_border-color);
    }

    .subheading {
        text-transform: capitalize;
    }

    .form {
        grid-template-columns: minmax(0, 1fr) minmax(0, max-content);
        min-width: 48rem;
    }

    .form > .field {
        width: 100%;
    }

    :deep(.field > label) {
        display: none;
    }

</style>