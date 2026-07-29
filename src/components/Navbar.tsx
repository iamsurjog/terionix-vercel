import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { gsap } from 'gsap'

interface ChildLink {
  name: string
  to: string
}

interface NavLink {
  name: string
  type: 'link' | 'dropdown'
  to?: string
  children?: ChildLink[]
}

interface CtaConfig {
  label: string
  to: string
}

interface SocialLink {
  platform: string
  url: string
  label: string
}

export function Navbar({
  active,
  links,
  cta,
  logo,
  siteName,
  socialLinks,
}: {
  active: string
  links: NavLink[]
  cta?: CtaConfig
  logo: string
  siteName: string
  socialLinks?: SocialLink[]
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const location = useLocation()
  const logoRef = useRef<HTMLAnchorElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
    }

    if (navRef.current) {
      const linkEls = navRef.current.querySelectorAll<HTMLAnchorElement>('.nav-link')
      gsap.fromTo(linkEls,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power2.out' }
      )
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: [0.3, 0.6, 0.3],
        duration: 3,
        repeat: -1,
        ease: 'sine.inOut',
      })
    }
  }, [])

  const isChildActive = (children?: ChildLink[]) => {
    if (!children) return false
    return children.some((child) => active === child.to || location.pathname === child.to)
  }

  const isAnyDropdownActive = (link: NavLink) => {
    if (link.type === 'dropdown' && link.children) {
      return isChildActive(link.children)
    }
    return active === link.to || location.pathname === link.to
  }

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-primary/5 motion-preset-fade">
      <div ref={glowRef} className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        <Link to="/" ref={logoRef} className="flex items-center gap-2 group shrink-0">
          <img src={logo} alt={siteName} className="h-30 w-auto drop-shadow-glow group-hover:drop-shadow-glow-strong transition-all duration-500" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) =>
            link.type === 'dropdown' && link.children ? (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(link.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`nav-link relative px-4 py-2 font-sans text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                    isAnyDropdownActive(link)
                      ? 'text-white bg-gradient-to-r from-primary to-primary-deep shadow-lg shadow-primary/30'
                      : 'text-text/60 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <svg
                    className={`w-3.5 h-3.5 relative z-10 transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {isAnyDropdownActive(link) && (
                    <span className="absolute inset-0 rounded-full animate-pulse bg-primary/20" style={{ animationDuration: '2s' }} />
                  )}
                </button>

                {/* Dropdown panel */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
                    openDropdown === link.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                  }`}
                >
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-primary/10 shadow-2xl shadow-primary/10 py-2 min-w-[200px] overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />
                    {link.children.map((child, ci) => (
                      <Link
                        key={child.name}
                        to={child.to}
                        className={`block px-5 py-2.5 font-sans text-sm transition-all duration-200 ${
                          active === child.to
                            ? 'text-primary font-semibold bg-primary/5'
                            : 'text-text/70 hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-1 h-1 rounded-full transition-all duration-200 ${
                            active === child.to ? 'bg-primary scale-150' : 'bg-transparent'
                          }`} />
                          {child.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.to!}
                className={`nav-link relative px-4 py-2 font-sans text-sm font-medium rounded-full transition-all duration-300 ${
                  active === link.to
                    ? 'text-white bg-gradient-to-r from-primary to-primary-deep shadow-lg shadow-primary/30'
                    : 'text-text/60 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {active === link.to && (
                  <span className="absolute inset-0 rounded-full animate-pulse bg-primary/20" style={{ animationDuration: '2s' }} />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            )
          )}

          {/* Social Links */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex items-center gap-1.5 mr-2 pl-3 border-l border-primary/10">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link w-8 h-8 rounded-full flex items-center justify-center text-text/40 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                  aria-label={link.label}
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          )}

          {/* CTA Button */}
          {cta && (
            <Link
              to={cta.to}
              className="ml-3 nav-link relative font-sans font-semibold text-sm px-5 py-2.5 rounded-full bg-accent text-white hover:brightness-110 shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                {cta.label}
              </span>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-text hover:bg-primary/5 transition-colors"
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 relative flex flex-col justify-between">
            <span className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-background/95 backdrop-blur-2xl border-t border-primary/10 px-4 pb-4 pt-2 space-y-1">
          {links.map((link) =>
            link.type === 'dropdown' && link.children ? (
              <MobileDropdownItem
                key={link.name}
                link={link}
                active={active}
                onClose={() => setMobileOpen(false)}
              />
            ) : (
              <Link
                key={link.name}
                to={link.to!}
                onClick={() => setMobileOpen(false)}
                className={`block py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                  active === link.to
                    ? 'text-white bg-gradient-to-r from-primary to-primary-deep shadow-lg shadow-primary/20'
                    : 'text-text/70 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.name}
              </Link>
            )
          )}

          {/* Mobile CTA */}
          {cta && (
            <Link
              to={cta.to}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-center text-white bg-accent shadow-lg shadow-accent/25 hover:brightness-110 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                {cta.label}
              </span>
            </Link>
          )}

          {/* Mobile Social */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-3 pt-3 mt-3 border-t border-primary/10">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-text/40 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                  aria-label={link.label}
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function SocialIcon({ platform }: { platform: string }) {
  const paths: Record<string, string> = {
    linkedin: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  }
  const path = paths[platform] || paths.linkedin
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d={path} />
    </svg>
  )
}

function MobileDropdownItem({ link, active, onClose }: { link: NavLink; active: string; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const hasActiveChild = link.children?.some((c) => active === c.to || location.pathname === c.to)

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
          hasActiveChild
            ? 'text-primary bg-primary/5'
            : 'text-text/70 hover:text-primary hover:bg-primary/5'
        }`}
      >
        <span>{link.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="ml-4 pl-3 border-l-2 border-primary/10 space-y-0.5 py-1">
          {link.children?.map((child) => (
            <Link
              key={child.name}
              to={child.to}
              onClick={onClose}
              className={`block py-2 px-4 rounded-lg text-sm transition-all ${
                active === child.to
                  ? 'text-primary font-semibold bg-primary/5'
                  : 'text-text/60 hover:text-primary hover:bg-primary/5'
              }`}
            >
              {child.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
