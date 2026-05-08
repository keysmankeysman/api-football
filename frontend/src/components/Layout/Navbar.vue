<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/dashboard" class="brand"> ⚽ Football App </router-link>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
        <router-link to="/dashboard" class="nav-link">Главная</router-link>
        <router-link to="/leagues" class="nav-link">Лиги</router-link>
        <router-link to="/teams" class="nav-link">Команды</router-link>
      </div>

      <div class="navbar-end">
        <div class="user-info">
          <span class="username">👤 {{ authStore.currentUser?.username }}</span>
          <button @click="handleLogout" class="logout-btn">Выйти</button>
        </div>
        <button class="burger-menu" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isMenuOpen = ref(false)

const handleLogout = async () => {
  await authStore.logout()
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.navbar-end {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-size: 0.9rem;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.burger-menu {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.burger-menu span {
  width: 25px;
  height: 3px;
  background: white;
  margin: 3px 0;
  transition: 0.3s;
}

@media (max-width: 768px) {
  .burger-menu {
    display: flex;
  }

  .navbar-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    flex-direction: column;
    padding: 1rem;
    text-align: center;
  }

  .navbar-menu.is-active {
    display: flex;
  }

  .burger-menu.is-active span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 6px);
  }

  .burger-menu.is-active span:nth-child(2) {
    opacity: 0;
  }

  .burger-menu.is-active span:nth-child(3) {
    transform: rotate(-45deg) translate(8px, -6px);
  }
}
</style>
