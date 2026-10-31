"use client";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

/**
 * Production admin entry point. Renders the AdminDashboard inside a minimal
 * site layout (header + footer). Access is gated server-side by the
 * /api/admin/* routes — this page is only the UI shell.
 */
export function AdminView() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 container-page py-8 sm:py-10">
        <div className="mb-6">
          <p
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--trust-teal)" }}
          >
            Moderation
          </p>
          <h1
            className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "var(--trust-navy)" }}
          >
            Admin
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Moderation queue and platform overview. Access is protected by
            server-side authentication, rate-limiting and audit logging.
          </p>
        </div>
        <AdminDashboard />
      </main>
      <SiteFooter />
    </div>
  );
}
