import type { Metadata } from "next";
import { Libre_Baskerville, Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flock",
  description: "Bring your friends!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col px-6 md:px-24">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
