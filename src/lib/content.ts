/**
 * Read content from the static content.json file in public/.
 *
 * - Client-side: fetches via /content.json (resolved relative to origin in browser)
 * - SSR (server-side rendering): reads from filesystem directly (dev / Node hosting),
 *   or falls back to an HTTP fetch using the VERCEL_URL on Vercel.
 */
export async function readContent(): Promise<Record<string, unknown>> {
  if (import.meta.env.SSR) {
    // 1) Try filesystem — works in dev (Nitro dev server) and traditional Node hosting
    try {
      const fs = await import('node:fs')
      const path = await import('node:path')
      const filePath = path.resolve(process.cwd(), 'public/content.json')
      const text = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(text)
    } catch {
      // 2) Filesystem failed — try HTTP (Vercel serverless, where static assets
      //    are CDN-served and not on the lambda filesystem)
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 3000}`
      const res = await fetch(`${baseUrl}/content.json`)
      if (!res.ok) throw new Error(`Failed to fetch content: ${res.status}`)
      return res.json()
    }
  }

  // Client-side: relative URL resolves against the browser origin
  const res = await fetch('/content.json')
  if (!res.ok) throw new Error(`Failed to fetch content: ${res.status}`)
  return res.json()
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


