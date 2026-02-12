import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Print Portal",
  description: "MMCOE Campus Print Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-lg md:text-xl font-semibold">
                Campus Print Portal
              </h1>
            </div>
          </header>

          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
            {children}
          </main>

          <footer className="bg-white border-t text-center py-4 text-sm text-gray-500">
            © {new Date().getFullYear()} MMCOE Print System
          </footer>
        </div>
      </body>
    </html>
  );
}

