<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>⚽ Регистрация</h2>
        <p>Создайте новый аккаунт</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>Имя пользователя</label>
          <input type="text" v-model="registerData.username" required placeholder="username" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            v-model="registerData.email"
            required
            placeholder="email@example.com"
          />
        </div>

        <div class="form-group">
          <label>Пароль</label>
          <input
            type="password"
            v-model="registerData.password"
            required
            placeholder="Минимум 6 символов"
          />
        </div>

        <div class="form-group">
          <label>Подтверждение пароля</label>
          <input type="password" v-model="registerData.confirmPassword" required />
        </div>

        <ErrorMessage v-if="error" :message="error" type="error" />

        <button type="submit" class="submit-btn" :disabled="authStore.loading">
          {{ authStore.loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>

        <p class="auth-link">Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import type { RegisterData } from '@/types'

const authStore = useAuthStore()
const error = ref('')

const registerData = reactive<RegisterData>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const handleRegister = async () => {
  if (registerData.password !== registerData.confirmPassword) {
    error.value = 'Пароли не совпадают'
    return
  }

  if (registerData.password.length < 6) {
    error.value = 'Пароль должен содержать минимум 6 символов'
    return
  }

  error.value = ''
  await authStore.register(registerData)
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
</style>
