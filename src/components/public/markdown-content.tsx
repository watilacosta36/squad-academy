"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-tactical prose prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:mt-10 prose-h2:border-b prose-h2:border-graphite-700 prose-h2:pb-2 prose-h3:mt-8 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-2 prose-blockquote:not-italic prose-pre:border prose-pre:border-graphite-700 prose-li:my-1">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
          a: ({ href, children }) => {
            const isExternal = Boolean(href && /^https?:\/\//.test(href));

            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
