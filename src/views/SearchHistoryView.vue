<script setup>
    import { ref, onMounted, watchEffect } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { Sidebar, FontAwesomeIcon } from '@/components/exporter';
    import { useUserStore } from '@/stores/userStore';
    // import { useParkStore } from '@/stores/parkStore';
    import { useSearchStore } from '@/stores/searchStore';
    import { resetStores } from '@/composables/ResetStores';

    const router = useRouter();

    const userStore = useUserStore();
    // const parkStore = useParkStore();
    const searchStore = useSearchStore();

    const count = ref(0);
    const query = ref();

    onMounted(() => {
        query.value = searchStore.getQuery[0];
        count.value = searchStore.getResults.length;
    });

    async function signOut() {
        let response = await userStore.signUserOut();

        if (response.status === 200) {

            resetStores();

            router.push({
                name: 'home',
            });
        }
    }

</script>

<template>
    <Sidebar>
        <template #body>
            <nav class="nav grid">
                <div class="nav_section">
                    <RouterLink to="/main"
                                class="nav_link nav_link--logo">
                        Excursions
                    </RouterLink>
                </div>
                <div class="nav_section">
                    <RouterLink to="/search"
                                class="nav_link">
                        <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                        Discover
                        <font-awesome-icon icon="fa-solid fa-angle-right" />
                    </RouterLink>
                </div>
                <div class="nav_section">
                    <p>Showing {{ count }} results for {{ query }}</p>
                </div>
                <div class="nav_section">
                    <button class="nav_link nav_link--button"
                            @click.prevent.stop="signOut()">
                        <font-awesome-icon icon="fa-solid fa-power-off" />
                        Sign Out
                    </button>
                </div>
            </nav>
        </template>
    </Sidebar>
</template>

<style lang="scss"
       scoped>

    @use '@/sass/abstracts' as *;

    .nav {
        // --gap: #{$gap-lg};
        // --gap: #{$gap};
        --gap: 0;
        grid-template-rows: repeat(auto-fit, minmax(0, max-content));
    }

    .nav_section {
        padding-block: $gap;

        &:not(:last-child) {
            border-bottom: $border-width-default $border-style-default var(--neutral-200);
        }
    }

    .nav_heading {
        --gap: #{$gap-sm};

        background: transparent;
        color: $text-inverse;

        width: 100%;

        // padding-block: $padding;
        // margin-top: $margin-lg;
        // margin-bottom: $margin-sm;

        font-size: $fs-paragraph;
        font-weight: $fw-default;

        // border-block: $border-width-default $border-style-default $text-inverse; 
        // opacity: 65%;
    }

    .nav_list {
        --gap: #{$gap-sm};
    }

    :deep(.nav_link) {
        display: grid;
        grid-template-columns: minmax(0, $gap-lg) minmax(0, 1fr) minmax(0, max-content);
        gap: $gap;

        align-items: center;

        width: 100%;
        max-width: unset;

        background: transparent;
        color: $text-inverse;

        padding-block: $padding-sm;

        border: $border-width-default $border-style-default transparent;
    }

    :deep(.nav_link > .flex) {
        --gap: #{$gap};
    }

    :deep(.nav_link > .flex > .nav_link_count) {
        color: var(--neutral-400);
        border: 0;
    }

    :deep(.nav_link > i:first-child) {
        color: var(--primary-600);
        place-self: center;
    }

    :deep(.nav_link >i:last-child) {
        color: var(--neutral-400);
        place-self: center;
    }

    .nav_link--logo {
        color: var(--primary-600);

        font-size: $fs-subheading;
        font-weight: $fw-bold;

        padding-block: 0;
        padding-inline: $padding-xs;
    }

    .nav_link--button {
        grid-template-columns: minmax(0, $gap-lg) minmax(0, 1fr);
        place-items: start;
    }

</style>