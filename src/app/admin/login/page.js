'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, ArrowUp, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { site } from '@/lib/site';
import { cn } from '@/lib/cn';
import { ThemeToggle } from '@/components/ui/theme-toggle';

function safeNext() {
  const next = new URLSearchParams(window.location.search).get('next');
  // Only allow internal admin paths to prevent open redirects.
  return next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin';
}

// Filled control with a hairline border, no shadow. Solid 2px outline on focus (WCAG 2.4.7).
const flatInput =
  'h-11 w-full rounded-md border border-border bg-subtle px-3 text-sm text-foreground transition-colors ' +
  'placeholder:text-muted/70 hover:bg-subtle/70 ' +
  'focus-visible:bg-background focus-visible:border-border focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'aria-[invalid=true]:border-danger aria-[invalid=true]:bg-background';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [invalid, setInvalid] = useState(false);

  function detectCaps(event) {
    if (typeof event.getModifierState === 'function') setCapsLock(event.getModifierState('CapsLock'));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setInvalid(false);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        if (res.status === 401 || res.status === 400) setInvalid(true);
        throw new Error(data.message || 'Sign in failed. Please try again.');
      }
      // Full navigation so the new cookie is sent with the next server request.
      window.location.assign(safeNext());
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Network error. Check your connection.' : err.message);
      setLoading(false);
    }
  }

  function clearInvalid() {
    if (invalid) setInvalid(false);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to site
        </Link>
        <ThemeToggle className="size-9" />
      </header>

      {/* Extra bottom padding lifts the card slightly above true centre, which reads as balanced. */}
      <main className="flex flex-1 items-center justify-center px-4 pb-16 sm:pb-36">
        <div className="w-full max-w-[400px] rounded-lg border border-border bg-background px-5 py-8 shadow-sm sm:px-8">
          <div className="mb-8 text-center">
            <span
              className="mx-auto grid size-10 place-items-center rounded-md bg-foreground font-mono text-sm font-semibold text-background"
              aria-hidden="true"
            >
              {site.name.charAt(0)}
            </span>
            <h1 className="mt-6 text-xl font-semibold tracking-tight">Sign in to admin</h1>
            <p className="mt-1 text-sm text-muted">Manage your portfolio content</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5" aria-busy={loading}>
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 border-l-2 border-danger py-1 pl-3 text-sm text-danger"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                autoFocus
                disabled={loading}
                aria-invalid={invalid}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearInvalid();
                }}
                className={flatInput}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  aria-invalid={invalid}
                  aria-describedby={capsLock ? 'caps-hint' : undefined}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearInvalid();
                  }}
                  onKeyDown={detectCaps}
                  onKeyUp={detectCaps}
                  onBlur={() => setCapsLock(false)}
                  className={cn(flatInput, 'pr-11')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-md text-muted transition-colors hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {capsLock && (
                <p id="caps-hint" className="flex items-center gap-1 text-xs text-muted">
                  <ArrowUp className="size-3" aria-hidden="true" />
                  Caps Lock is on
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-foreground text-sm font-medium text-background transition-colors hover:bg-foreground/85 disabled:pointer-events-none disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>

      <footer className="flex items-center justify-center gap-1.5 pb-6 text-xs text-muted">
        <ShieldCheck className="size-3.5" aria-hidden="true" />
        <span>
          Protected area · © {new Date().getFullYear()} {site.name}
        </span>
      </footer>
    </div>
  );
}
