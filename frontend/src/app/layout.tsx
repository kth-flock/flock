import type { Metadata } from "next";
import { Libre_Baskerville, Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../shared/components/navbar";
import Footer from "../shared/components/footer";

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
    <body className="flex flex-col px-6 md:px-24 items-center">
      <div className="flex min-h-dvh w-full flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center w-full">
          {children}
        </main>
      </div>
      <Footer />   {/* sibling after the min-h-dvh div */}
    </body>
    </html>
  );
}
