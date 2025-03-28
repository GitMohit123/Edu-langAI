import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "@/app/globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduLang - Breaking Language Barriers in Education with AI",
  description:
    "EduLang uses cutting-edge AI to connect teachers and students across languages, making educational materials accessible to everyone.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
