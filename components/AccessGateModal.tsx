"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/projects";

type Role = "employer" | "recruiter" | "vc";
type Step = "role" | "contact" | "sign" | "success";

interface AccessGateModalProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}

interface UnlockedProject {
  id: string;
  title: string;
  url: string | null;
}

const ROLES: { key: Role; label: string; blurb: string }[] = [
  {
    key: "employer",
    label: "Employer",
    blurb: "Hiring manager or executive evaluating for a role or engagement.",
  },
  {
    key: "recruiter",
    label: "Recruiter",
    blurb: "Agency or in-house recruiter sourcing on behalf of a client.",
  },
  {
    key: "vc",
    label: "Investor / VC",
    blurb: "Venture capital, angel, or strategic investor conducting diligence.",
  },
];

export default function AccessGateModal({ open, project, onClose }: AccessGateModalProps) {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [typedSignature, setTypedSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<UnlockedProject[]>([]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setStep("role");
        setRole(null);
        setName("");
        setEmail("");
        setPhone("");
        setCompany("");
        setTypedSignature("");
        setAgreed(false);
        setError(null);
        setUnlocked([]);
        setSubmitting(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const companyLabel = useMemo(() => {
    if (role === "vc") return "VC Firm";
    if (role === "recruiter") return "Recruiting Firm";
    if (role === "employer") return "Company / Employer";
    return "Company";
  }, [role]);

  const contactValid =
    name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    phone.replace(/\D/g, "").length >= 7 &&
    company.trim().length > 0;

  const signatureMatches =
    typedSignature.trim().toLowerCase() === name.trim().toLowerCase() &&
    typedSignature.trim().length > 0;

  async function handleSubmit() {
    if (!role || !project) return;
    if (!contactValid || !agreed || !signatureMatches) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          typedSignature: typedSignature.trim(),
          agreed,
          projectIds: [project.id],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setSubmitting(false);
        return;
      }
      setUnlocked(data.unlockedProjects ?? []);
      setStep("success");
      setSubmitting(false);
    } catch {
      setError("Network error. Try again.");
      setSubmitting(false);
    }
  }

  if (!project) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-[#0A66C2]">
                  Restricted Access · NCNDA Required
                </div>
                <h2 className="text-xl font-bold text-[#191919] mt-1">
                  {project.title}
                </h2>
                <p className="text-sm text-[#666] mt-0.5">{project.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-[#666] hover:text-[#191919] text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Stepper */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center gap-2 text-xs text-[#666]">
                <StepDot label="Role" active={step === "role"} done={step !== "role"} />
                <StepLine />
                <StepDot
                  label="Contact"
                  active={step === "contact"}
                  done={step === "sign" || step === "success"}
                />
                <StepLine />
                <StepDot
                  label="Sign NCNDA"
                  active={step === "sign"}
                  done={step === "success"}
                />
                <StepLine />
                <StepDot label="Access" active={step === "success"} done={false} />
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              {step === "role" && (
                <div className="space-y-3">
                  <p className="text-sm text-[#444]">
                    This project contains proprietary architecture, prompts, and
                    IP owned by DTSP Agentic Technologies LLC. Before viewing,
                    identify your role and execute a short NCNDA.
                  </p>
                  <div className="space-y-2 pt-1">
                    {ROLES.map((r) => (
                      <button
                        key={r.key}
                        onClick={() => {
                          setRole(r.key);
                          setStep("contact");
                        }}
                        className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-[#0A66C2] hover:bg-[#F4F8FD] transition-colors cursor-pointer"
                      >
                        <div className="font-semibold text-[#191919]">{r.label}</div>
                        <div className="text-xs text-[#666] mt-0.5">{r.blurb}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "contact" && (
                <div className="space-y-4">
                  <Field label="Full Legal Name" required>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#0A66C2] focus:outline-none focus:ring-1 focus:ring-[#0A66C2] text-sm"
                    />
                  </Field>
                  <Field label="Work Email" required>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@acme.com"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#0A66C2] focus:outline-none focus:ring-1 focus:ring-[#0A66C2] text-sm"
                    />
                  </Field>
                  <Field label="Phone" required>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(212) 555-0091"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#0A66C2] focus:outline-none focus:ring-1 focus:ring-[#0A66C2] text-sm"
                    />
                  </Field>
                  <Field label={companyLabel} required>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={
                        role === "vc"
                          ? "Acme Capital Partners"
                          : role === "recruiter"
                            ? "Acme Search Group"
                            : "Acme, Inc."
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#0A66C2] focus:outline-none focus:ring-1 focus:ring-[#0A66C2] text-sm"
                    />
                  </Field>
                </div>
              )}

              {step === "sign" && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 bg-[#FAFAFA] p-4 max-h-64 overflow-y-auto text-xs text-[#333] leading-relaxed">
                    <div className="font-bold text-[#191919] mb-2">
                      Non-Disclosure &amp; Confidentiality Agreement (summary)
                    </div>
                    <p className="mb-2">
                      By signing, <strong>{name || "Recipient"}</strong> on behalf
                      of <strong>{company || "—"}</strong> agrees to hold all
                      Confidential Information of DTSP Agentic Technologies LLC in
                      strict confidence, use it solely to evaluate a potential
                      engagement, and refrain from disclosing, copying, reverse
                      engineering, or feeding it into any third-party AI, ML, or
                      training system without prior written consent.
                    </p>
                    <p className="mb-2">
                      Confidential Information includes source code,
                      multi-agent architectures, LangGraph definitions, agent
                      contracts, system prompts, datasets, knowledge graphs,
                      product designs, financials, and all derivatives.
                      Obligations survive for five (5) years, and in perpetuity
                      for trade secrets. Governed by Florida law, venue in
                      Miami-Dade County, jury trial waived.
                    </p>
                    <p className="mb-0 text-[#666]">
                      Full agreement is captured and stored with your
                      signature. Typing your name below constitutes an
                      electronic signature under 15 U.S.C. § 7001 (E-SIGN) and
                      Florida law.
                    </p>
                  </div>

                  <label className="flex items-start gap-2 text-sm text-[#333] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      I have read and agree to the NCNDA on behalf of myself and
                      the entity above, and I have authority to bind it.
                    </span>
                  </label>

                  <Field label="Type your full name to sign" required>
                    <input
                      type="text"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      placeholder={name || "Full legal name"}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#0A66C2] focus:outline-none focus:ring-1 focus:ring-[#0A66C2] text-sm font-serif italic"
                    />
                  </Field>
                  {typedSignature && !signatureMatches && (
                    <p className="text-xs text-red-600">
                      Signature must exactly match the name entered in the
                      previous step.
                    </p>
                  )}
                </div>
              )}

              {step === "success" && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="font-semibold text-green-900">
                      NCNDA executed. Access unlocked.
                    </div>
                    <p className="text-xs text-green-800 mt-1">
                      A signed copy has been recorded. You now have access to
                      the live application.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {unlocked.map((u) => (
                      <a
                        key={u.id}
                        href={u.url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-gray-200 hover:border-[#0A66C2] hover:bg-[#F4F8FD] p-4 transition-colors"
                      >
                        <div className="font-semibold text-[#191919]">
                          {u.title}
                        </div>
                        <div className="text-xs text-[#0A66C2] mt-0.5 break-all">
                          {u.url} &rarr;
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="mt-3 text-xs text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
              <div className="text-[10px] text-[#999]">
                DTSP Agentic Technologies LLC · Confidential
              </div>
              <div className="flex items-center gap-2">
                {step === "contact" && (
                  <>
                    <button
                      onClick={() => setStep("role")}
                      className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-[#444] hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep("sign")}
                      disabled={!contactValid}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue to NCNDA
                    </button>
                  </>
                )}
                {step === "sign" && (
                  <>
                    <button
                      onClick={() => setStep("contact")}
                      disabled={submitting}
                      className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-[#444] hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!agreed || !signatureMatches || submitting}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Signing…" : "Sign & Unlock"}
                    </button>
                  </>
                )}
                {step === "success" && (
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182]"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StepDot({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`h-2 w-2 rounded-full ${
          done ? "bg-[#0A66C2]" : active ? "bg-[#0A66C2]" : "bg-gray-300"
        }`}
      />
      <span className={active ? "text-[#191919] font-medium" : ""}>{label}</span>
    </div>
  );
}

function StepLine() {
  return <div className="h-px w-6 bg-gray-200" />;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-[#444] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      {children}
    </label>
  );
}
