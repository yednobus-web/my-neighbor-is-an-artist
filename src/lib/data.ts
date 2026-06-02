export type Artist = {
  id: string;
  handle: string;
  name: string;
  city: string;
  neighborhood: string;
  country: string;
  countryFlag: string;
  bio: string;
  avatar: string;
  followers: number;
  vibe: string[];
  lat: number;
  lng: number;
};

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  artistId: string;
  price: number;
  currency: string;
  medium: string;
  year: number;
  width: number;
  height: number;
  image: string;
  tags: string[];
  description: string;
  // location overrides (artist may travel / sell from elsewhere)
  city?: string;
  neighborhood?: string;
};

export const ARTISTS: Artist[] = [
  {
    id: "a1",
    handle: "@kira.spray",
    name: "Kira Mendez",
    city: "Brooklyn",
    neighborhood: "Bushwick",
    country: "USA",
    countryFlag: "🇺🇸",
    bio: "Bushwick wall painter. Makes loud girls louder. Coffee, cans, chaos.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    followers: 12400,
    vibe: ["graffiti", "feminist", "neon"],
    lat: 40.6943,
    lng: -73.9249,
  },
  {
    id: "a2",
    handle: "@yuto.ink",
    name: "Yuto Tanaka",
    city: "Tokyo",
    neighborhood: "Koenji",
    country: "Japan",
    countryFlag: "🇯🇵",
    bio: "Koenji-based illustrator. Cyberpunk meets ukiyo-e. Always too caffeinated.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    followers: 28900,
    vibe: ["illustration", "cyberpunk", "anime"],
    lat: 35.7050,
    lng: 139.6492,
  },
  {
    id: "a3",
    handle: "@amara.collage",
    name: "Amara Okafor",
    city: "Lagos",
    neighborhood: "Yaba",
    country: "Nigeria",
    countryFlag: "🇳🇬",
    bio: "Yaba collage queen. Recycled magazines, ancestral vibes, future thoughts.",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
    followers: 18700,
    vibe: ["collage", "afrofuturism", "mixed-media"],
    lat: 6.5095,
    lng: 3.3711,
  },
  {
    id: "a4",
    handle: "@leoo.tags",
    name: "Léo Vasquez",
    city: "Mexico City",
    neighborhood: "Roma Norte",
    country: "Mexico",
    countryFlag: "🇲🇽",
    bio: "Roma Norte tagger turned canvas guy. Skate parks raised me.",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80",
    followers: 9300,
    vibe: ["graffiti", "skate", "lettering"],
    lat: 19.4191,
    lng: -99.1601,
  },
  {
    id: "a5",
    handle: "@nina.pixels",
    name: "Nina Ferreira",
    city: "Lisbon",
    neighborhood: "Bairro Alto",
    country: "Portugal",
    countryFlag: "🇵🇹",
    bio: "Pixel artist + risograph nerd. Bairro Alto windows, neon, salt air.",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80",
    followers: 14200,
    vibe: ["pixel-art", "riso", "lo-fi"],
    lat: 38.7137,
    lng: -9.1450,
  },
  {
    id: "a6",
    handle: "@rashid.rugs",
    name: "Rashid Al-Hassan",
    city: "Berlin",
    neighborhood: "Kreuzberg",
    country: "Germany",
    countryFlag: "🇩🇪",
    bio: "Tufting freak in Kreuzberg. Sells weird rugs from a basement studio.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    followers: 22100,
    vibe: ["textile", "rugs", "soft-sculpture"],
    lat: 52.4994,
    lng: 13.4088,
  },
  {
    id: "a7",
    handle: "@sol.ceramics",
    name: "Sol Park",
    city: "Seoul",
    neighborhood: "Hongdae",
    country: "South Korea",
    countryFlag: "🇰🇷",
    bio: "Hongdae ceramicist. Funky mugs, weird vases, body parts.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
    followers: 31400,
    vibe: ["ceramics", "sculpture", "body"],
    lat: 37.5563,
    lng: 126.9236,
  },
  {
    id: "a8",
    handle: "@dani.zines",
    name: "Daniela Rossi",
    city: "São Paulo",
    neighborhood: "Vila Madalena",
    country: "Brazil",
    countryFlag: "🇧🇷",
    bio: "Vila Madalena zine maker. Photography, riot grrrl energy.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    followers: 7800,
    vibe: ["zine", "photo", "diy"],
    lat: -23.5440,
    lng: -46.6920,
  },
];

export const ARTWORKS: Artwork[] = [
  {
    id: "w1",
    slug: "loud-girl-no1",
    title: "LOUD GIRL #1",
    artistId: "a1",
    price: 480,
    currency: "USD",
    medium: "Spray + acrylic on canvas",
    year: 2026,
    width: 60,
    height: 80,
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=900&q=80",
    tags: ["graffiti", "portrait", "feminist", "neon"],
    description:
      "She is loud on purpose. Hot pink spray, acid green underpaint, and a stare that's done apologizing.",
  },
  {
    id: "w2",
    slug: "bushwick-bodega-2am",
    title: "Bushwick Bodega 2AM",
    artistId: "a1",
    price: 320,
    currency: "USD",
    medium: "Spray on cardboard",
    year: 2025,
    width: 50,
    height: 70,
    image:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=900&q=80",
    tags: ["graffiti", "street", "nyc"],
    description: "Painted on a delivery box behind Mr. Kim's bodega.",
  },
  {
    id: "w3",
    slug: "neon-koenji-rain",
    title: "Neon Koenji Rain",
    artistId: "a2",
    price: 560,
    currency: "USD",
    medium: "Digital print, signed",
    year: 2026,
    width: 42,
    height: 59,
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&q=80",
    tags: ["illustration", "cyberpunk", "tokyo"],
    description: "Wet streets reflecting a thousand kanji signs.",
  },
  {
    id: "w4",
    slug: "yokai-on-the-train",
    title: "Yokai on the Train",
    artistId: "a2",
    price: 410,
    currency: "USD",
    medium: "Ink on washi paper",
    year: 2026,
    width: 40,
    height: 60,
    image:
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=900&q=80",
    tags: ["illustration", "anime", "ink"],
    description: "Spotted a yokai on the Yamanote line, drew it before he got off.",
  },
  {
    id: "w5",
    slug: "ancestor-static",
    title: "ANCESTOR / STATIC",
    artistId: "a3",
    price: 720,
    currency: "USD",
    medium: "Collage on board",
    year: 2026,
    width: 70,
    height: 100,
    image:
      "https://images.unsplash.com/photo-1578321272125-4e4c4c3643c5?w=900&q=80",
    tags: ["collage", "afrofuturism"],
    description: "Old issues of Drum magazine, gold foil, prayer.",
  },
  {
    id: "w6",
    slug: "yaba-sundays",
    title: "Yaba Sundays",
    artistId: "a3",
    price: 390,
    currency: "USD",
    medium: "Mixed media on paper",
    year: 2025,
    width: 50,
    height: 70,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80",
    tags: ["collage", "lagos", "color"],
    description: "Sunday market chaos, with love.",
  },
  {
    id: "w7",
    slug: "roma-norte-tag",
    title: "ROMA NORTE TAG",
    artistId: "a4",
    price: 240,
    currency: "USD",
    medium: "Spray on wood panel",
    year: 2026,
    width: 40,
    height: 60,
    image:
      "https://images.unsplash.com/photo-1561149877-84d3766dffa3?w=900&q=80",
    tags: ["graffiti", "lettering", "skate"],
    description: "Made in 20 minutes, then ran from the cops. Worth it.",
  },
  {
    id: "w8",
    slug: "skate-saint",
    title: "Skate Saint",
    artistId: "a4",
    price: 350,
    currency: "USD",
    medium: "Acrylic on grip tape",
    year: 2026,
    width: 20,
    height: 80,
    image:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=900&q=80",
    tags: ["graffiti", "skate"],
    description: "Patron saint of slams.",
  },
  {
    id: "w9",
    slug: "bairro-alto-window",
    title: "Bairro Alto Window",
    artistId: "a5",
    price: 180,
    currency: "USD",
    medium: "Risograph print, edition of 50",
    year: 2026,
    width: 30,
    height: 42,
    image:
      "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=900&q=80",
    tags: ["riso", "lisbon", "lo-fi"],
    description: "Looking up at laundry lines like prayer flags.",
  },
  {
    id: "w10",
    slug: "pixel-saudade",
    title: "Pixel Saudade",
    artistId: "a5",
    price: 220,
    currency: "USD",
    medium: "Pixel art print",
    year: 2025,
    width: 30,
    height: 30,
    image:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=900&q=80",
    tags: ["pixel-art", "lo-fi"],
    description: "A small ache, 32 pixels wide.",
  },
  {
    id: "w11",
    slug: "kreuzberg-rug-gremlin",
    title: "Kreuzberg Rug Gremlin",
    artistId: "a6",
    price: 890,
    currency: "USD",
    medium: "Hand-tufted wool rug",
    year: 2026,
    width: 90,
    height: 120,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
    tags: ["textile", "rugs", "weird"],
    description: "A gremlin that lives in your living room and judges you.",
  },
  {
    id: "w12",
    slug: "soft-machine",
    title: "Soft Machine",
    artistId: "a6",
    price: 1200,
    currency: "USD",
    medium: "Tufted yarn sculpture",
    year: 2026,
    width: 60,
    height: 60,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    tags: ["textile", "sculpture"],
    description: "Half engine, half cuddle.",
  },
  {
    id: "w13",
    slug: "hongdae-mug-face",
    title: "HONGDAE MUG FACE",
    artistId: "a7",
    price: 65,
    currency: "USD",
    medium: "Ceramic mug, glazed",
    year: 2026,
    width: 12,
    height: 12,
    image:
      "https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=900&q=80",
    tags: ["ceramics", "functional", "weird"],
    description: "Drink your matcha out of a screaming face.",
  },
  {
    id: "w14",
    slug: "vase-with-feet",
    title: "Vase With Feet",
    artistId: "a7",
    price: 220,
    currency: "USD",
    medium: "Stoneware",
    year: 2026,
    width: 25,
    height: 35,
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&q=80",
    tags: ["ceramics", "sculpture", "body"],
    description: "It walks at night. Probably.",
  },
  {
    id: "w15",
    slug: "vila-madalena-zine-vol1",
    title: "VILA MADALENA ZINE Vol. 1",
    artistId: "a8",
    price: 18,
    currency: "USD",
    medium: "Risograph zine, 32 pages",
    year: 2026,
    width: 15,
    height: 21,
    image:
      "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=900&q=80",
    tags: ["zine", "photo", "diy"],
    description: "Photos from one wild weekend in Vila Madalena.",
  },
  {
    id: "w16",
    slug: "riot-girls-of-sp",
    title: "RIOT GIRLS OF SP",
    artistId: "a8",
    price: 95,
    currency: "USD",
    medium: "Photo print, signed",
    year: 2026,
    width: 30,
    height: 40,
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&q=80",
    tags: ["photo", "riot"],
    description: "Shot at a basement show, 2AM, sweat-soaked.",
  },
];

export function getArtist(id: string): Artist | undefined {
  return ARTISTS.find((a) => a.id === id);
}

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return ARTWORKS.find((w) => w.slug === slug);
}

export function getArtworkLocation(w: Artwork): {
  city: string;
  neighborhood: string;
  country: string;
  countryFlag: string;
  lat: number;
  lng: number;
} {
  const a = getArtist(w.artistId)!;
  return {
    city: w.city ?? a.city,
    neighborhood: w.neighborhood ?? a.neighborhood,
    country: a.country,
    countryFlag: a.countryFlag,
    lat: a.lat,
    lng: a.lng,
  };
}

export function uniqueNeighborhoods(): string[] {
  return Array.from(
    new Set(ARTISTS.map((a) => `${a.neighborhood}, ${a.city}`))
  ).sort();
}

export function uniqueCities(): string[] {
  return Array.from(new Set(ARTISTS.map((a) => a.city))).sort();
}

export function uniqueTags(): string[] {
  const t = new Set<string>();
  ARTWORKS.forEach((w) => w.tags.forEach((tag) => t.add(tag)));
  return Array.from(t).sort();
}
