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
  title: "PAPAGAIADA — Cassino Premium (fictício)",
  description:
    "Roleta europeia e caça-níqueis 100% fictícios, com visual premium. Jogue com penas, sem dinheiro real.",
  applicationName: "PAPAGAIADA",
  keywords: ["cassino", "roleta", "caça-níqueis", "jogo", "fictício", "premium"],
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