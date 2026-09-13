import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vegas Prime — Cassino Premium (fictício)",
  description:
    "Roleta europeia, caça-níqueis e Aviator 100% fictícios, com visual premium. Jogue com penas, sem dinheiro real.",
  applicationName: "Vegas Prime",
  keywords: ["cassino", "roleta", "caça-níqueis", "aviator", "jogo", "fictício", "premium"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}