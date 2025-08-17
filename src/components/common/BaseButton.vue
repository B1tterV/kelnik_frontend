<script setup lang="ts">
import { computed, type PropType } from 'vue';

const props = defineProps({
  text: { type: String, default: null},
  size: { type: String as PropType<"md">, default: "md"},
  color: {
    type: String as PropType<"gray">,
    default: "gray"
  },
  isBorder: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const formatedClasses = computed(() => {
  const defaultClasses = [
    `base-button_${props.size}`,
    `base-button_${props.color}`
  ]
  if (props.isBorder)
    defaultClasses.push(`base-button_${props.color}_border`)
  return defaultClasses
})
</script>

<template>
    <button
        class="base-button"
        :class="formatedClasses"
        :disabled="disabled"
    >
        <slot>
            {{ text }}
        </slot>
    </button>
</template>

<style scoped lang="scss">
.base-button{
    @include UI-16-24-500;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'PT Root UI', -apple-system, BlinkMacSystemFont, sans-serif;
    padding: 0 24px;
    outline: none;
    border: none;
    border-radius: 25px;
    gap: 8px;
    transition: all 0.3s ease;

    &:disabled {
        opacity: 0.7;
    }

    // Sizes
    &_md{
        height: 40px;
    }

    // Colors
    &_gray {
        background: $light-gray-button;
        color: $light-text-primary;

        &_border {
            background: transparent;
            border: 1px solid $light-gray-button;
        }

        // &:hover {
        //    background: $block-dark; 
        // }
    }
}
</style>