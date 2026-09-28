import { clinic, faq, lead, services, team } from "./content";

// Микроразметка Schema.org в формате JSON-LD: карточка клиники для
// Яндекса и Google, услуги со ссылками на прайс и блок вопросов.
export function buildSchema() {
  const clinicId = `${clinic.site}#clinic`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Dentist", "MedicalClinic"],
        "@id": clinicId,
        name: clinic.name,
        legalName: clinic.legalName,
        slogan: clinic.slogan,
        description:
          "Стоматология в Копейске: лечение зубов, хирургия, имплантация, эстетическая реставрация, протезирование, профессиональная гигиена и ортодонтия.",
        url: clinic.site,
        logo: clinic.logoUrl,
        image: clinic.photoUrl,
        telephone: "+79120825115",
        email: clinic.email,
        taxID: clinic.inn,
        identifier: [
          { "@type": "PropertyValue", propertyID: "ИНН", value: clinic.inn },
          { "@type": "PropertyValue", propertyID: "ОГРН", value: clinic.ogrn },
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: clinic.street,
          addressLocality: clinic.city,
          addressRegion: clinic.region,
          postalCode: clinic.postalCode,
          addressCountry: "RU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: clinic.geo.lat,
          longitude: clinic.geo.lon,
        },
        hasMap: clinic.gisUrl,
        sameAs: [clinic.gisUrl],
        areaServed: [
          { "@type": "City", name: "Копейск" },
          { "@type": "City", name: "Челябинск" },
        ],
        currenciesAccepted: "RUB",
        medicalSpecialty: "https://schema.org/Dentistry",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "19:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday", "Sunday"],
            opens: "10:00",
            closes: "16:00",
          },
        ],
        founder: { "@id": `${clinic.site}#legotina` },
        employee: [
          {
            "@type": "Person",
            "@id": `${clinic.site}#legotina`,
            name: `${lead.surname} ${lead.name}`,
            jobTitle: [lead.role, ...lead.specialties],
          },
          ...team.map((person) => ({
            "@type": "Person",
            name: `${person.surname} ${person.name}`,
            jobTitle: person.role,
          })),
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Услуги стоматологии",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            url: service.url,
            itemOffered: {
              "@type": "MedicalProcedure",
              name: service.title,
              description: service.text,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${clinic.site}#website`,
        name: "Ева Дент — стоматология в Копейске",
        inLanguage: "ru-RU",
        publisher: { "@id": clinicId },
      },
      {
        "@type": "FAQPage",
        inLanguage: "ru-RU",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
