
import type { Metadata } from "next";
import "@/app/globals.css";
import { UserProvider } from "@/context/UserContext";


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
        className={`antialiased`}
      >
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
