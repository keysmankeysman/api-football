export interface User {
    id: number
    email: string
    username: string
    token?: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    username: string
    email: string
    password: string
    confirmPassword: string
}

export interface AuthResponse {
    user: User
    token: string
}

// Football API Types
export interface League {
    idLeague: string
    strLeague: string
    strSport: string
    strLeagueAlternate: string
    strCountry: string
    strBadge: string
}

export interface Team {
    idTeam: string
    strTeam: string
    strLeague: string
    strCountry: string
    strStadium: string
    strDescriptionEN: string
    strTeamBadge: string
    strWebsite: string
    intFormedYear: string
}

export interface Event {
    idEvent: string
    strEvent: string
    strHomeTeam: string
    strAwayTeam: string
    intHomeScore: string
    intAwayScore: string
    dateEvent: string
    strTime: string
}

export interface ApiResponse<T> {
    success?: boolean
    data?: T
    error?: string
}