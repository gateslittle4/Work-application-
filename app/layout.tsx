import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mon suivi de candidatures",
  description: "Suivi personnel de recherche d'emploi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
