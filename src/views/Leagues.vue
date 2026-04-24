<template>
  <div class="leagues-page">
    <h1 class="page-title">Футбольные лиги</h1>

    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Поиск лиг..." class="search-input" />
    </div>

    <div v-if="footballStore.loading" class="loading-wrapper">
      <LoadingSpinner text="Загрузка лиг..." />
    </div>

    <div v-else-if="footballStore.error" class="error-wrapper">
      <ErrorMessage :message="footballStore.error" @retry="loadLeagues" />
    </div>

    <div v-else class="leagues-grid">
      <div
        v-for="league in filteredLeagues"
        :key="league.idLeague"
        class="league-card"
        @click="viewTeams(league.idLeague)"
      >
        <img
          v-if="league.strBadge"
          :src="league.strBadge"
          :alt="league.strLeague"
          class="league-badge"
        />
        <div class="league-icon" v-else>🏆</div>
        <h3>{{ league.strLeague }}</h3>
        <p>{{ league.strCountry || 'Международная' }}</p>
        <p class="sport-type">{{ league.strSport || 'Футбол' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFootballStore } from '@/stores/football'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const router = useRouter()
const footballStore = useFootballStore()
const searchQuery = ref('')

const filteredLeagues = computed(() => {
  if (!searchQuery.value) return footballStore.leagues
  return footballStore.leagues.filter(
    (league) =>
      league.strLeague.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (league.strCountry &&
        league.strCountry.toLowerCase().includes(searchQuery.value.toLowerCase())),
  )
})

const loadLeagues = async () => {
  await footballStore.fetchLeagues()
}

const viewTeams = (leagueId: string) => {
  router.push(`/teams?leagueId=${leagueId}`)
}

onMounted(() => {
  if (footballStore.leagues.length === 0) {
    loadLeagues()
  }
})
</script>

<style scoped>
.leagues-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

.search-bar {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.leagues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.league-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.league-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
}

.league-badge {
  width: 80px;
  height: auto;
  margin-bottom: 1rem;
}

.league-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.league-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.league-card p {
  font-size: 0.9rem;
  color: #666;
}

.sport-type {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
}

.loading-wrapper,
.error-wrapper {
  padding: 3rem;
  text-align: center;
}
</style>
