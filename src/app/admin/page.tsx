import type { Metadata } from "next";
import { AdminView } from "./admin-view";

export const metadata: Metadata = {
  title: "Admin",
  description:
    "Moderation dashboard for authorized editors of the Scam Intelligence Exchange.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminView />;
}
