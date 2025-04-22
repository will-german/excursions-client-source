<script setup>

    import { defineProps } from 'vue';

    const { text, type } = defineProps({
        text: String,
        type: String,
        customClasses: String,
    });

</script>

<template>

    <button :type="type"
            :class="customClasses">
        <slot name="prefix-icon"></slot>
        {{ text }}
        <slot name="suffix-icon"></slot>
    </button>

</template>

<style lang="scss"
       scoped>

    @use '@/sass/abstracts' as *;

    // ----- [ Default ] ----- //

    [class*="button"] {
        --_bg: transparent;
        --_color: #{$button-text};
        --_padding: #{$button-padding};
        --_gap: #{$button-gap};
        --_border-color: var(--_bg);

        width: 100%;

        display: flex;
        flex-direction: row;
        gap: var(--_gap);

        align-items: center;
        justify-content: center;

        background: var(--_bg);
        color: var(--_color);

        padding-block: calc(var(--_padding) / 1.5);
        padding-inline: var(--_padding);

        font-size: $button-font-size;
        font-weight: $button-font-weight;

        text-decoration: none;

        border-width: $button-border-width;
        border-style: $button-border-style;
        border-color: var(--_border-color);
        border-radius: 0;

        cursor: pointer;
    }

    [class*="button"]:is(:hover, :focus) {}

    // ----- [ Color ] ----- //

    [class*="button"][class*="--dark"] {
        --_bg: #{$button-bg};
        --_color: #{$button-text};
        --_border-color: #{$button-bg};
    }

    [class*="button"][class*="--dark"]:is(:hover, :focus) {}

    [class*="button"][class*="--light"] {
        --_bg: #{$button-bg-inverse};
        --_color: #{$button-text-inverse};
        --_border-color: #{$button-bg-inverse};
    }

    [class*="button"][class*="--light"]:is(:hover, :focus) {}

    // ----- [ Weight ] ----- //

    [class*="--solid"] {
        --_border-color: transparent;
    }

    [class*="button"][class*="--solid"]:is(:hover, :focus) {}

    [class*="button"][class*="--outline"] {
        --_bg: transparent;
        --_border-color: #{$button-bg};
    }

    [class*="button"][class*="--outline"]:is(:hover, :focus) {}

    // ----- [ Shape ] ----- //

    [class*="button"][class*="--square"] {
        border-radius: #{$button-border-radius};
    }

    [class*="button"][class*="--square"]:is(:hover, :focus) {}

    [class*="button"][class*="--round"] {
        border-radius: #{$button-border-radius--round};

    }

    [class*="button"][class*="--round"]:is(:hover, :focus) {}

    // ----- [ Combos ] ----- //

    // TODO: Solve this section with sass:color lightness & custom function

    [class*="button"][class*="--dark--solid"],
    [class*="button"][class*="--solid--dark"] {
        --_bg: #{$button-bg};
        --_color: #{$button-text};
        --_border-color: #{$button-bg};
    }

    [class*="button"][class*="--dark--solid"]:is(:hover, :focus),
    [class*="button"][class*="--solid--dark"]:is(:hover, :focus) {}

    [class*="button"][class*="--dark--outline"],
    [class*="button"][class*="--outline--dark"] {
        --_bg: transparent;
        --_color: #{$button-text};
        --_border-color: #{$button-bg-inverse};
    }

    [class*="button"][class*="--dark--outline"]:is(:hover, :focus),
    [class*="button"][class*="--outline--dark"]:is(:hover, :focus) {}


    [class*="button"][class*="--light--solid"],
    [class*="button"][class*="--solid--light"] {
        --_bg: #{$button-bg-inverse};
        --_color: #{$button-text-inverse};
        --_border-color: #{$button-bg-inverse};
    }

    [class*="button"][class*="--light--solid"]:is(:hover, :focus),
    [class*="button"][class*="--solid--light"]:is(:hover, :focus) {}

    [class*="button"][class*="--light--outline"],
    [class*="button"][class*="--outline--light"] {
        --_bg: transparent;
        --_color: #{$button-text};
        --_border-color: #{$button-bg-inverse};
    }

    [class*="button"][class*="--light--outline"]:is(:hover, :focus),
    [class*="button"][class*="--outline--light"]:is(:hover, :focus) {}

</style>