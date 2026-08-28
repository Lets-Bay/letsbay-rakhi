import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";

export const metadata: Metadata = {
  title: "Digital Rakhi — Tie a Rakhi from anywhere ❤️",
  description:
    "Can't be together this Raksha Bandhan? Let your sisters tie you a Digital Rakhi. Create your personal Rakhi link and share it with your sisters.",
  openGraph: {
    title: "Digital Rakhi — Tie a Rakhi from anywhere ❤️",
    description:
      "Create your personal Rakhi link, share it with your sisters, and collect their Rakhis wherever you are.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
