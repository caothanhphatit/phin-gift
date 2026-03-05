import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "PhinGift Backoffice",
        template: "%s | PhinGift Admin",
    },
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.className}>
            <body className="bg-[#0F1117] text-gray-100 min-h-screen">
                <div className="flex min-h-screen">
                    <AdminSidebar />
                    <main className="flex-1 ml-64 min-h-screen">
                        <div className="p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
