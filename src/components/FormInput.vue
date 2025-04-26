<script setup>

    import { ref, defineProps, defineModel, watchEffect, useTemplateRef } from 'vue';
    import { FontAwesomeIcon } from './exporter';

    const { label, type, name, required, disabled } = defineProps({
        label: String,
        type: String,
        name: String,
        placeholder: String,
        required: String,
        disabled: String,
    });

    const isPassword = ref(false);
    const isRequired = ref(false);
    const isDisabled = ref(false);

    watchEffect(() => {
        if (type === 'password') {
            isPassword.value = true;
        }

        if (required === 'true') {
            isRequired.value = true;
        }

        if (disabled === 'true') {
            isDisabled.value = true;
        }
    });

    const model = defineModel();

    const input = useTemplateRef('input');

    function ToggleVisibility() {
        let type = input.value.getAttribute('type');

        if (type === 'password') {
            input.value.setAttribute('type', 'text');
        } else {
            input.value.setAttribute('type', 'password');
        }
    }

</script>

<template>
    <div class="field">
        <label :for="name">{{ label }}</label>
        <div class="field_body flex--row--align-center--justify-center">
            <slot name="icon">
            </slot>

            <input :type="type"
                   :name="name"
                   class="field_input"
                   :placeholder="placeholder"
                   :required="isRequired"
                   :disabled="isDisabled"
                   v-model="model"
                   ref="input">

            <button type="button"
                    class="field_button grid--items-center"
                    v-if="isPassword"
                    @click="ToggleVisibility()">
                <font-awesome-icon icon="fa-solid fa-eye" />
            </button>
        </div>
    </div>

</template>

<style lang="scss"
       scoped>

    @use '@/sass/abstracts' as *;

    .field {
        display: flex;
        flex-direction: column;
        gap: $gap-sm;
    }

    .field > label {
        color: var(--label-color, #{$text-inverse});
        text-transform: capitalize;
    }

    .field_body {
        --_bg: #{$form-input-bg};
        --_color: #{$form-input-text};
        --_padding: #{$form-input-padding};
        --_border-color: var(--_bg);
        --gap: #{$form-input-body-gap};

        --_icon-color: #{$form-input-bg};
        --_icon-opacity: 50%;

        background: var(--_bg);
        color: var(--_color);

        border-width: $form-input-border-width;
        border-style: $form-input-border-style;
        border-color: var(--_border-color);
        border-radius: $form-input-border-radius;

        box-shadow: $form-input-box-shadow;
    }

    :slotted(i[class*="fa"]) {
        --_padding: #{$form-icon-padding};

        color: var(--_form-input-color);

        font-size: $form-input-icon-size;

        padding-block: calc(var(--_padding) / 1.5);
        padding-left: var(--_padding);

        opacity: var(--_icon-opacity);
    }

    .field_input {
        width: 100%;

        background: inherit;
        color: inherit;

        padding-block: calc(var(--_padding) / 1.5);
        padding-inline: var(--_padding);

        border: 0;

        outline: 0;
    }

    // TODO: ==> Field Input Visual Validation
    // TODO: ==> Add Password Criteria Tooltip (hover event)

    .field_button {
        --gap: 0;
        --_bg: transparent;
        --_color: #{$button-text};
        --_padding: #{$form-icon-padding};

        width: 100%;
        max-width: max-content;

        background: var(--_bg);
        color: var(--_color);

        padding-block: calc(var(--_padding) / 1.5);
        padding-right: var(--_padding);

        color: var(--_form-input-color);
        opacity: var(--_icon-opacity);

        text-decoration: none;

        border-width: $button-border-width;
        border-style: $button-border-style;
        border-color: var(--_border-color);
        border-radius: 0;

        cursor: pointer;
    }

    // TOOD: ==> Button (Eye) Hover
</style>