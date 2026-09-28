import type { Metadata, Viewport } from "next";
import "@fontsource-variable/unbounded/wght.css";
import "@fontsource-variable/manrope/wght.css";
import "./globals.css";
import { siteUrl } from "./content";

const title = "Ева Дент — честная стоматология в Копейске";
const description =
  "Лечение зубов, имплантация, протезирование, эстетическая реставрация, гигиена и ортодонтия. Первичный приём — 500 ₽. Копейск, ул. Калинина, 16. Запись: +7 (912) 08-25-115.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Ева Дент",
  keywords: [
    "стоматология Копейск",
    "лечение зубов Копейск",
    "имплантация зубов",
    "протезирование зубов",
    "Ева Дент",
  ],
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Ева Дент",
    title,
    description,
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Приём в стоматологии Ева Дент",
      },
    ],
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFF4EC",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
