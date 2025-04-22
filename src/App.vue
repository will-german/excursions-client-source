<script setup>
    import { RouterView } from 'vue-router';
</script>

<template>
    <RouterView></RouterView>
    <video autoplay
           loop
           muted
           class="app_bg">
        <source src="@/assets/images/NPS.mp4">
    </video>
    <div class="app_overlay">

    </div>
</template>

<style lang="scss"
       scoped>

    @use '@/sass/abstracts' as *;

    div#app {
        position: relative;
    }

    .app_bg {
        position: fixed;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        object-fit: cover;

        z-index: -10;
    }

    .app_overlay {
        width: 100%;
        height: 100%;

        background: rgba(0, 0, 0, 0.5);

        position: fixed;
        top: 0;
        left: 0;

        z-index: -8;
    }


</style>
