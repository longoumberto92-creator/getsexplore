import Image from "next/image";

const destinations = [
  {
    city: "Tokyo",
    country: "Giappone",
    tag: "Street Food & Cultura",
    photo: "https://images.unsplash.com/photo-1540959733-3b642a70f3a7?w=800&q=80&auto=format&fit=crop",
  },
  {
    city: "Lisbona",
    country: "Portogallo",
    tag: "Architettura & Fado",
    photo: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80&auto=format&fit=crop",
  },
  {
    city: "Marrakech",
    country: "Marocco",
    tag: "Deserto & Spezie",
    photo: "https://images.unsplash.com/photo-1517821099606-cef63a9bcda6?w=800&q=80&auto=format&fit=crop",
  },
  {
    city: "Città del Messico",
    country: "Messico",
    tag: "Arte & Mercados",
    photo: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80&auto=format&fit=crop",
  },
  {
    city: "Kyoto",
    country: "Giappone",
    tag: "Templi & Cerimonie",
    photo: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80&auto=format&fit=crop",
  },
  {
    city: "Santorini",
    country: "Grecia",
    tag: "Architettura & Mare",
    photo: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80&auto=format&fit=crop",
  },
];

export default function FeaturedDestinations() {
  return (
    <section
      className="relative px-6 py-28 md:px-14 md:py-36"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(0,109,119,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <div
                className="h-px w-8"
                style={{ backgroundColor: "#006D77" }}
              />
              <span
                className="font-sans text-xs font-light uppercase tracking-[0.35em]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Curate per te
              </span>
            </div>
            <h2 className="font-serif text-4xl font-light italic text-white/90 md:text-5xl lg:text-6xl">
              Destinazioni in Evidenza
            </h2>
          </div>

          <a
            href="#"
            className="link-coral mt-6 flex items-center gap-2 font-sans text-sm font-light uppercase tracking-widest transition-colors duration-200 md:mt-0"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Tutte le destinazioni
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {destinations.map(({ city, country, tag, photo }) => (
            <a
              key={city}
              href="#"
              className="dest-card group relative overflow-hidden rounded-xl"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Photo */}
              <Image
                src={photo}
                alt={`${city}, ${country}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient overlay — always present */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.5) 45%, rgba(10,10,15,0.1) 100%)",
                }}
              />

              {/* Hover teal tint overlay */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,109,119,0.25) 0%, transparent 60%)",
                }}
              />

              {/* Bottom content */}
              <div className="absolute inset-x-0 bottom-0 p-7">
                {/* Tag */}
                <span
                  className="dest-tag mb-4 inline-block rounded-full px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-widest transition-all duration-300"
                  style={{
                    border: "1px solid rgba(0,109,119,0.5)",
                    color: "#006D77",
                    backgroundColor: "transparent",
                  }}
                >
                  {tag}
                </span>

                {/* City & country */}
                <div className="flex items-end justify-between">
                  <div>
                    <h3
                      className="font-serif text-3xl font-light leading-tight text-white/95 md:text-4xl"
                    >
                      {city}
                    </h3>
                    <p
                      className="mt-1 font-sans text-xs font-light uppercase tracking-[0.25em]"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {country}
                    </p>
                  </div>

                  {/* Arrow — slides in on hover */}
                  <div
                    className="dest-arrow flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#006D77" }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M2 7h10M8 3l4 4-4 4"
                        stroke="#fff"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Top-right coral dot — subtle editorial mark */}
              <div
                className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ backgroundColor: "#E29578" }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
