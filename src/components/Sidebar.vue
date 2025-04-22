<script setup>
</script>

<template>
    <aside class="sidebar grid">
        <slot name="header"></slot>
        <slot name="body"></slot>
    </aside>
</template>

<style lang="scss"
       scoped>

    @use '@/sass/abstracts' as *;

    .sidebar {
        width: 100%;
        min-width: 24rem; // "min-content" on grid-template-columns container makes this required. Can be fixed by changing g-t-c declaration.

        // realistically on g-t-c the max should never be "max-content" but rather the min should be that value. oh well

        // background: rgba(255, 255, 255, 0.25);
        // backdrop-filter: blur(4px);
        background: var(--neutral-100);
        color: $text;

        padding-block: $padding-xl;
        padding-inline: $padding-xl;

        // border: $border-width-default $border-style-default rgba(255, 255, 255, 0.25);
        border: $border-width-default $border-style-default var(--neutral-100);
        border-radius: $border-radius-default;

        box-shadow: $box-shadow-default;

        position: relative;
    }

</style>