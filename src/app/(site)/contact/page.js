import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react';
import { site } from '@/lib/site';
import { getVisibleSocialLinks } from '@/lib/settings';
import { Icon } from '@/components/ui/icon';
import { ButtonLink } from '@/components/ui/button';
import { PageHeader, Section } from '@/components/site/blocks';
import { ContactForm } from '@/components/site/contact-form';

export const metadata = {
  title: 'Contact',
  description: 'Start a conversation about your next web, mobile or AI-powered product.',
  alternates: { canonical: '/contact' },
};

const channels = [
  { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { icon: Phone, label: 'Phone', value: site.phone.display, href: site.phone.href },
  { icon: MapPin, label: 'Location', value: site.location },
];

export default function ContactPage() {
  const socials = getVisibleSocialLinks();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's build something great."
        description="Share a little about your project and I'll reply with thoughts on approach, timeline and next steps."
      >
        {/* One-tap shortcuts for mobile users who'd rather not fill in a form */}
        <div className="flex flex-wrap items-center gap-2 pt-1 lg:hidden">
          <ButtonLink href={`mailto:${site.email}`} external={false} variant="secondary" size="md" className="flex-1">
            <Mail className="size-4" />
            Email me
          </ButtonLink>
          <ButtonLink href={site.phone.href} external={false} variant="secondary" size="md" className="flex-1">
            <Phone className="size-4" />
            Call
          </ButtonLink>
        </div>
      </PageHeader>

      <Section className="pt-8 sm:pt-14 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div className="max-w-2xl">
            <ContactForm />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-surface/90 p-5 shadow-xs backdrop-blur-xs sm:p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Direct Channels</h2>
                  <p className="text-xs text-muted">Immediate response channels</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-success">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-success" />
                  </span>
                  Available
                </span>
              </div>

              {/* Channels list */}
              <ul className="space-y-2">
                {channels.map(({ icon: ChannelIcon, label, value, href }) => {
                  const content = (
                    <>
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border/80 bg-background text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent-text">
                        <ChannelIcon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">{label}</span>
                        <span className="block truncate text-sm font-medium text-foreground">{value}</span>
                      </span>
                      {href && (
                        <ChevronRight
                          className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  );
                  const row = 'flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-2.5';
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          className={`group ${row} transition-all hover:border-accent/30 hover:bg-surface`}
                          aria-label={`${label}: ${value}`}
                        >
                          {content}
                        </a>
                      ) : (
                        <div className={row}>{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Social links */}
              {socials.length > 0 && (
                <div className="border-t border-border/70 pt-5 space-y-3">
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Elsewhere on the web
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {socials.map((social) => (
                      <li key={social.url}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${social.label} (opens in a new tab)`}
                          className="grid size-10 place-items-center rounded-lg border border-border bg-background text-muted transition-all hover:border-foreground/30 hover:bg-surface hover:text-foreground active:bg-subtle"
                        >
                          <Icon name={social.platform} className="size-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
