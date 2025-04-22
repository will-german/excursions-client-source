<script setup>

    import { onMounted, ref } from 'vue';
    import { QueryBuilder } from '@/scripts/exporter';

    const queryBuilder = new QueryBuilder();

    // #region Background Image

    const backgroundImage = ref();

    onMounted(() => {
        getBackgroundImage();
    });

    async function getBackgroundImage() {
        let url = `https://excursions-api-server.azurewebsites.net/multimedia/galleries/assets`;

        const options = {
            method: "GET",
        };

        const query = queryBuilder.build(
            {
                id: '9EC9C6F0-71F9-46D2-ACF6-8FCF163EDA9D',
                limit: '1',
            }
        );

        if (query) {
            url += query;
        }

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                const data = await response.json();
                backgroundImage.value = data.data[0].permalinkUrl;
            }
        } else {
            if (response.status === 400) {
                throw new Error({ 400: "Bad Request" });
            }

            if (response.status === 500) {
                throw new Error({ 500: "Internal Server Error" });
            }
        }

        return response;
    }

    // #endregion

    // #region Park Codes

    // #endregion

</script>

<template>
    <main class="container--main grid--content-center">
        <!--
            TODO: Suspense element for loading until fetching is done
            TODO: ==> PREFETCH DATA ON SIGNIN
            TODO: Add (silent) video media as background image
        -->
        <h1 class="title">USA <span>Excursions</span></h1>
        <p class="subheading">Visit to your favorite national parks, your own way.</p>
        <div class="actions flex--row--align-center--justify-center">
            <RouterLink to="sign-up"
                        class="button--light-outline--round">
                Sign Up
            </RouterLink>
            <RouterLink to="sign-in"
                        class="button">
                Sign In
            </RouterLink>
        </div>
    </main>
    <!-- <img :src="backgroundImage" alt=""> -->
</template>

<style lang="scss"
       scoped>

    @use "@/sass/abstracts" as *;

    main {
        // glassmorphism background or darken text with after pseudo element
        text-align: center;
    }

    .actions {
        padding-block: $padding-lg;
    }

    .title > span {
        color: var(--primary-400);
    }

    .subheading {
        max-width: 25ch;
    }

</style>