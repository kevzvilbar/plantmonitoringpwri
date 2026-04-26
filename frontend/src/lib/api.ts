import { supabase } from './supabase'

const API_BASE = import.meta.env.VITE_API_URL || ''

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  if (session?.user?.id) {
    headers['x-user-id'] = session.user.id
  }
  return headers
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...init } = options
  
  let url = `${API_BASE}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const authHeaders = await getAuthHeaders()
  const response = await fetch(url, {
    ...init,
    headers: {
      ...authHeaders,
      ...init.headers,
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new ApiError(response.status, errorBody || response.statusText)
  }

  return response.json()
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}

// Typed API endpoints
export interface SensorReading {
  id: string
  sensor_id: string
  value: number
  unit: string
  timestamp: string
  created_at: string
}

export interface Alert {
  id: string
  type: 'warning' | 'critical' | 'info'
  message: string
  sensor_id?: string
  acknowledged: boolean
  created_at: string
}

export interface Plant {
  id: string
  name: string
  location: string
  status: 'online' | 'offline' | 'maintenance'
  created_at: string
}

export const plantApi = {
  getPlants: () => api.get<Plant[]>('/api/plants'),
  getPlant: (id: string) => api.get<Plant>(`/api/plants/${id}`),
}

export const sensorApi = {
  getReadings: (plantId: string, params?: Record<string, string>) =>
    api.get<SensorReading[]>(`/api/sensors/${plantId}/readings`, params),
  getLatestReadings: (plantId: string) =>
    api.get<SensorReading[]>(`/api/sensors/${plantId}/latest`),
}

export const alertApi = {
  getAlerts: (params?: Record<string, string>) =>
    api.get<Alert[]>('/api/alerts', params),
  acknowledgeAlert: (id: string) =>
    api.put<Alert>(`/api/alerts/${id}/acknowledge`),
}
