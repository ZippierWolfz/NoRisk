"use client";

import { ReactNode, useState } from "react";
import { AppStateProvider } from "@/context/app-state";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function ProductLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppStateProvider>
      <div className="min-h-screen bg-slate-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-72">
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </AppStateProvider>
  );
}
