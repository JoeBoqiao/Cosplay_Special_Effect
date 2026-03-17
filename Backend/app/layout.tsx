import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cosplay AI Backend",
  description: "Backend API for AI-powered cosplay photo special effects.",
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
