"use client";

import { useState, useTransition, FormEvent, useEffect } from "react";
import {
  Loader2, LogOut, ShieldCheck, CheckCircle2, XCircle, AlertTriangle,
  ExternalLink, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CATEGORY_LABELS, CHANNEL_LABELS, formatDate } from "@/lib/labels";

interface PendingIssue {
  number: number;
  title: string;
  state: string;
  created_at: string;
  labels: string[];
  body: string;
}

interface Stats {
  approved: number;
  published_identifiers: number;
  pending: number;
  rejected: number;
  disputed: number;
  gh_configured: boolean;
  recent: Array<{ id: string; category: string; country: string; created_at: string; evidence_status: string }>;
}

/**
 * Admin moderation dashboard.
 *
 * Single-page view for the MVP:
 *  - Login form (calls /api/admin/login, sets signed cookie)
 *  - Dashboard overview (real counts from /api/admin/stats)
 *  - Pending moderation queue (from /api/admin/pending)
 *  - Inline approve / reject actions
 *
 * In development without GitHub credentials, the queue shows a clear notice
 * instead of pretending to have data.
 */
export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then((r) => { if (r.ok) setAuthed(true); })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }
  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      onLogin();
    });
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" style={{ color: "var(--trust-teal)" }} />
          Admin sign in
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="admin-password">Admin secret</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending || !password}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Sign in
          </Button>
          <p className="text-xs text-muted-foreground">
            Access is restricted to authorized moderators. Failed attempts are rate-limited and logged.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [issues, setIssues] = useState<PendingIssue[] | null>(null);
  const [loading, startLoad] = useTransition();

  const refresh = () => {
    startLoad(async () => {
      const [s, i] = await Promise.all([
        fetch("/api/admin/stats", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/admin/pending", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setStats(s);
      setIssues(i.issues || []);
    });
  };
  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "var(--trust-navy)" }}>
            Moderation dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Review pending reports and approve or reject submissions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); onLogout(); }}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published reports" value={stats?.approved ?? "—"} />
        <StatCard label="Tracked identifiers" value={stats?.published_identifiers ?? "—"} />
        <StatCard label="Pending moderation" value={stats?.pending ?? "—"} />
        <StatCard label="Disputed reports" value={stats?.disputed ?? "—"} />
      </div>

      {!stats?.gh_configured && (
        <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-3 text-xs text-amber-800 dark:text-amber-200">
          <p className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              GitHub moderation repository is not configured. Set <code>GITHUB_PRIVATE_OWNER</code>, <code>GITHUB_PRIVATE_REPO</code> and <code>GITHUB_PRIVATE_TOKEN</code> to enable the live moderation queue. Until then, the pending list is empty.
            </span>
          </p>
        </div>
      )}

      {/* Pending issues */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--trust-navy)" }}>
          Pending review
        </h3>
        {issues === null ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : issues.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No pending reports. New submissions will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {issues.map((i) => (
              <PendingIssueRow key={i.number} issue={i} onAction={refresh} />
            ))}
          </div>
        )}
      </div>

      {/* Recent published */}
      {stats && stats.recent.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--trust-navy)" }}>
            Recently published
          </h3>
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left font-medium p-2">ID</th>
                  <th className="text-left font-medium p-2">Category</th>
                  <th className="text-left font-medium p-2">Country</th>
                  <th className="text-left font-medium p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="p-2 font-mono text-xs">{r.id}</td>
                    <td className="p-2">{CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS] || r.category}</td>
                    <td className="p-2">{r.country}</td>
                    <td className="p-2 text-muted-foreground">{formatDate(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold" style={{ color: "var(--trust-navy)" }}>{value}</p>
      </CardContent>
    </Card>
  );
}

/** Parse a moderation issue body into editable form fields (called once on mount). */
function parseIssue(issue: PendingIssue) {
  const body = issue.body || "";
  const get = (key: string) => {
    const re = new RegExp("- " + key + ": `?([^\\n`]+)`?");
    const m = body.match(re);
    return m ? m[1].trim() : "";
  };
  const refMatch = issue.title.match(/\[(SC-[^\]]+)\]/);
  const descMatch = body.match(/### Description\s+([\s\S]*?)(?:\n###|\n---|$)/);
  return {
    category: get("Category"),
    channel: get("Channel"),
    identifierType: get("Identifier type"),
    identifierValue: get("Identifier value"),
    country: get("Country"),
    incidentDate: get("Incident date"),
    reference: refMatch ? refMatch[1] : "",
    description: descMatch ? descMatch[1].trim() : "",
  };
}

function PendingIssueRow({ issue, onAction }: { issue: PendingIssue; onAction: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [acting, startAction] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Parse the issue body once on mount (the row is keyed by issue.number,
  // so it remounts for each issue and these initial values are fresh).
  const initial = parseIssue(issue);
  const [category, setCategory] = useState(initial.category);
  const [channel, setChannel] = useState(initial.channel);
  const [identifierType, setIdentifierType] = useState(initial.identifierType);
  const [identifierValue, setIdentifierValue] = useState(initial.identifierValue);
  const [country, setCountry] = useState(initial.country);
  const [description, setDescription] = useState(initial.description);
  const [incidentDate, setIncidentDate] = useState(initial.incidentDate);
  const [evidence, setEvidence] = useState("unverified");
  const [corroboration, setCorroboration] = useState("1");
  const [reference, setReference] = useState(initial.reference);

  async function approve() {
    setError(null);
    if (!category || !channel || !identifierType || !identifierValue || !country || !description || !incidentDate || !reference) {
      setError("All fields are required to approve.");
      return;
    }
    startAction(async () => {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue_number: issue.number,
          reference,
          category, channel,
          identifier_type: identifierType,
          identifier_value: identifierValue,
          country, description,
          incident_date: incidentDate,
          evidence_status: evidence,
          corroboration_count: Number(corroboration),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Approve failed"); return; }
      onAction();
    });
  }
  async function reject() {
    setError(null);
    startAction(async () => {
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue_number: issue.number, reference }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Reject failed"); return; }
      onAction();
    });
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground">#{issue.number}</span>
              <span className="text-sm font-medium" style={{ color: "var(--trust-navy)" }}>{issue.title}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              {issue.labels.map((l) => (
                <Badge key={l} variant="outline" className="text-[10px]">{l}</Badge>
              ))}
              <span className="text-xs text-muted-foreground">{formatDate(issue.created_at)}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Hide" : "Review"}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 border-t border-border pt-4 space-y-4">
            <details className="rounded-md border border-border bg-muted/20 p-3 text-xs">
              <summary className="cursor-pointer font-medium text-muted-foreground">
                Raw submission (server-side only — do not publish verbatim)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-foreground/80 max-h-72 overflow-y-auto">{issue.body}</pre>
            </details>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Reference">
                <Input value={reference} onChange={(e) => setReference(e.target.value)} className="font-mono text-xs" />
              </Field>
              <Field label="Category">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Channel">
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Channel" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CHANNEL_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Identifier type">
                <Select value={identifierType} onValueChange={setIdentifierType}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Identifier type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone Number</SelectItem>
                    <SelectItem value="domain">Website Domain</SelectItem>
                    <SelectItem value="url">Website URL</SelectItem>
                    <SelectItem value="email">Email Address</SelectItem>
                    <SelectItem value="social_profile">Social Profile</SelectItem>
                    <SelectItem value="business_name">Business / Seller Name</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Identifier value (raw, server-side only)">
                <Input value={identifierValue} onChange={(e) => setIdentifierValue(e.target.value)} className="font-mono text-xs" />
              </Field>
              <Field label="Country">
                <Input value={country} onChange={(e) => setCountry(e.target.value)} />
              </Field>
              <Field label="Incident date">
                <Input type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
              </Field>
              <Field label="Evidence status">
                <Select value={evidence} onValueChange={setEvidence}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unverified">Unverified community report</SelectItem>
                    <SelectItem value="multiple_reports">Multiple independent reports</SelectItem>
                    <SelectItem value="evidence_reviewed">Evidence reviewed</SelectItem>
                    <SelectItem value="independently_confirmed">Independently confirmed</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Corroboration count">
                <Input type="number" min={1} max={9999} value={corroboration} onChange={(e) => setCorroboration(e.target.value)} />
              </Field>
            </div>
            <Field label="Description (will be published — redact any private info)">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px]" maxLength={2000} />
            </Field>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={reject} disabled={acting}>
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button size="sm" onClick={approve} disabled={acting}>
                {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Approve & publish
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Approving will mask the identifier, publish the sanitized JSON to the public repository, and update this issue's labels.
              {!process.env.NEXT_PUBLIC_APP_URL ? " In this environment, the GitHub public repo is not configured — approval runs but does not write a JSON file." : ""}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
