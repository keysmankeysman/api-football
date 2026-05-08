<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>⚽ Вход в Football App</h2>
        <p>Войдите чтобы продолжить</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="credentials.email" required placeholder="test@test.com" />
        </div>

        <div class="form-group">
          <label>Пароль</label>
          <input type="password" v-model="credentials.password" required placeholder="123456" />
        </div>

        <ErrorMessage v-if="authStore.error" :message="authStore.error" type="error" />

        <button type="submit" class="submit-btn" :disabled="authStore.loading">
          {{ authStore.loading ? 'Вход...' : 'Войти' }}
        </button>

        <p class="auth-link">
          Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
        </p>

        <div class="demo-info">
          <p>Тестовые данные:</p>
          <code>Email: test@test.com</code>
          <code>Пароль: 123456</code>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import type { LoginCredentials } from '@/types'

const authStore = useAuthStore()
const credentials = reactive<LoginCredentials>({
  email: '',
  password: '',
  // email: 'test@test.com',
  // password: '123456',
})

const handleLogin = async () => {
  await authStore.login(credentials)
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h2 {
  color: #333;
  margin-bottom: 10px;
}

.auth-header p {
  color: #666;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  color: #666;
}

.auth-link a {
  color: #667eea;
  text-decoration: none;
}

.demo-info {
  margin-top: 20px;
  padding: 15px;
  background: #f7fafc;
  border-radius: 8px;
  text-align: center;
}

.demo-info p {
  font-weight: 500;
  margin-bottom: 10px;
}

.demo-info code {
  display: block;
  color: #667eea;
  margin: 5px 0;
}
</style>
