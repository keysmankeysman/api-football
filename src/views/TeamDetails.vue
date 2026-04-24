<template>
  <div class="team-details" v-if="team">
    <div class="team-header">
      <img
        v-if="team.strTeamBadge"
        :src="team.strTeamBadge"
        :alt="team.strTeam"
        class="team-badge-large"
      />
      <div class="team-info">
        <h1>{{ team.strTeam }}</h1>
        <p class="league">{{ team.strLeague }} • {{ team.strCountry }}</p>
        <p class="stadium">🏟️ Стадион: {{ team.strStadium || 'Не указан' }}</p>
        <p class="formed">📅 Основана: {{ team.intFormedYear || 'Не указано' }}</p>
        <a v-if="team.strWebsite" :href="team.strWebsite" target="_blank" class="website">
          🌐 Официальный сайт
        </a>
      </div>
    </div>

    <div class="team-description" v-if="team.strDescriptionEN">
      <h2>Описание</h2>
      <p>{{ team.strDescriptionEN }}</p>
    </div>

    <div class="last-matches">
      <h2>Последние матчи</h2>
      <div v-if="footballStore.loading" class="loading-wrapper">
        <LoadingSpinner text="Загрузка матчей..." />
      </div>
      <div v-else-if="lastMatches.length === 0" class="no-matches">
        <p>Нет данных о последних матчах</p>
      </div>
      <div v-else class="matches-list">
        <div v-for="match in lastMatches" :key="match.idEvent" class="match-card">
          <div class="match-date">{{ formatDate(match.dateEvent) }}</div>
          <div class="match-teams">
            <div class="home-team">{{ match.strHomeTeam }}</div>
            <div class="score">
              {{ match.intHomeScore || '?' }} - {{ match.intAwayScore || '?' }}
            </div>
            <div class="away-team">{{ match.strAwayTeam }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="back-button">
      <button @click="goBack" class="back-btn">← Назад к командам</button>
    </div>
  </div>

  <div v-else-if="footballStore.loading" class="loading-full">
    <LoadingSpinner text="Загрузка информации о команде..." />
  </div>

  <div v-else class="error-full">
    <ErrorMessage message="Команда не найдена" />
    <button @click="goBack" class="back-btn">Вернуться</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFootballStore } from '@/stores/football'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import type { Event } from '@/types'

const route = useRoute()
const router = useRouter()
const footballStore = useFootballStore()

const team = computed(() => footballStore.currentTeam)
const lastMatches = computed(() => footballStore.lastEvents)

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Дата не указана'
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const goBack = () => {
  router.push('/teams')
}

onMounted(async () => {
  const teamId = route.params.id as string
  if (teamId) {
    await footballStore.fetchTeamDetails(teamId)
  }
})
</script>

<style scoped>
.team-details {
  max-width: 1000px;
  margin: 0 auto;
}

.team-header {
  display: flex;
  gap: 2rem;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.team-badge-large {
  width: 150px;
  height: 150px;
  object-fit: contain;
}

.team-info {
  flex: 1;
}

.team-info h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.team-info p {
  margin-bottom: 0.5rem;
  color: #666;
}

.league {
  font-size: 1.1rem;
  font-weight: 500;
  color: #667eea;
}

.website {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s;
}

.website:hover {
  background: #5a67d8;
}

.team-description {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.team-description h2 {
  margin-bottom: 1rem;
  color: #333;
}

.team-description p {
  line-height: 1.6;
  color: #666;
}

.last-matches {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.last-matches h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.match-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: transform 0.2s;
}

.match-card:hover {
  transform: translateX(5px);
  border-color: #667eea;
}

.match-date {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 0.5rem;
}

.match-teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.home-team,
.away-team {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.score {
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 6px;
}

.no-matches {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.back-button {
  text-align: center;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #5a67d8;
}

.loading-full,
.error-full {
  text-align: center;
  padding: 4rem;
}

@media (max-width: 768px) {
  .team-header {
    flex-direction: column;
    text-align: center;
  }

  .match-teams {
    flex-direction: column;
    text-align: center;
  }
}
</style>
