import api from './api'

export interface AuthResponse {
  token: string
}

export interface UserProfile {
  _id: string
  name: string
  email: string
  createdAt: string
}

export const loginApi = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password })

export const registerApi = (name: string, email: string, password: string) =>
  api.post<AuthResponse>('/auth/register', { name, email, password })

export const getProfileApi = () =>
  api.get<UserProfile>('/auth/profile')
