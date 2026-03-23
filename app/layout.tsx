import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arıza & İş Emri Oluşturucu",
  description: "Sahadaki operatörlerin arıza bildirimlerini standart formatta oluşturup QR kod ile aktarmasını sağlayan araç",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
