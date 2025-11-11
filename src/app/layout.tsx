import type { Metadata } from "next";
import "../styles/globals.css";

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
      <body>{children}</body>
    </html>
  );
}
