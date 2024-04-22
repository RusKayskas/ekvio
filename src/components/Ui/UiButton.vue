<template>
  <button 
    :id="id"
    :type="type"
    :class="[
      'UiButton', 
      {'UiButton--is-pressed': isActive}
    ]"
    @click="onClick"
    :disabled="isDisabled"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
defineProps({
  id: {
    type: String,
    default: '',
  },
  type: {
    type: String as () => 'button' | 'reset' | 'submit' | undefined,
    default: 'button'
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: 'Button'
  }
});

const emit = defineEmits(['click']);
const onClick = () => {
  emit('click');
};
</script>

<style scoped lang="scss">
.UiButton {
  padding: 12px;
  font-size: 14px;
  color: #384252;
  border: 1px solid var(--border-color);
  background: var(--backgound-color);
  border-radius: 12px;
  cursor: pointer;
  transition: linear 0.2s;

  &:hover {
    background: var(--hover-color);
    border-color: var(--hover-border-color);
  }

  &:disabled {
    color: var(--text-color);
    pointer-events: none;
  }

  &--is-pressed {
    background: var(--border-color);
    border-color: var(--hover-border-color);
  }
}
</style>