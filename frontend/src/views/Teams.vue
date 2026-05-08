<template>
  <div class="teams-page">
    <h1 class="page-title">Футбольные команды</h1>

    <div class="controls">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Поиск команд..."
          class="search-input"
          @keyup.enter="searchTeams"
        />
        <button @click="searchTeams" class="search-btn">🔍 Найти</button>
      </div>

      <div class="league-select" v-if="leagues.length">
        <select v-model="selectedLeagueId" @change="loadTeamsByLeague">
          <option value="">Выберите лигу</option>
          <option v-for="league in leagues" :key="league.idLeague" :value="league.idLeague">
            {{ league.strLeague }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="footballStore.loading" class="loading-wrapper">
      <LoadingSpinner text="Загрузка команд..." />
    </div>

    <div v-else-if="footballStore.error" class="error-wrapper">
      <ErrorMessage :message="footballStore.error" @retry="retryLoad" />
    </div>

    <div v-else class="teams-grid">
      <div
        v-for="team in footballStore.teams"
        :key="team.idTeam"
        class="team-card"
        @click="viewTeamDetails(team.idTeam)"
      >
        <img
          v-if="team.strTeamBadge"
          :src="team.strTeamBadge"
          :alt="team.strTeam"
          class="team-badge"
        />
        <div class="team-icon" v-else>⚽</div>
        <h3>{{ team.strTeam }}</h3>
        <p>{{ team.strLeague || 'Лига не указана' }}</p>
        <p class="country">{{ team.strCountry || 'Страна не указана' }}</p>
      </div>

      <div v-if="footballStore.teams.length === 0 && !footballStore.loading" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Команды не найдены</h3>
        <p>Попробуйте изменить параметры поиска или выберите другую лигу</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFootballStore } from '@/stores/football'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import type { League } from '@/types'

const route = useRoute()
const router = useRouter()
const footballStore = useFootballStore()
const searchQuery = ref('')
const selectedLeagueId = ref('')
const leagues = ref<League[]>([])

const loadLeagues = async () => {
  if (footballStore.leagues.length === 0) {
    await footballStore.fetchLeagues()
  }
  leagues.value = footballStore.leagues
}

const loadTeamsByLeague = async () => {
  if (selectedLeagueId.value) {
    await footballStore.fetchTeamsByLeague(selectedLeagueId.value)
  }
}

const searchTeams = async () => {
  if (searchQuery.value.trim()) {
    await footballStore.searchTeams(searchQuery.value)
    selectedLeagueId.value = ''
  }
}

const retryLoad = () => {
  if (selectedLeagueId.value) {
    loadTeamsByLeague()
  } else if (searchQuery.value) {
    searchTeams()
  }
}

const viewTeamDetails = (teamId: string) => {
  router.push(`/team/${teamId}`)
}

// Проверяем URL параметры при монтировании
onMounted(async () => {
  await loadLeagues()

  const leagueId = route.query.leagueId as string
  if (leagueId) {
    selectedLeagueId.value = leagueId
    await loadTeamsByLeague()
  }
})

// Сброс при смене типа поиска
watch(selectedLeagueId, (newVal) => {
  if (newVal) {
    searchQuery.value = ''
  }
})

watch(searchQuery, (newVal) => {
  if (newVal) {
    selectedLeagueId.value = ''
  }
})
</script>

<style scoped>
.teams-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-bar {
  flex: 2;
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-btn {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.search-btn:hover {
  background: #5a67d8;
}

.league-select {
  flex: 1;
}

.league-select select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.team-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.team-badge {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.team-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.team-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.team-card p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.country {
  font-size: 0.8rem;
  color: #667eea;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.empty-state p {
  color: #666;
}

.loading-wrapper,
.error-wrapper {
  padding: 3rem;
  text-align: center;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }

  .teams-grid {
    grid-template-columns: 1fr;
  }
}
</style>
