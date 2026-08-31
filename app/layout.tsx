import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LumaDesk — Commerce, clearly managed",
  description:
    "A calm, responsive commerce dashboard for customers, orders, and business analytics.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
