import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { League, Team, Event } from '@/types'
import { footballAPI } from '@/api/football'

export const useFootballStore = defineStore('football', () => {
    const leagues = ref<League[]>([])
    const topLeagues = ref<League[]>([])
    const teams = ref<Team[]>([])
    const currentTeam = ref<Team | null>(null)
    const lastEvents = ref<Event[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Загрузка всех лиг
    const fetchLeagues = async () => {
        loading.value = true
        error.value = null

        try {
            const data = await footballAPI.getLeagues()
            leagues.value = data.slice(0, 50) // Берем первые 50 для производительности
        } catch (err: any) {
            error.value = err.message || 'Ошибка загрузки лиг'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    // Загрузка топ лиг
    const fetchTopLeagues = async () => {
        loading.value = true
        error.value = null

        try {
            const data = await footballAPI.getTopLeagues()
            topLeagues.value = data
        } catch (err: any) {
            error.value = err.message || 'Ошибка загрузки топ лиг'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    // Загрузка команд по лиге
    const fetchTeamsByLeague = async (leagueId: string) => {
        loading.value = true
        error.value = null

        try {
            const data = await footballAPI.getTeamsByLeague(leagueId)
            teams.value = data
            return data
        } catch (err: any) {
            error.value = err.message || 'Ошибка загрузки команд'
            console.error(err)
            return []
        } finally {
            loading.value = false
        }
    }

    // Загрузка деталей команды
    const fetchTeamDetails = async (teamId: string) => {
        loading.value = true
        error.value = null

        try {
            const data = await footballAPI.getTeamDetails(teamId)
            currentTeam.value = data

            // Также загружаем последние матчи
            if (data) {
                await fetchLastEvents(teamId)
            }

            return data
        } catch (err: any) {
            error.value = err.message || 'Ошибка загрузки деталей команды'
            console.error(err)
            return null
        } finally {
            loading.value = false
        }
    }

    // Загрузка последних матчей
    const fetchLastEvents = async (teamId: string) => {
        try {
            const data = await footballAPI.getLastEvents(teamId)
            lastEvents.value = data.slice(0, 10) // Последние 10 матчей
        } catch (err: any) {
            console.error(err)
            lastEvents.value = []
        }
    }

    // Поиск команд
    const searchTeams = async (query: string) => {
        loading.value = true
        error.value = null

        try {
            const data = await footballAPI.searchTeams(query)
            teams.value = data
            return data
        } catch (err: any) {
            error.value = err.message || 'Ошибка поиска команд'
            console.error(err)
            return []
        } finally {
            loading.value = false
        }
    }

    const clearError = () => {
        error.value = null
    }

    return {
        leagues,
        topLeagues,
        teams,
        currentTeam,
        lastEvents,
        loading,
        error,
        fetchLeagues,
        fetchTopLeagues,
        fetchTeamsByLeague,
        fetchTeamDetails,
        searchTeams,
        clearError
    }
})