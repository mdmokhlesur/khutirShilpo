import "./globals.scss";
import { Inter } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";
import Toaster from "@/component/ui/Toaster"
import AppShell from "@/component/core/appShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kutir Shilpo",
  description: "Handmade clay, bamboo, and glass craft collection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        <Toaster/>
        </AuthProvider>
      </body>
    </html>
  );
}
