import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const kanit = Kanit({
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Glory - Watch Thai & International Movies & TV Shows",
  description: "Stream the best Thai films, Sci-Fi thrillers, chilling horrors, and hilarious comedies online on ThaiFlix. Seamless playback, reviews, and personalized watch lists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="gold"
      className={`${kanit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
