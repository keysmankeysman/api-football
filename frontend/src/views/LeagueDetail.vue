<template>
  <div class="league-detail">
    <div class="header">
      <button @click="goBack" class="back-btn">← Назад к лигам</button>
      <button @click="logout" class="logout-btn">Выйти</button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка информации о лиге...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>❌ {{ error }}</p>
      <button @click="loadLeagueData" class="retry-btn">Повторить</button>
    </div>

    <div v-else class="content">
      <div class="league-header">
        <h1>{{ league?.name }}</h1>
        <div class="meta">
          <span class="code">{{ league?.code }}</span>
          <span class="area">{{ league?.area?.name }}</span>
          <span class="type">{{ league?.type === 'LEAGUE' ? 'Чемпионат' : 'Кубок' }}</span>
        </div>
      </div>

      <div v-if="teams.length > 0" class="teams-section">
        <h2>📋 Команды участницы ({{ teams.length }})</h2>
        <div class="teams-grid">
          <div v-for="team in teams" :key="team.id" class="team-card">
            <h3>{{ team.name }}</h3>
            <p v-if="team.shortName" class="short-name">{{ team.shortName }}</p>
            <p v-if="team.tla" class="tla">{{ team.tla }}</p>
            <p v-if="team.founded" class="founded">Основан: {{ team.founded }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="!loading && !error" class="no-data">
        <p>😕 Нет данных о командах для этой лиги</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { footballApi, type Competition, type Team } from '../api/football'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const league = ref<Competition | null>(null)
const teams = ref<Team[]>([])
const loading = ref(true)
const error = ref('')

const loadLeagueData = async () => {
  const leagueId = Number(route.params.id)

  loading.value = true
  error.value = ''

  try {
    // Для получения информации о лиге и командах используем разные эндпоинты
    const teamsData = await footballApi.getCompetitionTeams(leagueId)
    teams.value = teamsData.slice(0, 20) // Показываем первые 20 команд

    // Информацию о лиге получаем из списка всех лиг (упрощенно)
    const allLeagues = await footballApi.getCompetitions()
    const foundLeague = allLeagues.find((l) => l.id === leagueId)
    league.value = foundLeague || null

    if (!league.value && teams.value.length === 0) {
      error.value = 'Лига не найдена'
    }
  } catch (err) {
    console.error('Ошибка загрузки данных:', err)
    error.value = 'Не удалось загрузить данные о лиге'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/leagues')
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadLeagueData()
})
</script>

<style scoped>
.league-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.back-btn,
.logout-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.back-btn {
  background: #6c757d;
  color: white;
}

.back-btn:hover {
  background: #5a6268;
}

.logout-btn {
  background: #dc3545;
  color: white;
}

.logout-btn:hover {
  background: #c82333;
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 40px;
  color: #dc3545;
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.content {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.league-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.league-header h1 {
  margin: 0 0 15px 0;
  font-size: 32px;
}

.meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.code,
.area,
.type {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.teams-section h2 {
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.team-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  border-left: 4px solid #667eea;
}

.team-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.team-card h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
}

.short-name {
  color: #667eea;
  font-weight: bold;
  font-size: 14px;
  margin: 5px 0;
}

.tla {
  color: #666;
  font-size: 13px;
  font-family: monospace;
  margin: 5px 0;
  font-weight: 500;
}

.founded {
  color: #999;
  font-size: 13px;
  margin: 5px 0;
}

.no-data {
  text-align: center;
  padding: 60px;
  background: #f9f9f9;
  border-radius: 10px;
  color: #999;
}
</style>
