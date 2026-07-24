import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/shared/ui/Toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://slidey-five.vercel.app"),
  title: "Slidey",
  description:
    "그리디 디자인 틀에 맞춰 발표 자료를 만들고, 발표하고, 공유하고, 내려받아요.",
  icons: { icon: "/icon.svg" },
  // 링크를 공유할 때 뜨는 카드예요. public/og.png가 미리보기 이미지가 돼요.
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Slidey",
    title: "Slidey",
    description: "발표 자료, 틀 고민 없이 — 그리디 디자인 틀로 만들고 내려받아요.",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Slidey — 발표 자료, 틀 고민 없이" },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
