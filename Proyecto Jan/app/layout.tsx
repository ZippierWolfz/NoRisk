import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoRisk - Asistente inteligente de inversion",
  description:
    "NoRisk analiza carteras de acciones y ETFs para transformar datos financieros en decisiones claras.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
