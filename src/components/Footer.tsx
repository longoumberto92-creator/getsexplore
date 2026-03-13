const columns = [
  {
    title: "Prodotto",
    links: [
      { label: "Come funziona", href: "#come-funziona" },
      { label: "Prezzi", href: "/prezzi" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Supporto",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contatti", href: "/contatti" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "TikTok", href: "https://tiktok.com" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#07070C" }}>
      {/* Top separator */}
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0,109,119,0.3), rgba(226,149,120,0.2), transparent)",
        }}
      />

      {/* Main footer body */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-14 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div className="flex flex-col gap-5">
            {/* Logo */}
            <a href="/" className="flex items-baseline gap-0.5 w-fit">
              <span className="font-serif text-lg font-light tracking-wide text-white/75">
                Gets
              </span>
              <span
                className="font-serif text-lg font-semibold italic"
                style={{ color: "#E29578" }}
              >
                X
              </span>
              <span className="font-serif text-lg font-light tracking-wide text-white/75">
                plore
              </span>
            </a>

            {/* Tagline */}
            <p
              className="max-w-[18rem] font-serif text-base font-light italic leading-relaxed"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Il tuo viaggio, raccontato come una storia.
            </p>

            {/* Teal accent line */}
            <div className="h-px w-10" style={{ backgroundColor: "#006D77" }} />
          </div>

          {/* Link columns */}
          {columns.map(({ title, links }) => (
            <div key={title}>
              <p
                className="mb-5 font-sans text-xs font-medium uppercase tracking-[0.3em]"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {title}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="footer-link font-sans text-sm font-light transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="h-px mx-6 md:mx-14"
        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      />
      <div className="mx-auto max-w-7xl px-6 py-6 md:px-14">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <p
            className="font-sans text-xs font-light"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            © 2026 GetSXplore. Tutti i diritti riservati.
          </p>
          <p
            className="font-sans text-xs font-light"
            style={{ color: "rgba(255,255,255,0.15)" }}
          >
            Fatto con cura ✦ per i viaggiatori curiosi
          </p>
        </div>
      </div>
    </footer>
  );
}
