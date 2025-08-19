import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Die Auswirkung von Schlafmangel auf die Leistungsfähigkeit in der Software Entwicklung',
  description: 'Lange Nächte am Rechner sind in der Softwareentwicklung keine Seltenheit – doch Schlafmangel hat direkte Folgen auf Konzentration, Kreativität und Code-Qualität. In diesem Talk zeige ich, wie fehlender Schlaf die Leistungsfähigkeit von Entwickler:innen beeinträchtigt und warum er ein entscheidender Faktor für nachhaltige Produktivität und Team-Erfolg ist.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}