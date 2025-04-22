<script setup>
    import { ref } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { Logo } from '@/components/exporter';
    import { useUserStore } from '@/stores/userStore';

    const router = useRouter();

    const userStore = useUserStore();

    async function signOut() {
        let response = await userStore.signUserOut();

        if (response.ok) {
            if (response.status === 200) {
                // TODO: Clear all pinia stores

                router.push({
                    name: 'home'
                });
            }
        }
    }

</script>

<template>
    <header class="header">
        <!-- <Logo /> -->

        <nav class="nav">
            <ul class="nav_list flex--row"
                role="list">
                <li>
                    <RouterLink to=""
                                class="nav_link">
                        Link 1
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to=""
                                class="nav_link">
                        Link 2
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to=""
                                class="nav_link">
                        Link 3
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style lang="scss"
       scoped>

    @use '@/sass/abstracts' as *;

    .header {
        --_padding: #{$header-padding};
        --_spacer: #{$margin-xl};

        // glassmorphism background
        position: fixed;
        top: calc(var(--_spacer) / 2);
        right: var(--_spacer);

        width: max-content;

        background: $header-bg;
        color: $header-text;

        padding-block: calc(var(--_padding) / 1);
        padding-inline: var(--_padding);

        border-width: $header-border-width;
        border-style: $header-border-style;
        border-color: $header-border-color;
        border-radius: $header-border-radius;

        box-shadow: $header-box-shadow;
        backdrop-filter: $header-backdrop-filter;
    }

    .nav {
        --gap: #{$header-nav-gap};
    }

    .nav_list {}

    .nav_link {
        --_bg: #{$nav-link-bg};
        --_color: #{$nav-link-text};
        --_padding: #{$nav-link-padding};

        background: var(--_bg);
        color: var(--_color);

        padding-block: calc(var(--_padding) / 1.5);
        padding-inline: var(--_padding);
        border: $nav-link-border;
    }

</style>