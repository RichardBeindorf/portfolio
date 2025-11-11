import type { Metadata } from "next";
import "../styles/globals.css";
import IOSScrollBlock from "./scrollBlocker";

export const metadata: Metadata = {
  title: "RB Portfolio",
  description: "Richard`s digital buisness card",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body>
        <IOSScrollBlock />
        {children}
      </body>
    </html>
  );
}
