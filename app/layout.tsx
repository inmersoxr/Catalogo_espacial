import type { Metadata } from "next";
import "@fontsource-variable/inter-tight";
import "./globals.css";
export const metadata: Metadata = {
  title: "Spatial Catalog — Issue 001",
  description:
    "How space becomes commerce. An interactive editorial by Doctor Brown Labs. Three rooms. Nine moments. A new way to see commerce.",
  metadataBase: new URL("https://inmersoxr.github.io/Catalogo_espacial/"),
  openGraph: {
    title: "Spatial Catalog / Issue 001",
    description: "How space becomes commerce.",
    images: ["images/living.jpg"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
