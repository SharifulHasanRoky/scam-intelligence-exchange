import type { Metadata } from "next";
import { LatestReportsView } from "./latest-reports-view";

export const metadata: Metadata = {
  title: "Latest community reports",
  description:
    "Recently approved reports from community members. Identifiers are masked to protect privacy.",
};

export default function LatestReportsPage() {
  return <LatestReportsView />;
}
