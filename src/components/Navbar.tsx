import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-14">
      {/* Subtle gradient so links stay readable over any hero */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,15,0.7) 0%, transparent 100%)",
        }}
      />

      {/* Logo */}
      <Link href="/" className="relative z-10 flex items-baseline gap-0.5">
        <span
          className="font-serif text-xl font-light tracking-wide text-white/90"
          style={{ fontVariantLigatures: "none" }}
        >
          Gets
        </span>
        <span
          className="font-serif text-xl font-semibold italic"
          style={{ color: "#E29578" }}
        >
          X
        </span>
        <span className="font-serif text-xl font-light tracking-wide text-white/90">
          plore
        </span>
      </Link>

      {/* Nav links */}
      <nav className="relative z-10 hidden items-center gap-8 md:flex">
        {[
          { label: "Come funziona", href: "#come-funziona" },
          { label: "Blog", href: "/blog" },
          { label: "Accedi", href: "/login" },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="font-sans text-sm font-light tracking-widest text-white/50 uppercase transition-colors duration-200 hover:text-white/90"
          >
            {label}
          </Link>
        ))}

        {/* CTA */}
        <Link
          href="/signup"
          className="rounded-full px-5 py-2 font-sans text-sm font-medium tracking-wider text-white uppercase transition-all duration-300 hover:brightness-110"
          style={{ backgroundColor: "#006D77" }}
        >
          Inizia
        </Link>
      </nav>

      {/* Mobile menu icon */}
      <button
        className="relative z-10 flex flex-col gap-1.5 p-1 md:hidden"
        aria-label="Menu"
      >
        <span className="block h-px w-6 bg-white/70" />
        <span className="block h-px w-4 bg-white/70" />
      </button>
    </header>
  );
}
