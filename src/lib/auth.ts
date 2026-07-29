import { verifyPassword } from '#/lib/content'
import { updatePassword } from '#/lib/content'

const AUTH_KEY = 'terionix_admin'

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(AUTH_KEY) === 'true'
}

export async function login(password: string): Promise<boolean> {
  console.log('[auth] login called, password length:', password.length)
  try {
    const result = await verifyPassword({ data: { password } })
    console.log('[auth] verifyPassword result:', result)
    if (result) {
      localStorage.setItem(AUTH_KEY, 'true')
      console.log('[auth] login success')
      return true
    }
    console.log('[auth] password mismatch')
  } catch (e) {
    console.error('[auth] login error:', e)
    return false
  }
  return false
}

export async function changePassword(currentPassword: string, newPassword: string) {
  console.log('[auth] changePassword called')
  try {
    const result = await updatePassword({ data: { currentPassword, newPassword } })
    console.log('[auth] changePassword result:', result)
    return result
  } catch (e) {
    console.error('[auth] changePassword error:', e)
    return { success: false, error: 'Failed to connect to server' }
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem(AUTH_KEY)
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  } catch {
    // server session will timeout naturally
  }
}
