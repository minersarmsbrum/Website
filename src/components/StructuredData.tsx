import { site } from "@/data/site";

export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.name,
    description:
      "A West Bromwich grill house serving English breakfasts, Indian curries and Chinese small plates.",
    servesCuisine: ["British", "Indian", "Chinese", "Vietnamese"],
    priceRange: "££",
    telephone: "+441212740960",
    url: "https://miners-arms.vercel.app",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: "West Bromwich",
      postalCode: site.address.postcode,
      addressCountry: "GB",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "15:00",
        closes: "23:00",
      },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "12:00", closes: "23:59" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "12:00", closes: "23:59" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "23:00" },
    ],
    sameAs: [site.social.facebook, site.social.instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
