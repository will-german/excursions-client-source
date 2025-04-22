<script setup>
    import { ref } from 'vue';
    import { RouterView, useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userStore';
    import { useParkStore } from '@/stores/parkStore';

    const router = useRouter();
    const currentRoute = ref(router.currentRoute.value.name);

    const userStore = useUserStore();
    const parkStore = useParkStore();

</script>

<template>
    <main class="container grid">
        <RouterView name="leftBar"
                    class="bar bar--left"></RouterView>
        <RouterView name="centerBar"
                    class="bar bar--center"></RouterView>
        <RouterView name="rightBar"
                    class="bar bar--right"></RouterView>
    </main>
</template>

<style lang="scss"
       scoped>

    @use '@/sass/abstracts' as *;

    main[class*="container"] {
        --gap: #{$gap-xl};

        grid-template-columns: repeat(auto-fit, minmax(0, max-content));
        grid-template-columns: minmax(0, max-content) minmax(0, 1fr) minmax(0, max-content);
        grid-template-areas: 'leftBar centerBar rightBar';

        padding: 0;
    }

    [class*="bar"] {
        position: relative;
    }

    :deep([class*="bar--left"]) {
        grid-area: leftBar;
    }

    :deep([class*="bar--center"]) {
        grid-area: centerBar;
        padding-block: $padding-xl;
    }

    :deep([class*="bar--right"]) {
        grid-area: rightBar;
        border-left: $border-width-default $border-style-default var(--neutral-400);
        padding-left: $padding-xl;
    }

    // #region generic content styling

    :deep(.section) {}

    :deep(.section > .title) {
        color: var(--primary-400);
        padding-block: $padding-xs;
    }

    :deep(.section--header) {}

    :deep(.section--body) {}

    :deep(.section--footer) {}

    // #endregion

</style>