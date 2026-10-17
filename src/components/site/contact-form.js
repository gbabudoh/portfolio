'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Clock, Loader2, RotateCcw, Send } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/field';

const EMPTY = { name: '', email: '', subject: '', message: '', company: '' };

export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');
  const [sentName, setSentName] = useState('');
  const [lockedHeight, setLockedHeight] = useState(null);
  const formRef = useRef(null);
  const successRef = useRef(null);

  // Move focus + viewport to the confirmation so mobile users actually see it.
  useEffect(() => {
    if (status !== 'success' || !successRef.current) return;
    const node = successRef.current;
    node.focus({ preventScroll: true });
    const rect = node.getBoundingClientRect();
    if (rect.top < 80 || rect.top > window.innerHeight * 0.6) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [status]);

  const update = (event) => setValues((v) => ({ ...v, [event.target.name]: event.target.value }));

  async function onSubmit(event) {
    event.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Something went wrong.');
      // Lock height to the form's so content below doesn't jump when the card swaps in.
      setLockedHeight(formRef.current?.offsetHeight ?? null);
      setSentName(values.name.trim().split(/\s+/)[0] || '');
      setValues(EMPTY);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        style={lockedHeight ? { minHeight: lockedHeight } : undefined}
        className="success-card flex scroll-mt-24 flex-col justify-center rounded-xl border border-border bg-surface px-5 py-8 outline-none sm:px-8 sm:py-10"
      >
        <div className="flex flex-col items-start gap-6">
          <span className="success-badge grid size-14 place-items-center rounded-full bg-success/10 text-success ring-8 ring-success/5">
            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path className="success-check" d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl">
              {sentName ? `Thanks, ${sentName} — message sent.` : 'Message sent.'}
            </h2>
            <p className="text-pretty text-base text-muted">
              I read every message personally and will reply with thoughts on approach, timeline and next steps.
            </p>
          </div>

          <p className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-sm font-medium text-foreground ring-1 ring-border">
            <Clock className="size-4 text-success" aria-hidden="true" />
            Typical reply within 24–48 hours
          </p>

          <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center">
            <ButtonLink href="/work" size="lg" className="w-full sm:w-auto">
              Explore my work
              <ArrowRight />
            </ButtonLink>
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                setLockedHeight(null);
                setStatus('idle');
              }}
            >
              <RotateCcw />
              Send another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const submitting = status === 'submitting';

const INTENT_PRESETS = [
  'New SaaS / Web Product',
  'Mobile App Development',
  'System Architecture & Audit',
  'Consulting / Advisory',
];

  return (
    <form ref={formRef} onSubmit={onSubmit} className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" required>
          <Input id="name" name="name" autoComplete="name" required maxLength={120} value={values.name} onChange={update} />
        </Field>
        <Field label="Email" htmlFor="email" required>
          <Input id="email" name="email" type="email" autoComplete="email" required maxLength={200} value={values.email} onChange={update} />
        </Field>
      </div>

      <div className="space-y-2">
        <Field label="Subject" htmlFor="subject" required>
          <Input id="subject" name="subject" required maxLength={200} value={values.subject} onChange={update} placeholder="e.g. New SaaS platform or architecture review" />
        </Field>
        {/* One-tap intent chips for fast mobile input */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-muted">
            Quick intent:
          </span>
          {INTENT_PRESETS.map((intent) => {
            const isSelected = values.subject === intent;
            return (
              <button
                key={intent}
                type="button"
                onClick={() => setValues((v) => ({ ...v, subject: intent }))}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-accent text-accent-foreground shadow-2xs font-semibold'
                    : 'border border-border/80 bg-surface/70 text-muted hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                {intent}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Message" htmlFor="message" required hint="A few lines on goals, timeline, and scope helps a lot.">
        <Textarea id="message" name="message" required rows={4} maxLength={5000} value={values.message} onChange={update} placeholder="Tell me about what you're looking to build..." />
      </Field>

      {/* Honeypot: hidden from people, often filled in by bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={update} />
      </div>

      {status === 'error' && (
        <p role="alert" className="flex items-center gap-2 rounded-md bg-danger/10 px-3 py-2.5 text-sm text-danger">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? <Loader2 className="animate-spin" /> : <Send />}
          {submitting ? 'Sending…' : 'Send message'}
        </Button>

        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <span>Replies personally within 24 hours</span>
        </div>
      </div>
    </form>
  );
}
