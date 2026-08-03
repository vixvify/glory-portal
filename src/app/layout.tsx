import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";

export const metadata: Metadata = {
  title: "glory",
  description:
    "Stream the best Thai films, Sci-Fi thrillers, chilling horrors, and hilarious comedies online on Glory. Seamless playback, reviews, and personalized watch lists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="gold" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">
        <ThemeRegistry>
          <Providers>
            <Navbar />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
