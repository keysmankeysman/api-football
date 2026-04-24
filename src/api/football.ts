import api from './axios'
import type { League, Team, Event } from '@/types'

export const footballAPI = {
    // Получить список лиг
    async getLeagues(): Promise<League[]> {
        try {
            const response = await api.get('/all_leagues.php')
            return response.data.leagues || []
        } catch (error) {
            console.error('Error fetching leagues:', error)
            throw error
        }
    },

    // Получить топ-5 лиги (АПЛ, Ла Лига и т.д.)
    async getTopLeagues(): Promise<League[]> {
        const leagueIds = ['4328', '4331', '4332', '4334', '4335'] // ID топ лиг
        const promises = leagueIds.map(id =>
            api.get(`/lookupleague.php?id=${id}`)
        )
        const responses = await Promise.all(promises)
        return responses.map(res => res.data.leagues[0]).filter(Boolean)
    },

    // Поиск команд по лиге
    async getTeamsByLeague(leagueId: string): Promise<Team[]> {
        try {
            const response = await api.get(`/lookup_all_teams.php?id=${leagueId}`)
            return response.data.teams || []
        } catch (error) {
            console.error('Error fetching teams:', error)
            throw error
        }
    },

    // Получить детали команды
    async getTeamDetails(teamId: string): Promise<Team | null> {
        try {
            const response = await api.get(`/lookupteam.php?id=${teamId}`)
            return response.data.teams?.[0] || null
        } catch (error) {
            console.error('Error fetching team details:', error)
            throw error
        }
    },

    // Получить последние матчи команды
    async getLastEvents(teamId: string): Promise<Event[]> {
        try {
            const response = await api.get(`/eventslast.php?id=${teamId}`)
            return response.data.results || []
        } catch (error) {
            console.error('Error fetching last events:', error)
            throw error
        }
    },

    // Поиск команд
    async searchTeams(teamName: string): Promise<Team[]> {
        try {
            const response = await api.get(`/searchteams.php?t=${teamName}`)
            return response.data.teams || []
        } catch (error) {
            console.error('Error searching teams:', error)
            throw error
        }
    }
}