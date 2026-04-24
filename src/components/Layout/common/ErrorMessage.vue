<template>
  <div class="error-message" :class="type">
    <span class="icon">{{ icon }}</span>
    <span class="message">{{ message }}</span>
    <button v-if="onRetry" @click="onRetry" class="retry-btn">Повторить</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  message: string
  type?: 'error' | 'warning' | 'info'
  onRetry?: () => void
}>()

const icon = computed(() => {
  switch (props.type) {
    case 'error':
      return '❌'
    case 'warning':
      return '⚠️'
    case 'info':
      return 'ℹ️'
    default:
      return '❌'
  }
})
</script>

<style scoped>
.error-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.error-message.error {
  background: #fed7d7;
  color: #742a2a;
  border-left: 4px solid #e53e3e;
}

.error-message.warning {
  background: #feebc8;
  color: #7b341e;
  border-left: 4px solid #ed8936;
}

.error-message.info {
  background: #bee3f8;
  color: #2c5282;
  border-left: 4px solid #4299e1;
}

.retry-btn {
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
