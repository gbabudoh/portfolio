import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/cn';

// Renders admin-authored Markdown with the site's type styles. Raw HTML in the
// source is ignored by react-markdown, and images are not allowed, so content
// can't inject markup or pull in third-party assets.
const components = {
  h1: (props) => <h3 className="mt-8 text-base font-semibold text-foreground first:mt-0 sm:text-lg" {...props} />,
  h2: (props) => <h3 className="mt-8 text-base font-semibold text-foreground first:mt-0 sm:text-lg" {...props} />,
  h3: (props) => <h3 className="mt-8 text-base font-semibold text-foreground first:mt-0 sm:text-lg" {...props} />,
  h4: (props) => <h4 className="mt-6 font-semibold text-foreground first:mt-0" {...props} />,
  p: (props) => <p className="mt-3 text-pretty leading-relaxed text-muted first:mt-0 sm:text-lg" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  ul: (props) => <ul className="mt-3 list-disc space-y-2 pl-5 text-muted marker:text-foreground sm:text-lg" {...props} />,
  ol: (props) => <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted sm:text-lg" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: ({ href, ...props }) => (
    <a href={href} className="link" target={/^https?:/i.test(href || '') ? '_blank' : undefined} rel="noopener noreferrer" {...props} />
  ),
  code: (props) => <code className="rounded bg-subtle px-1.5 py-0.5 font-mono text-[0.9em] text-foreground" {...props} />,
  pre: (props) => <pre className="mt-3 overflow-x-auto rounded-md bg-subtle p-4 text-sm [&_code]:bg-transparent [&_code]:p-0" {...props} />,
  blockquote: (props) => <blockquote className="mt-3 border-l-2 border-border pl-4 italic text-muted" {...props} />,
  hr: () => <hr className="my-8 border-border" />,
};

export function Markdown({ children, className }) {
  return (
    <div className={cn('min-w-0', className)}>
      <ReactMarkdown components={components} disallowedElements={['img']} unwrapDisallowed>
        {children || ''}
      </ReactMarkdown>
    </div>
  );
}
