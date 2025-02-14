import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import NextTopLoader from 'nextjs-toploader';
import SideBarItems from "@/components/SideBarItems";
import SideBar from "@/components/SideBar";
import { Building2Icon, ChartPieIcon, LayoutDashboard } from "lucide-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Real Estate Admin Page",
  description:
    "This is the Admin Page of the Real Estate Application where you can manage all the data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <main className="flex gap-2 w-full" >
          <NextTopLoader
            color="#2299DD"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          />

          <SideBar>
            <div className="mt-4 w-full">
              <SideBarItems link="/" active={false} alert={true} icon={<LayoutDashboard size={20} />} text="Dashboard" />
              <SideBarItems link="/projects" active={true} alert={true} icon={<Building2Icon size={20} />} text="Projects" />
              <SideBarItems link="/" active={false} alert={true} icon={<ChartPieIcon size={20} />} text="Analytics" />
            </div>
          </SideBar>
          <div className="w-[79vw] max-h-screen overflow-y-scroll" >
            {children}
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}