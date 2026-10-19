import type { Metadata } from "next";
import { Libre_Baskerville, Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../shared/components/navbar";
import Footer from "../shared/components/footer";
import { AuthProvider } from "@/shared/auth/authContext";
import { ToastProvider } from "@/shared/components/toast";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
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
        <AuthProvider>
          <ToastProvider>
            <div className="flex min-h-dvh w-full flex-col">
              <Navbar />
              <main className="flex flex-1 flex-col items-center justify-start pt-6 w-full">
                {children}
              </main>
            </div>
            <Footer /> {/* sibling after the min-h-dvh div */}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
