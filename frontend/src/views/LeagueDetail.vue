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
        <h1>{{ league?.strLeague || league?.strLeagueAlternate || 'Без названия' }}</h1>
        <div class="meta">
          <span v-if="league?.strLeagueAlternate" class="alternate-name">{{ league.strLeagueAlternate }}</span>
          <span class="sport">{{ league?.strSport || 'Спорт' }}</span>
          <span class="country">{{ league?.strCountry || 'Страна не указана' }}</span>
          <span v-if="league?.idLeague" class="id">ID: {{ league.idLeague }}</span>
        </div>
        <div v-if="league?.strBadge" class="badge">
          <img :src="league.strBadge" :alt="league.strLeague" class="league-badge" />
        </div>
      </div>

      <div v-if="teams.length > 0" class="teams-section">
        <h2>📋 Команды участницы ({{ teams.length }})</h2>
        <div class="teams-grid">
          <div v-for="team in teams" :key="team.idTeam" class="team-card">
            <div class="team-header">
              <img 
                v-if="team.strTeamBadge" 
                :src="team.strTeamBadge" 
                :alt="team.strTeam" 
                class="team-badge"
              />
              <h3>{{ team.strTeam }}</h3>
            </div>
            <div class="team-info">
              <p v-if="team.strLeague" class="league">
                <strong>Лига:</strong> {{ team.strLeague }}
              </p>
              <p v-if="team.strCountry" class="country">
                <strong>Страна:</strong> {{ team.strCountry }}
              </p>
              <p v-if="team.strStadium" class="stadium">
                <strong>Стадион:</strong> {{ team.strStadium }}
              </p>
              <p v-if="team.intFormedYear" class="founded">
                <strong>Основан:</strong> {{ team.intFormedYear }}
              </p>
              <p v-if="team.strDescriptionEN" class="description">
                {{ truncateText(team.strDescriptionEN, 100) }}
              </p>
              <a 
                v-if="team.strWebsite" 
                :href="team.strWebsite" 
                target="_blank" 
                rel="noopener noreferrer"
                class="website-link"
              >
                🌐 Официальный сайт
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading && !error" class="no-data">
        <p>😕 Нет данных о командах для этой лиги</p>
        <p class="hint">Возможно, в этой лиге пока нет зарегистрированных команд</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { footballAPI } from '../api/football'
import type { League, Team } from '../types' 

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const league = ref<League | null>(null)
const teams = ref<Team[]>([])
const loading = ref(true)
const error = ref('')

const loadLeagueData = async () => {
  const leagueId = route.params.id as string

  loading.value = true
  error.value = ''

  try {
    // Загружаем команды лиги (если API поддерживает такой метод)
    try {
      const teamsData = await footballAPI.getTeamsByLeague(leagueId)
      teams.value = teamsData || []
    } catch (teamsErr) {
      console.warn('Не удалось загрузить команды:', teamsErr)
      teams.value = []
    }

    // Загружаем информацию о лиге из всех доступных лиг
    try {
      const allLeagues = await footballAPI.getLeagues()
      const foundLeague = allLeagues.find((l) => l.idLeague === leagueId)
      league.value = foundLeague || null
    } catch (leagueErr) {
      console.warn('Не удалось загрузить информацию о лиге:', leagueErr)
      
      // Если не нашли лигу, но есть данные о командах, создаем базовую информацию
      if (teams.value.length > 0 && !league.value) {
        league.value = {
          idLeague: leagueId,
          strLeague: teams.value[0]?.strLeague || 'Лига',
          strSport: '',
          strLeagueAlternate: '',
          strCountry: teams.value[0]?.strCountry || '',
          strBadge: ''
        }
      }
    }

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

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
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
  position: relative;
}

.league-header h1 {
  margin: 0 0 15px 0;
  font-size: 32px;
}

.badge {
  position: absolute;
  top: 20px;
  right: 20px;
}

.league-badge {
  width: 60px;
  height: 60px;
  object-fit: contain;
  background: white;
  border-radius: 10px;
  padding: 5px;
}

.meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.sport,
.country,
.id,
.alternate-name {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.alternate-name {
  background: rgba(255, 255, 255, 0.3);
  font-style: italic;
}

.teams-section h2 {
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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

.team-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.team-badge {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.team-card h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  flex: 1;
}

.team-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #555;
}

.team-info strong {
  color: #333;
}

.website-link {
  display: inline-block;
  margin-top: 10px;
  padding: 6px 12px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 13px;
  transition: background 0.3s;
}

.website-link:hover {
  background: #5a67d8;
}

.description {
  color: #666;
  line-height: 1.4;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.no-data {
  text-align: center;
  padding: 60px;
  background: #f9f9f9;
  border-radius: 10px;
  color: #999;
}

.hint {
  font-size: 12px;
  color: #bbb;
  margin-top: 10px;
}
</style>