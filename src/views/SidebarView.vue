<script setup>
    import { ref, onMounted, watchEffect } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userStore';
    import { resetStores } from '@/composables/ResetStores'; // would have to be a class to work w/ exporter files :/

    import { Sidebar, FontAwesomeIcon } from '@/components/exporter';

    const router = useRouter();

    const userStore = useUserStore();
    const user = ref({});

    const excursionCount = ref();
    const tripCount = ref();
    const inviteCount = ref();

    onMounted(async () => {
        user.value = userStore.getUser;

        excursionCount.value = user.value.hostedExcursions.length + user.value.sharedExcursions.length;

        tripCount.value = user.value.hostedTrips.length;

        inviteCount.value = user.value.incomingExcursionInvites.length + user.value.outgoingExcursionInvites.length;
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
            <!--
                TODO: Handle active state to show the arrow, if NOT active do not show.
            -->
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
                    <!-- <h2 class="nav_heading flex--row--align-center">
                        <font-awesome-icon icon="fa-solid fa-suitcase" />
                        Excursions
                    </h2> -->
                    <ul class="nav_list flex--col"
                        role="list">
                        <li>
                            <RouterLink to=""
                                        class="nav_link">
                                <font-awesome-icon icon="fa-solid fa-car-side" />
                                <span class="flex">Excursions <span
                                          class="nav_link_count">{{ excursionCount }}</span></span>
                                <font-awesome-icon icon="fa-solid fa-angle-right" />
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="trips"
                                        class="nav_link">
                                <font-awesome-icon icon="fa-solid fa-suitcase-rolling" />
                                <span class="flex">Trips <span class="nav_link_count">{{ tripCount }}</span></span>
                                <font-awesome-icon icon="fa-solid fa-angle-right" />
                            </RouterLink>
                        </li>
                    </ul>
                </div>
                <div class="nav_section">
                    <!-- <h2 class="nav_heading flex--row--align-center">
                        <font-awesome-icon icon="fa-solid fa-share-nodes" />
                        Social
                    </h2> -->
                    <ul class="nav_list flex--col"
                        role="list">
                        <li>
                            <RouterLink to=""
                                        class="nav_link">
                                <font-awesome-icon icon="fa-solid fa-envelope" />
                                <span class="flex">Invites <span class="nav_link_count">{{ inviteCount }}</span></span>
                                <font-awesome-icon icon="fa-solid fa-angle-right" />
                            </RouterLink>
                        </li>
                    </ul>
                </div>
                <div class="nav_section">
                    <!-- <h2 class="nav_heading flex--row--align-center">
                        <font-awesome-icon icon="fa-solid fa-user" />
                        Account
                    </h2> -->
                    <ul class="nav_list flex--col"
                        role="list">
                        <li>
                            <RouterLink to="profile"
                                        class="nav_link">
                                <font-awesome-icon icon="fa-solid fa-user" />
                                Profile
                                <font-awesome-icon icon="fa-solid fa-angle-right" />
                            </RouterLink>
                        </li>
                        <!-- <li>
                            <RouterLink to=""
                                        class="nav_link">
                                <font-awesome-icon icon="fa-solid fa-gear" />
                                Settings
                                <font-awesome-icon icon="fa-solid fa-angle-right" />
                            </RouterLink>
                        </li> -->
                    </ul>
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

        width: 297px; // T-T crying rn cuz pixels --> previously 416px
        position: fixed;
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