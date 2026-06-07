// Single source of truth for brand, contact & hours.
// Sourced verbatim from miners-arms.com (live site).

export const site = {
  name: "The Miners Arms",
  shortName: "Miners Arms",
  tagline: "British grill house & pub",
  // Owner is of Indian-Chinese heritage — the menu spans English, Indian & Chinese.
  hero: {
    eyebrow: "West Bromwich · Est. 2015",
    headline: ["British comfort.", "Indian fire.", "Chinese soul."],
    sub: "A neighbourhood grill house where the full English, slow-cooked curries and hand-folded bao share one table — every plate a taste of comfort and community.",
  },
  address: {
    line1: "58 Bagnall Street",
    line2: "Hilltop, West Bromwich",
    postcode: "B70 0TW",
    country: "United Kingdom",
  },
  phone: "0121 274 0960",
  phoneHref: "tel:+441212740960",
  mapsQuery: "Miners+Arms+58+Bagnall+Street+West+Bromwich+B70+0TW",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61574035670847",
    instagram: "https://www.instagram.com/minerarmspub/",
  },
  hours: {
    pub: [
      { day: "Monday – Thursday", time: "3:00pm – 11:00pm" },
      { day: "Friday", time: "12:00pm – Midnight", note: "Food from 3:00pm" },
      { day: "Saturday", time: "12:00pm – Midnight", note: "Food from 1:30pm" },
      { day: "Sunday", time: "12:00pm – 11:00pm", note: "Food from 1:30pm" },
    ],
    cafe: [{ day: "Monday – Friday", time: "7:30am – 2:00pm" }],
  },
  highlights: [
    { label: "Chef-led", detail: "Signature marinades, made fresh daily" },
    { label: "Generous", detail: "Portions built for sharing" },
    { label: "Three kitchens", detail: "English · Indian · Chinese, one roof" },
    { label: "Community", detail: "A warm welcome for every occasion" },
  ],
} as const;

export type Site = typeof site;
