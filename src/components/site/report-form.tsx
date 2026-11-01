"use client";

import { useState, useTransition, FormEvent } from "react";
import {
  ShieldAlert, Check, ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES } from "@/data/categories";
import { COUNTRIES } from "@/data/countries";
import {
  CATEGORY_LABELS, CHANNEL_LABELS, IDENTIFIER_TYPE_LABELS,
} from "@/lib/labels";
import type {
  ScamCategory, CommunicationChannel, IdentifierType, ReportSubmission,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const CHANNELS: CommunicationChannel[] = [
  "whatsapp", "facebook", "instagram", "telegram", "website",
  "email", "phone_call", "sms", "other",
];
const IDENTIFIER_TYPES: IdentifierType[] = [
  "phone", "domain", "url", "email", "social_profile", "business_name",
];

const STEPS = ["Category", "Channel", "Identifier", "Incident", "Consent", "Review"] as const;

interface FormState {
  category: ScamCategory | "";
  channel: CommunicationChannel | "";
  identifier_type: IdentifierType | "";
  identifier_value: string;
  country: string;
  description: string;
  incident_date: string;
  asked_for_money: boolean;
  lost_money: boolean;
  additional_info: string;
  reporter_handle: string;
  consent_good_faith: boolean;
  consent_not_false: boolean;
  consent_understands_review: boolean;
  consent_understands_redaction: boolean;
  /** honeypot */
  company: string;
}

const INITIAL: FormState = {
  category: "", channel: "", identifier_type: "", identifier_value: "",
  country: "", description: "", incident_date: "", asked_for_money: false,
  lost_money: false, additional_info: "", reporter_handle: "",
  consent_good_faith: false, consent_not_false: false,
  consent_understands_review: false, consent_understands_redaction: false,
  company: "",
};

/**
 * Multi-step report submission form (spec §11).
 *
 * Steps:
 *  1. Scam category
 *  2. Communication channel
 *  3. Suspicious identifier
 *  4. Incident details
 *  5. Submission consent
 *  6. Review & submit
 *
 * Submits to /api/reports. Server validates, sanitizes, runs Gemini analysis,
 * and creates a private GitHub moderation issue. Returns a reference number.
 */
export function ReportForm({ onSubmitted }: { onSubmitted?: (reference: string) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ reference: string; note?: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canNext = () => {
    switch (step) {
      case 0: return !!form.category;
      case 1: return !!form.channel;
      case 2: return form.identifier_type !== "" && form.identifier_value.trim().length >= 3;
      case 3:
        return (
          form.description.trim().length >= 20 &&
          !!form.incident_date &&
          !!form.country
        );
      case 4:
        return (
          form.consent_good_faith &&
          form.consent_not_false &&
          form.consent_understands_review &&
          form.consent_understands_redaction
        );
      default: return true;
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canNext()) {
      setError("Please complete all required fields before submitting.");
      return;
    }
    const payload: ReportSubmission & { company?: string } = {
      category: form.category as ScamCategory,
      channel: form.channel as CommunicationChannel,
      identifier_type: form.identifier_type as IdentifierType,
      identifier_value: form.identifier_value.trim(),
      country: form.country,
      description: form.description.trim(),
      incident_date: form.incident_date,
      asked_for_money: form.asked_for_money,
      lost_money: form.lost_money,
      additional_info: form.additional_info.trim() || undefined,
      reporter_handle: form.reporter_handle.trim() || undefined,
      consent: {
        good_faith: form.consent_good_faith,
        not_false: form.consent_not_false,
        understands_review: form.consent_understands_review,
        understands_redaction: form.consent_understands_redaction,
      },
      company: form.company, // honeypot
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Submission failed");
        }
        setResult({ reference: data.reference, note: data.note });
        onSubmitted?.(data.reference);
      } catch (e: any) {
        setError(e.message || "Something went wrong. Please try again.");
      }
    });
  }

  if (result) {
    return <SuccessPanel reference={result.reference} note={result.note} onReset={() => { setForm(INITIAL); setStep(0); setResult(null); }} />;
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="rounded-2xl border border-border bg-background p-5 sm:p-7">
      {/* Stepper header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {STEPS.length} — {STEPS[step]}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="mt-2 h-1.5" />
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Honeypot — hidden from users, visible to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company">Company (leave empty)</label>
          <input
            id="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>

        {step === 0 && (
          <Step title="What type of scam are you reporting?" subtitle="Choose the closest match. You can change this later.">
            <OptionGrid
              value={form.category}
              onChange={(v) => set("category", v as ScamCategory)}
              options={CATEGORIES.map((c) => ({ value: c.id, label: c.name, desc: c.short_description }))}
            />
          </Step>
        )}

        {step === 1 && (
          <Step title="How were you contacted?" subtitle="Pick the primary channel the scammer used to reach you.">
            <OptionGrid
              value={form.channel}
              onChange={(v) => set("channel", v as CommunicationChannel)}
              options={CHANNELS.map((c) => ({ value: c, label: CHANNEL_LABELS[c] }))}
              columns={3}
            />
          </Step>
        )}

        {step === 2 && (
          <Step title="What is the suspicious identifier?" subtitle="Provide the phone number, website, email, profile or business name so we can match it against other reports.">
            <div className="space-y-4">
              <div>
                <Label htmlFor="identifier_type">Identifier type</Label>
                <Select
                  value={form.identifier_type}
                  onValueChange={(v) => set("identifier_type", v as IdentifierType)}
                >
                  <SelectTrigger id="identifier_type" className="mt-1.5 w-full">
                    <SelectValue placeholder="Select identifier type" />
                  </SelectTrigger>
                  <SelectContent>
                    {IDENTIFIER_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{IDENTIFIER_TYPE_LABELS[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="identifier_value">Identifier value</Label>
                <Input
                  id="identifier_value"
                  className="mt-1.5"
                  value={form.identifier_value}
                  onChange={(e) => set("identifier_value", e.target.value)}
                  placeholder="e.g. +60123456789, example.com, name@example.com"
                  autoComplete="off"
                  spellCheck={false}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Raw identifiers are used for matching only. They will be masked before being published.
                </p>
              </div>
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="What happened?" subtitle="Describe the incident. Do not include passwords, OTPs, card numbers or identity document numbers.">
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  className="mt-1.5 min-h-[120px]"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe what happened in your own words. At least 20 characters."
                  maxLength={2000}
                />
                <p className="mt-1 text-xs text-muted-foreground">{form.description.length}/2000</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="incident_date">When did it happen?</Label>
                  <Input
                    id="incident_date"
                    type="date"
                    className="mt-1.5"
                    value={form.incident_date}
                    onChange={(e) => set("incident_date", e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country where it happened</Label>
                  <Select
                    value={form.country}
                    onValueChange={(v) => set("country", v)}
                  >
                    <SelectTrigger id="country" className="mt-1.5 w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <ConsentToggle
                  checked={form.asked_for_money}
                  onCheckedChange={(v) => set("asked_for_money", v)}
                  label="I was asked to send money"
                />
                <ConsentToggle
                  checked={form.lost_money}
                  onCheckedChange={(v) => set("lost_money", v)}
                  label="I lost money"
                />
              </div>
              <div>
                <Label htmlFor="additional_info">Additional information (optional)</Label>
                <Textarea
                  id="additional_info"
                  className="mt-1.5 min-h-[80px]"
                  value={form.additional_info}
                  onChange={(e) => set("additional_info", e.target.value)}
                  placeholder="Any other relevant context — URLs, screenshots descriptions, related contacts."
                  maxLength={1000}
                />
              </div>
              <div>
                <Label htmlFor="reporter_handle">Reporter handle (optional, anonymous)</Label>
                <Input
                  id="reporter_handle"
                  className="mt-1.5"
                  value={form.reporter_handle}
                  onChange={(e) => set("reporter_handle", e.target.value)}
                  placeholder="A nickname so you can identify your report later. No real name required."
                  maxLength={64}
                />
              </div>
            </div>
          </Step>
        )}

        {step === 4 && (
          <Step title="Submission consent" subtitle="Please confirm each statement before continuing.">
            <div className="space-y-3">
              <ConsentToggle
                checked={form.consent_good_faith}
                onCheckedChange={(v) => set("consent_good_faith", v)}
                label="I am submitting this information in good faith."
              />
              <ConsentToggle
                checked={form.consent_not_false}
                onCheckedChange={(v) => set("consent_not_false", v)}
                label="I have not knowingly submitted false information."
              />
              <ConsentToggle
                checked={form.consent_understands_review}
                onCheckedChange={(v) => set("consent_understands_review", v)}
                label="I understand that submitted reports will be reviewed by a moderator before publication."
              />
              <ConsentToggle
                checked={form.consent_understands_redaction}
                onCheckedChange={(v) => set("consent_understands_redaction", v)}
                label="I understand that private information may be removed before publication."
              />
            </div>
            <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              Reports are anonymous by default. No account is required. Your IP address is rate-limited and not stored with your report.
            </div>
          </Step>
        )}

        {step === 5 && (
          <Step title="Review and submit" subtitle="Please review your report before submitting.">
            <ReviewSummary form={form} />
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-3 text-xs text-amber-800 dark:text-amber-200">
              <p className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Your report will be queued for moderation. It will <strong>not</strong> be published immediately. A reference number will be issued so you can track its status. A community report is a submitted experience — it does not establish criminal wrongdoing.
                </span>
              </p>
            </div>
          </Step>
        )}

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

        {/* Step nav */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={prev}
            disabled={step === 0 || pending}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              size="sm"
              onClick={next}
              disabled={!canNext() || pending}
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" size="sm" disabled={!canNext() || pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
              Submit report
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold" style={{ color: "var(--trust-navy)" }}>{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function OptionGrid({
  value, onChange, options, columns = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string; desc?: string }>;
  columns?: number;
}) {
  const cols = columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <RadioGroup value={value} onValueChange={onChange} className={`grid gap-2 ${cols}`}>
      {options.map((o) => (
        <label
          key={o.value}
          htmlFor={`opt-${o.value}`}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
            value === o.value
              ? "border-foreground/30 bg-accent/60"
              : "border-border hover:bg-accent/30"
          )}
        >
          <RadioGroupItem value={o.value} id={`opt-${o.value}`} className="mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{o.label}</p>
            {o.desc && <p className="mt-0.5 text-xs text-muted-foreground">{o.desc}</p>}
          </div>
        </label>
      ))}
    </RadioGroup>
  );
}

function ConsentToggle({
  checked, onCheckedChange, label,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-accent/30 transition-colors">
      <Checkbox checked={checked} onCheckedChange={(v) => onCheckedChange(!!v)} className="mt-0.5" />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function ReviewSummary({ form }: { form: FormState }) {
  const rows: Array<[string, string]> = [
    ["Category", form.category ? CATEGORY_LABELS[form.category as ScamCategory] : "—"],
    ["Channel", form.channel ? CHANNEL_LABELS[form.channel as CommunicationChannel] : "—"],
    ["Identifier type", form.identifier_type ? IDENTIFIER_TYPE_LABELS[form.identifier_type as IdentifierType] : "—"],
    ["Identifier value", form.identifier_value || "—"],
    ["Country", form.country || "—"],
    ["Incident date", form.incident_date || "—"],
    ["Asked for money", form.asked_for_money ? "Yes" : "No"],
    ["Lost money", form.lost_money ? "Yes" : "No"],
    ["Description", form.description ? `${form.description.length} chars` : "—"],
  ];
  return (
    <dl className="grid gap-2 sm:grid-cols-2 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-3 rounded-md border border-border bg-muted/20 px-3 py-2">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="font-medium text-right truncate max-w-[60%]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function SuccessPanel({
  reference, note, onReset,
}: {
  reference: string;
  note?: string;
  onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
        <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h3 className="mt-4 text-xl font-semibold" style={{ color: "var(--trust-navy)" }}>
        Report received
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        Your report has been queued for moderation. It will be reviewed by an editor before being published. Thank you for helping protect the community.
      </p>
      <div className="mt-5 inline-flex flex-col items-center gap-1 rounded-lg border border-border bg-muted/30 px-5 py-3">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Reference number</span>
        <span className="font-mono text-lg font-semibold" style={{ color: "var(--trust-teal)" }}>{reference}</span>
      </div>
      {note && (
        <p className="mt-3 text-xs text-amber-700 dark:text-amber-300 max-w-md mx-auto">{note}</p>
      )}
      <div className="mt-6">
        <Button variant="outline" size="sm" onClick={onReset}>
          Submit another report
        </Button>
      </div>
    </div>
  );
}
