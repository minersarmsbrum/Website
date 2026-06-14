// Real Miners Arms photography. Unsplash kept only where no matching real photo exists
// (food shots — all real photos are venue interiors).

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const p = (file: string) => `/images/miners-arms/${file}`;

export const images = {
  heroBackground: p("IMG_4162.jpg"),       // Full bar + seating, green ambient lights
  heroPlate: u("photo-1504674900247-0877df9cc836", 1200),
  introInterior: p("IMG_4187.jpg"),        // Warm lounge corridor, amber ceiling lights
  introDetail: p("IMG_4163.jpg"),          // Bar close-up: spirits shelf and beer taps
  aboutHero: p("IMG_4161.jpg"),            // Main dining room, red ceiling lights, wide
  aboutFounder: p("IMG_4170.jpg"),         // Atmospheric seating area, dark with pink lights
  aboutKitchen: u("photo-1556910103-1c02745aae4d", 1200),
  reserveBackground: p("IMG_4172.jpg"),    // Private function room, intimate round table
  menuBackground: u("photo-1424847651672-bf20a4b0982b", 2000),
};

export type GalleryShot = { src: string; alt: string; tall?: boolean };

export const gallery: GalleryShot[] = [
  { src: p("IMG_4162.jpg"), alt: "Our fully stocked bar with draught ales, spirits and cocktails" },
  { src: p("IMG_4170.jpg"), alt: "Settle in for relaxed dining in the heart of the pub", tall: true },
  { src: p("IMG_4163.jpg"), alt: "Cobra, Carling, Madri and rotating guest ales on tap" },
  { src: p("IMG_4164.jpg"), alt: "A bar worth lingering at. Come for a drink, stay for dinner" },
  { src: p("IMG_4187.jpg"), alt: "The lounge, perfect for a quiet meal or a catch-up", tall: true },
  { src: p("IMG_4161.jpg"), alt: "The Miners Arms main dining room, ready for your table" },
  { src: p("IMG_4172.jpg"), alt: "Private events suite, ideal for celebrations and gatherings" },
  { src: p("IMG_4175.jpg"), alt: "Book the function room for birthdays, reunions and more" },
  { src: p("IMG_4188.jpg"), alt: "Comfortable seating for groups, couples and families", tall: true },
  { src: p("IMG_4171.jpg"), alt: "Contemporary interiors with a warm, welcoming feel" },
  { src: p("IMG_4173.jpg"), alt: "Private dining done right, an intimate space all to yourselves" },
  { src: p("IMG_4189.jpg"), alt: "A corner of the pub that feels like it was made for you", tall: true },
];
