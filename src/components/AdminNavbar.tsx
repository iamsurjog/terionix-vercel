import { useState } from 'react'
import { logout } from '#/lib/auth'
import { useNavigate, useLocation } from '@tanstack/react-router'

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

export function AdminNavbar({ active, links, logo, siteName }: { active: string; links: NavLink[]; logo: string; siteName: string }) {
  const [open, setOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/admin/login' })
  }

  const isChildActive = (children?: ChildLink[]) => {
    if (!children) return false
    return children.some((child) => location.pathname === `/admin${child.to}`)
  }

  const isAnyActive = (link: NavLink) => {
    if (link.type === 'dropdown' && link.children) {
      return isChildActive(link.children)
    }
    return location.pathname === `/admin${link.to}`
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin" className="flex items-center">
            <img src={logo} alt={siteName} className="h-30 w-auto" />
          </a>
          <div className="w-px h-8 bg-primary/20" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent motion-preset-pulse" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Admin</span>
          </div>
        </div>

        {/* Desktop */}
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
                  className={`px-4 py-2 font-sans text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                    isAnyActive(link)
                      ? 'text-white bg-primary shadow-lg shadow-primary/25'
                      : 'text-text/70 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span>{link.name}</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
                    openDropdown === link.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                  }`}
                >
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-primary/10 shadow-2xl shadow-primary/10 py-2 min-w-[200px]">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />
                    {link.children.map((child) => (
                      <a
                        key={child.name}
                        href={`/admin${child.to}`}
                        className={`block px-5 py-2.5 font-sans text-sm transition-all duration-200 ${
                          location.pathname === `/admin${child.to}`
                            ? 'text-primary font-semibold bg-primary/5'
                            : 'text-text/70 hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-1 h-1 rounded-full transition-all ${
                            location.pathname === `/admin${child.to}` ? 'bg-primary scale-150' : 'bg-transparent'
                          }`} />
                          {child.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.name}
                href={`/admin${link.to}`}
                className={`px-4 py-2 font-sans text-sm font-medium rounded-full transition-all duration-300 ${
                  isAnyActive(link)
                    ? 'text-white bg-primary shadow-lg shadow-primary/25'
                    : 'text-text/70 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.name}
              </a>
            )
          )}

          {/* Hardcoded admin extras */}
          <a
            href="/admin/game"
            className={`px-4 py-2 font-sans text-sm font-medium rounded-full transition-all duration-300 ${
              active === 'Recycling Game' ? 'text-white bg-primary shadow-lg shadow-primary/25' : 'text-text/70 hover:text-primary hover:bg-primary/5'
            }`}
          >
            Game
          </a>
          <a
            href="/admin/json"
            className={`px-4 py-2 font-sans text-sm font-medium rounded-full transition-all duration-300 ${
              active === 'JSON' ? 'text-white bg-primary shadow-lg shadow-primary/25' : 'text-text/70 hover:text-primary hover:bg-primary/5'
            }`}
          >
            JSON
          </a>
          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 font-sans text-sm font-medium rounded-full text-error hover:bg-error-soft transition-all"
          >
            Logout
          </button>
        </div>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-error hover:text-error-deep transition-colors px-2 py-1"
          >
            Logout
          </button>
          <button onClick={() => setOpen(!open)} className="relative w-10 h-10 flex items-center justify-center rounded-lg text-text hover:bg-primary/5 transition-colors" aria-label="Toggle menu">
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-background/95 backdrop-blur-xl border-t border-primary/10 px-4 pb-4 pt-2 space-y-1">
          {links.map((link) => (
            <AdminMobileDropdownItem key={link.name} link={link} active={active} onClose={() => setOpen(false)} />
          ))}
          <a href="/admin/game" onClick={() => setOpen(false)}
            className={`block py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${active === 'Recycling Game' ? 'text-white bg-primary shadow-lg shadow-primary/20' : 'text-text/70 hover:text-primary hover:bg-primary/5'}`}
          >
            Game
          </a>
          <a href="/admin/json" onClick={() => setOpen(false)}
            className={`block py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${active === 'JSON' ? 'text-white bg-primary shadow-lg shadow-primary/20' : 'text-text/70 hover:text-primary hover:bg-primary/5'}`}
          >
            JSON
          </a>
        </div>
      </div>
    </nav>
  )
}

function AdminMobileDropdownItem({ link, active, onClose }: { link: NavLink; active: string; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const hasActiveChild = link.children?.some((c) => location.pathname === `/admin${c.to}`)

  if (link.type !== 'dropdown' || !link.children) {
    return (
      <a key={link.name} href={`/admin${link.to}`} onClick={onClose}
        className={`block py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
          location.pathname === `/admin${link.to}` ? 'text-white bg-primary shadow-lg shadow-primary/20' : 'text-text/70 hover:text-primary hover:bg-primary/5'
        }`}
      >
        {link.name}
      </a>
    )
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
          hasActiveChild ? 'text-primary bg-primary/5' : 'text-text/70 hover:text-primary hover:bg-primary/5'
        }`}
      >
        <span>{link.name}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="ml-4 pl-3 border-l-2 border-primary/10 space-y-0.5 py-1">
          {link.children.map((child) => (
            <a
              key={child.name}
              href={`/admin${child.to}`}
              onClick={onClose}
              className={`block py-2 px-4 rounded-lg text-sm transition-all ${location.pathname === `/admin${child.to}` ? 'text-primary font-semibold bg-primary/5' : 'text-text/60 hover:text-primary hover:bg-primary/5'}`}
            >
              {child.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
