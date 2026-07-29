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
    const paths = ['public/content.json']
    for (const relative of paths) {
      try {
        const fs = await import('node:fs')
        const path = await import('node:path')
        const filePath = path.resolve(process.cwd(), relative)
        if (fs.existsSync(filePath)) {
          return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        }
      } catch {
      }
    }

    // 2) Filesystem failed — try HTTP (Vercel serverless, where static assets
    //    are CDN-served and not on the lambda filesystem).
    //    Only attempt this when VERCEL_URL is set — never fall back to localhost.
    if (process.env.VERCEL_URL) {
      const res = await fetch(`https://${process.env.VERCEL_URL}/content.json`)
      if (res.ok) {
        // Verify the response is actually JSON before parsing
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('json') || contentType.includes('text/plain')) {
          return res.json()
        }
        // Response is HTML or something else — read first bytes for diagnostics
        const text = await res.text()
        throw new Error(
          `Expected JSON from /content.json but got ${contentType}. ` +
          `Response starts with: ${text.slice(0, 200)}`
        )
      }
      throw new Error(`Failed to fetch content.json from Vercel: HTTP ${res.status}`)
    }

    throw new Error(
      'Failed to load content.json on server (filesystem not found and VERCEL_URL not set).'
    )
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


