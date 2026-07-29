import rawContent from './content.json'

export async function readContent() {
  return rawContent as Record<string, unknown>
}

/**
 * Admin write action — no backend available in standalone mode.
 * Returns an error indicating the feature requires a backend.
 */
export async function contentAction(_d: {
  action: string
  section?: string
  content?: unknown
}): Promise<unknown> {
  return { success: false, error: 'Admin features require a backend server. Not available in standalone mode.' }
}

/**
 * Password verification — no backend available in standalone mode.
 */
export async function verifyPassword(_d: {
  data: { password: string }
}): Promise<boolean> {
  return false
}

/**
 * Password update — no backend available in standalone mode.
 */
export async function updatePassword(_d: {
  data: { currentPassword: string; newPassword: string }
}): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: 'Admin features require a backend server. Not available in standalone mode.' }
}
