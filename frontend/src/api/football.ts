import api from './axios'
import type { League, Team, Event } from '@/types'

export const footballAPI = {
    async getLeagues(): Promise<League[]> {
        try {
            const response = await api.get('/all_leagues.php')
            return response.data.leagues || []
        } catch (error) {
            console.error('Error fetching leagues:', error)
            throw error
        }
    },

    async getTopLeagues(): Promise<League[]> {
        const leagueIds = ['4328', '4331', '4332', '4334', '4335'] 
        const promises = leagueIds.map(id =>
            api.get(`/lookupleague.php?id=${id}`)
        )
        const responses = await Promise.all(promises)
        return responses.map(res => res.data.leagues[0]).filter(Boolean)
    },

    async getTeamsByLeague(leagueId: string): Promise<Team[]> {
        try {
            const response = await api.get(`/lookup_all_teams.php?id=${leagueId}`)
            return response.data.teams || []
        } catch (error) {
            console.error('Error fetching teams:', error)
            throw error
        }
    },

    async getTeamDetails(teamId: string): Promise<Team | null> {
        try {
            const response = await api.get(`/lookupteam.php?id=${teamId}`)
            return response.data.teams?.[0] || null
        } catch (error) {
            console.error('Error fetching team details:', error)
            throw error
        }
    },

    async getLastEvents(teamId: string): Promise<Event[]> {
        try {
            const response = await api.get(`/eventslast.php?id=${teamId}`)
            return response.data.results || []
        } catch (error) {
            console.error('Error fetching last events:', error)
            throw error
        }
    },

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