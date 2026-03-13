export interface Destination {
  name: string;
  country: string;
  tag: string;
  photoId: string;
}

export const DESTINATIONS: Destination[] = [
  { name: "Australia",  country: "Oceania",        tag: "Natura & Avventura",   photoId: "1506905925346-21bda4d32df4" },
  { name: "Giappone",   country: "Asia",            tag: "Cultura & Tradizione", photoId: "1528360983277-13d401cdc186" },
  { name: "Thailandia", country: "Asia",            tag: "Templi & Spiagge",     photoId: "1528181304800-259b08848526" },
  { name: "Bali",       country: "Indonesia",       tag: "Spiritualità & Natura",photoId: "1537996134470-1b5b91f91b1d" },
  { name: "Italia",     country: "Europa",          tag: "Arte & Gastronomia",   photoId: "1534445538923-ab38be342b17" },
  { name: "Miami",      country: "USA",             tag: "Beach & Nightlife",    photoId: "1514214246559-0b7e6f1f6b5e" },
  { name: "Giordania",  country: "Medio Oriente",   tag: "Deserto & Storia",     photoId: "1548786811-f89e8d8d1c3e" },
  { name: "Egitto",     country: "Africa",          tag: "Faraoni & Nilo",       photoId: "1553913861-c0fddf2619ee" },
  { name: "Seychelles", country: "Oceano Indiano",  tag: "Paradiso & Coralli",   photoId: "1573143328987-f75aa6b61b7b" },
  { name: "Cina",       country: "Asia",            tag: "Storia & Modernità",   photoId: "1508804185872-b5d8eb9b4e8b" },
];

// Map of keyword → Unsplash photo ID (hero dynamic background)
const HERO_PHOTO_MAP: Record<string, string> = {
  // Grid destinations
  australia:  "1506905925346-21bda4d32df4",
  giappone:   "1528360983277-13d401cdc186",
  japan:      "1528360983277-13d401cdc186",
  kyoto:      "1528360983277-13d401cdc186",
  tokyo:      "1540959733-3b642a70f3a7",
  thailandia: "1528181304800-259b08848526",
  thailand:   "1528181304800-259b08848526",
  bali:       "1537996134470-1b5b91f91b1d",
  indonesia:  "1537996134470-1b5b91f91b1d",
  italia:     "1534445538923-ab38be342b17",
  italy:      "1534445538923-ab38be342b17",
  roma:       "1534445538923-ab38be342b17",
  rome:       "1534445538923-ab38be342b17",
  miami:      "1514214246559-0b7e6f1f6b5e",
  giordania:  "1548786811-f89e8d8d1c3e",
  jordan:     "1548786811-f89e8d8d1c3e",
  petra:      "1548786811-f89e8d8d1c3e",
  egitto:     "1553913861-c0fddf2619ee",
  egypt:      "1553913861-c0fddf2619ee",
  cairo:      "1553913861-c0fddf2619ee",
  seychelles: "1573143328987-f75aa6b61b7b",
  cina:       "1508804185872-b5d8eb9b4e8b",
  china:      "1508804185872-b5d8eb9b4e8b",
  // Extra hero destinations
  lisbona:    "1555881400-74d7acaacd8b",
  lisbon:     "1555881400-74d7acaacd8b",
  marocco:    "1517821099606-cef63a9bcda6",
  morocco:    "1517821099606-cef63a9bcda6",
  marrakech:  "1517821099606-cef63a9bcda6",
  parigi:     "1502602317737-28fdea36f7e1",
  paris:      "1502602317737-28fdea36f7e1",
  "new york": "1496442226666-8d4d0e62e6e9",
  newyork:    "1496442226666-8d4d0e62e6e9",
  santorini:  "1570077188670-e3a8d69ac5ff",
  grecia:     "1570077188670-e3a8d69ac5ff",
  greece:     "1570077188670-e3a8d69ac5ff",
};

export function getHeroPhotoUrl(input: string): string | null {
  if (input.trim().length < 3) return null;
  const lower = input.toLowerCase();
  for (const [key, id] of Object.entries(HERO_PHOTO_MAP)) {
    if (lower.includes(key)) {
      return `https://images.unsplash.com/photo-${id}?w=1920&q=80&auto=format&fit=crop`;
    }
  }
  return null;
}

export function getDestPhotoUrl(photoId: string, w = 480): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&q=80&auto=format&fit=crop`;
}
