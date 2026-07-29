const API_BASE = import.meta.env.SSR
  ? (process.env.API_URL || 'http://localhost:8001/api')
  : '/api'

function getCsrfToken(): string {
  const match = document.cookie.match(/csrftoken=([^;]+)/)
  return match ? match[1] : ''
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const isFormData = options.body instanceof FormData
  const headers: Record<string, string> = {}
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  const method = (options.method || 'GET').toUpperCase()
  if (method !== 'GET') {
    headers['X-CSRFToken'] = getCsrfToken()
  }
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
    credentials: 'include',
  })
}

export async function readContent(): Promise<Record<string, unknown>> {
  const res = await apiFetch('/content')
  if (!res.ok) throw new Error(`Failed to fetch content: ${res.status}`)
  return res.json()
}

export async function contentAction(d: {
  action: string
  section?: string
  content?: unknown
}): Promise<unknown> {
  if (d.action === 'read') {
    return readContent()
  }
  if (d.action === 'write' && d.section && d.content !== undefined) {
    const res = await apiFetch(`/content/${d.section}`, {
      method: 'PATCH',
      body: JSON.stringify({ data: d.content }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `Failed to save: ${res.status}`)
    }
    return { success: true }
  }
  return { success: false, error: 'Invalid action' }
}

export async function verifyPassword(d: {
  data: { password: string }
}): Promise<boolean> {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password: d.data.password }),
  })
  const json = await res.json()
  return json.success === true
}

export async function updatePassword(d: {
  data: { currentPassword: string; newPassword: string }
}): Promise<{ success: boolean; error?: string }> {
  const res = await apiFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      current_password: d.data.currentPassword,
      new_password: d.data.newPassword,
    }),
  })
  return res.json()
}


