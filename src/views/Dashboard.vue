<template>
  <div class="dashboard">
    <h1 class="page-title">Панель управления</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-info">
          <h3>Топ-лиги</h3>
          <p>{{ topLeaguesCount }} лиг</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⚽</div>
        <div class="stat-info">
          <h3>Команды</h3>
          <p>{{ teamsCount }} команд</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <h3>Матчи</h3>
          <p>{{ matchesCount }} матчей</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👤</div>
        <div class="stat-info">
          <h3>Пользователь</h3>
          <p>{{ authStore.currentUser?.username }}</p>
        </div>
      </div>
    </div>

    <div class="welcome-section">
      <h2>Добро пожаловать в Football App! ⚽</h2>
      <p>Здесь вы можете найти информацию о футбольных лигах, командах и матчах со всего мира.</p>

      <div class="quick-actions">
        <router-link to="/leagues" class="action-btn">
          <span>🏆</span>
          Просмотреть лиги
        </router-link>
        <router-link to="/teams" class="action-btn">
          <span>⚽</span>
          Поиск команд
        </router-link>
      </div>
    </div>

    <div class="top-leagues-section">
      <h2>Популярные лиги</h2>
      <div v-if="footballStore.loading" class="loading-wrapper">
        <LoadingSpinner text="Загрузка лиг..." />
      </div>
      <div v-else-if="footballStore.error" class="error-wrapper">
        <ErrorMessage :message="footballStore.error" @retry="loadTopLeagues" />
      </div>
      <div v-else class="leagues-grid">
        <div
          v-for="league in footballStore.topLeagues.slice(0, 6)"
          :key="league.idLeague"
          class="league-card"
          @click="viewLeagueTeams(league.idLeague)"
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
        </div>
      </div>
    </div>

    <div class="recent-info">
      <div class="info-box">
        <h3>🎯 О приложении</h3>
        <p>
          Football App использует TheSportsDB API для предоставления актуальной информации о
          футболе.
        </p>
        <ul>
          <li>✓ Более 100 лиг со всего мира</li>
          <li>✓ Информация о тысячах команд</li>
          <li>✓ Детальная статистика матчей</li>
          <li>✓ Обновления в реальном времени</li>
        </ul>
      </div>

      <div class="info-box">
        <h3>💡 Советы по использованию</h3>
        <ul>
          <li>• Перейдите в раздел "Лиги" для просмотра всех доступных лиг</li>
          <li>• Используйте поиск в разделе "Команды" для быстрого поиска</li>
          <li>• Нажмите на любую команду, чтобы увидеть детальную информацию</li>
          <li>• Смотрите последние результаты матчей в профиле команды</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFootballStore } from '@/stores/football'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const router = useRouter()
const authStore = useAuthStore()
const footballStore = useFootballStore()

const topLeaguesCount = computed(() => footballStore.topLeagues.length)
const teamsCount = ref(0)
const matchesCount = ref(0)

const loadTopLeagues = async () => {
  await footballStore.fetchTopLeagues()
}

const viewLeagueTeams = (leagueId: string) => {
  router.push(`/teams?leagueId=${leagueId}`)
}

onMounted(async () => {
  await loadTopLeagues()

  // Загружаем немного данных для статистики
  if (footballStore.topLeagues.value.length > 0) {
    const firstLeague = footballStore.topLeagues.value[0]
    const teams = await footballStore.fetchTeamsByLeague(firstLeague.idLeague)
    teamsCount.value = teams.length
    matchesCount.value = Math.floor(Math.random() * 100) + 50 // Демо-данные
  }
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 3rem;
}

.stat-info h3 {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-info p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.welcome-section h2 {
  margin-bottom: 1rem;
}

.welcome-section p {
  margin-bottom: 1.5rem;
  opacity: 0.95;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.3s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.top-leagues-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.top-leagues-section h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.leagues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.league-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.league-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background: #667eea;
  color: white;
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
}

.league-card p {
  font-size: 0.9rem;
  opacity: 0.8;
}

.recent-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.info-box {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-box h3 {
  margin-bottom: 1rem;
  color: #333;
}

.info-box ul {
  list-style: none;
  padding: 0;
}

.info-box li {
  padding: 0.5rem 0;
  color: #666;
  line-height: 1.5;
}

.loading-wrapper,
.error-wrapper {
  padding: 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .leagues-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .recent-info {
    grid-template-columns: 1fr;
  }
}
</style>
