"use client";

import React from "react";
import { AppProvider } from "../../src/context/AppContext";
import { Sidebar } from "../../src/components/common/Sidebar";
import { Header } from "../../src/components/common/Header";
import { Toast } from "../../src/components/common/Toast";
import { AllModals } from "../../src/components/modals/AllModals";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#09070B] text-[#F3F1F5]">
        {/* Persistent App Router Sidebar with dynamic multi-tenant role filtering */}
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar with multi-tenant org switcher & user profiles */}
          <Header />

          {/* Dynamic App Router Page Content */}
          <main className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>

        {/* Global Modals & Notifications */}
        <AllModals />
        <Toast />
      </div>
    </AppProvider>
  );
}
