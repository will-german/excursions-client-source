<script setup>
    import { defineProps } from 'vue';

    const { icon } = defineProps(['icon']);
</script>

<template>
    <i :class="icon"
       aria-hidden="true"></i>
</template>

<style lang="scss"
       scoped>

    @use '@/sass/abstracts' as *;

</style>