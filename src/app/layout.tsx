import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/shared/ui/Toast";

export const metadata: Metadata = {
  title: "Slidey",
  description:
    "그리디 디자인 틀에 맞춰 발표 자료를 만들고, 발표하고, 공유하고, 내려받아요.",
  icons: { icon: "/icon.svg" },
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
