import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MECATRONIC Thing",
  description:
    "Guía paso a paso para mecatrónicos junior: idea, investigación, diseño, materiales, precio y bitácora de sus proyectos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
