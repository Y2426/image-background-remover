import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Background Remover - Remove Background Online Free",
  description:
    "Remove image backgrounds online for free. Upload a JPG, PNG, or WEBP image and download a transparent PNG instantly. No signup and no image storage.",
  keywords: [
    "image background remover",
    "remove image background",
    "background remover online",
    "transparent background maker",
    "product background remover",
    "white background maker",
    "png background remover",
  ],
  metadataBase: new URL("https://image-background-remover.pages.dev"),
  openGraph: {
    title: "Image Background Remover",
    description:
      "Remove image backgrounds instantly. No signup. No image storage.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4ed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
