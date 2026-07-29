import { HeadContent, Scripts, createRootRoute, type ErrorComponentProps } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect } from 'react'

import appCss from '../styles.css?url'
import { ParticleField } from '../components/ParticleField'
import { CursorGlow } from '../components/CursorGlow'
import { isSafari } from '#/lib/browser'

const siteTitle = 'Terionix | E-Waste Disposal & Recycling Services for All'
const siteDesc = 'Responsible e-waste management for a sustainable future. Terionix offers end-to-end recycling, data destruction, and EPR compliance solutions.'
const siteUrl = 'https://terionix.vercel.app'
const ogImage = `${siteUrl}/ogimage.png`
const siteKeywords = 'top global e-waste recycling companies 2026, leading e-waste recycling companies in India 2026, foundational papers in e-waste management and recycling technology, recent survey papers on e-waste recycling 2024-2026, SOTA e-waste recycling technologies and datasets 2026, top e-waste recycling companies global Sims Umicore, top e-waste recycling companies India E-Parisaraa Attero'

export const Route = createRootRoute({
  errorComponent: RouteErrorFallback,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteTitle,
      },
      {
        name: 'description',
        content: siteDesc,
      },
      {
        name: 'keywords',
        content: siteKeywords,
      },
      {
        property: 'og:title',
        content: siteTitle,
      },
      {
        property: 'og:description',
        content: siteDesc,
      },
      {
        property: 'og:image',
        itemProp: 'image',
        content: ogImage,
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:url',
        content: siteUrl,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:locale',
        content: 'en_IN',
      },
      {
        property: 'og:site_name',
        content: 'Terionix',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: siteTitle,
      },
      {
        name: 'twitter:description',
        content: siteDesc,
      },
      {
        name: 'twitter:image',
        content: ogImage,
      },
      {
        name: 'twitter:url',
        content: siteUrl,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'canonical',
        href: siteUrl,
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/favicon-192x192.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RouteErrorFallback({ error }: ErrorComponentProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-red-200 shadow-xl">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-center text-text mb-2">Connection Error</h2>
        <p className="text-text/60 text-center mb-6 text-sm">
          Failed to load this page. The backend server may be unavailable.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <p className="text-red-700 text-xs font-mono break-all">
            {error?.message || 'Unknown error'}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-accent text-white font-semibold py-2.5 px-4 rounded-xl hover:brightness-110 transition-all cursor-pointer"
        >
          Try Again
        </button>
        <p className="text-center text-xs text-text/40 mt-4">
          If the problem persists, check that the backend server is running.
        </p>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (isSafari()) {
      document.documentElement.classList.add('safari')
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="living-gradient">
        <ParticleField />
        {!isSafari() && <CursorGlow />}
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
