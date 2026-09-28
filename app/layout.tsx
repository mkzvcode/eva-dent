import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Ева Дент — стоматология с заботой в Копейске",description:"Лечение, имплантация, протезирование и забота о вашей улыбке. Копейск, ул. Калинина, 16. +7 (912) 08-25-115.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ru"><body>{children}</body></html>}
