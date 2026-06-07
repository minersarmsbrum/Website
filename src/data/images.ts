// Curated free stock (Unsplash). Each section keeps a dark gradient behind it,
// so the layout stays premium even if a remote image is slow or unavailable.

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const images = {
  heroBackground: u("photo-1517248135467-4c7edcad34c4", 2000),
  heroPlate: u("photo-1504674900247-0877df9cc836", 1200),
  introInterior: u("photo-1559339352-11d035aa65de", 1400),
  introDetail: u("photo-1466978913421-dad2ebd01d17", 1000),
  aboutHero: u("photo-1414235077428-338989a2e8c0", 2000),
  aboutFounder: u("photo-1577219491135-ce391730fb2c", 1200),
  aboutKitchen: u("photo-1556910103-1c02745aae4d", 1200),
  reserveBackground: u("photo-1592861956120-e524fc739696", 2000),
  menuBackground: u("photo-1424847651672-bf20a4b0982b", 2000),
};

export type GalleryShot = { src: string; alt: string; tall?: boolean };

export const gallery: GalleryShot[] = [
  { src: u("photo-1555939594-58d7cb561ad1", 1100), alt: "Char-grilled mixed grill platter", tall: true },
  { src: u("photo-1603894584373-5ac82b2ae398", 900), alt: "Rich Indian butter chicken curry" },
  { src: u("photo-1559339352-11d035aa65de", 900), alt: "Warm restaurant interior" },
  { src: u("photo-1563245372-f21724e3856d", 900), alt: "Steamed bao buns" },
  { src: u("photo-1626645738196-c2a7c87a8f58", 1100), alt: "Stir-fried chow mein noodles", tall: true },
  { src: u("photo-1525351484163-7529414344d8", 900), alt: "Full English breakfast" },
  { src: u("photo-1606491956689-2ea866880c84", 900), alt: "Fresh naan from the tandoor" },
  { src: u("photo-1514933651103-005eec06c04b", 1100), alt: "Friends sharing plates and drinks", tall: true },
  { src: u("photo-1518983546435-91f8b87fe561", 900), alt: "Crispy aromatic duck with pancakes" },
  { src: u("photo-1567188040759-fb8a883dc6d8", 900), alt: "Salt and pepper chilli prawns" },
  { src: u("photo-1432139555190-58524dae6a55", 900), alt: "Grilled lamb chops" },
  { src: u("photo-1517248135467-4c7edcad34c4", 1100), alt: "Bar and dining room ambience", tall: true },
];
