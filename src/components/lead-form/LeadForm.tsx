"use client";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/utils";
import {
  investmentInterestOptions,
  investmentRangeOptions,
  leadFormSchema,
  type LeadFormSchema,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Status = "idle" | "loading" | "success" | "error";

export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [started, setStarted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormSchema>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      investmentInterest: undefined,
      investmentRange: "",
      message: "",
    },
  });

  const markStarted = () => {
    if (started) return;
    setStarted(true);
    trackEvent("form_start");
  };

  const onSubmit = async (data: LeadFormSchema) => {
    setStatus("loading");
    setErrorMessage("");
    trackEvent("form_submit", {
      interest: data.investmentInterest,
    });

    try {
      const endpoint = siteConfig.formEndpoint;

      if (!endpoint) {
        // Graceful demo success when no endpoint configured — still no secrets exposed.
        await new Promise((r) => setTimeout(r, 700));
        setStatus("success");
        trackEvent("form_success", { mode: "local_demo" });
        reset();
        return;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          source: "investors-circle-landing",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Unable to submit right now.");

      setStatus("success");
      trackEvent("form_success", { mode: "endpoint" });
      reset();
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong. Please try again or email us directly.",
      );
    }
  };

  return (
    <section id="contact" className="section-pad bg-bg-secondary">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-5">Request access</p>
          <h2 className="heading-lg">Start a conversation.</h2>
          <p className="body-lg mt-4">
            Share a few details and our team will follow up confidentially.
            There is no obligation and no fabricated promises.
          </p>
          {siteConfig.email ? (
            <p className="mt-6 text-sm text-text-muted">
              Prefer email?{" "}
              <a
                className="link-underline text-text-primary"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
            </p>
          ) : null}
        </Reveal>

        <Reveal delay={0.08}>
          <div className="surface-card p-6 md:p-8">
            {status === "success" ? (
              <div className="py-10 text-center" role="status" aria-live="polite">
                <p className="text-2xl tracking-tight text-text-primary">
                  Request received.
                </p>
                <p className="mx-auto mt-3 max-w-md text-text-secondary">
                  Thank you. We will review your details and respond if there is
                  a fit.
                </p>
                <Button
                  className="mt-8"
                  variant="secondary"
                  onClick={() => setStatus("idle")}
                >
                  Submit another request
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                onFocus={markStarted}
                className="grid gap-5"
                noValidate
              >
                <Field label="Full Name" error={errors.fullName?.message} required>
                  <input
                    {...register("fullName")}
                    autoComplete="name"
                    className={inputClass}
                    placeholder="Your full name"
                  />
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Email" error={errors.email?.message} required>
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </Field>
                  <Field label="Phone" error={errors.phone?.message} required>
                    <input
                      {...register("phone")}
                      type="tel"
                      autoComplete="tel"
                      className={inputClass}
                      placeholder="+91 ..."
                    />
                  </Field>
                </div>

                <Field label="City" error={errors.city?.message}>
                  <input
                    {...register("city")}
                    autoComplete="address-level2"
                    className={inputClass}
                    placeholder="City"
                  />
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Investment Interest"
                    error={errors.investmentInterest?.message}
                    required
                  >
                    <select
                      {...register("investmentInterest")}
                      className={inputClass}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select interest
                      </option>
                      {investmentInterestOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="Approximate Investment Range"
                    error={errors.investmentRange?.message}
                  >
                    <select {...register("investmentRange")} className={inputClass} defaultValue="">
                      <option value="">Select range</option>
                      {investmentRangeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Message" error={errors.message?.message}>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className={`${inputClass} resize-y`}
                    placeholder="Optional context about your mandate"
                  />
                </Field>

                {status === "error" ? (
                  <p className="text-sm text-danger" role="alert">
                    {errorMessage}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  showArrow
                  disabled={status === "loading"}
                  className="w-full sm:w-auto"
                >
                  {status === "loading" ? "Submitting…" : "Request Access"}
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-bg-primary px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent/50";

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-text-muted">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs text-danger">{error}</span>
      ) : null}
    </label>
  );
}
