/**
 * Audit log — minimal append-only JSON log to /tmp/audit in development.
 *
 * In production this should be backed by a durable store (e.g. GitHub issue
 * comments, a log service, or eventually a database table). For the MVP we
 * write a local JSONL file so moderation actions are traceable.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const AUDIT_DIR = process.env.AUDIT_DIR || "/tmp/sie-audit";
const AUDIT_FILE = path.join(AUDIT_DIR, "audit.jsonl");

export interface AuditEvent {
  ts: string;
  actor: string; // "admin" | "system" | "visitor"
  action: string; // "approve" | "reject" | "submit" | "login" | "publish"
  target?: string; // report id or issue number
  meta?: Record<string, unknown>;
}

export async function audit(event: Omit<AuditEvent, "ts">): Promise<void> {
  const full: AuditEvent = { ts: new Date().toISOString(), ...event };
  try {
    await fs.mkdir(AUDIT_DIR, { recursive: true });
    await fs.appendFile(AUDIT_FILE, JSON.stringify(full) + "\n", "utf-8");
  } catch {
    // Audit failures must never break the user flow.
  }
}
