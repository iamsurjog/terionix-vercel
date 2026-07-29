import { Link } from '@tanstack/react-router'

interface FooterProps {
  content: {
    navbar: { links: any[] }
    social?: { links: { platform: string; url: string; label: string }[] }
    site: { logo: string; name: string }
  }
}

function FooterSocialIcon({ platform }: { platform: string }) {
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

export function Footer({ content }: FooterProps) {
  return (
    <>
      {/* ====== GRADIENT DIVIDER ====== */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 blur-sm" />
      </div>

      <footer className="bg-background/80 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <img src={content.site.logo} alt={content.site.name} className="h-20 w-auto mb-4" />
              <p className="text-text/50 text-sm leading-relaxed max-w-md">
                Responsible e-waste management for a sustainable future. TNPCB authorized, CPCB compliant.
              </p>
            </div>
            <div>
              <h4 className="font-title font-bold text-text text-sm mb-3 uppercase tracking-wider">Quick Links</h4>
              <div className="space-y-2">
                {content.navbar.links.map((link: any) => (
                  <div key={link.name}>
                    {link.children?.map((child: any) => (
                      <Link key={child.name} to={child.to} className="block text-sm text-text/50 hover:text-primary transition-colors">
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-title font-bold text-text text-sm mb-3 uppercase tracking-wider">Contact</h4>
              <div className="space-y-2 text-sm text-text/50">
                <p>Tamil Nadu, India</p>
                <Link to="/contact" className="block text-primary hover:text-primary-deep transition-colors font-medium">
                  Get in Touch
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-title font-bold text-text text-sm mb-3 uppercase tracking-wider">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                {content.social?.links?.map((link: { platform: string; url: string; label: string }) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-text/40 hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                    aria-label={link.label}
                  >
                    <FooterSocialIcon platform={link.platform} />
                  </a>
                ))}
              </div>
              <p className="text-xs text-text/30 mt-3">Follow us for sustainability updates and e-waste tips.</p>
            </div>
          </div>
          <div className="border-t border-primary/10 pt-6 text-center">
            <p className="text-xs text-text/30">
              &copy; {new Date().getFullYear()} Terionix. All rights reserved. — Where Circuits Bloom.
            </p>
            <p className="text-xs text-text/30 mt-2">
              Made by: Sujatro Ganguli
            </p>
            <p className="text-xs text-text/30">
              Contact at sujatro.ganguli@gmail.com or 9874182344
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
