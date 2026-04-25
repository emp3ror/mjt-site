/**
 * MDX renderer config: shared element styles + the `MdxContainer` wrapper.
 * Pass `mdxComponents` to `compileMDX` so every long-form route renders
 * with the same typography rules.
 */

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

type HeadingProps = ComponentPropsWithoutRef<"h2">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type OrderedListProps = ComponentPropsWithoutRef<"ol">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;
type PreProps = ComponentPropsWithoutRef<"pre">;
type CodeProps = ComponentPropsWithoutRef<"code">;

type MdxContainerProps = {
  children: ReactNode;
};

export const mdxComponents = {
  h1: ({ className, ...props }: HeadingProps) => (
    <h1
      className={cn("mt-16 max-w-[18ch] text-[clamp(2.25rem,5vw,3.9rem)] leading-[1.04] tracking-[-0.03em]", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: HeadingProps) => (
    <h2
      className={cn("mt-14 max-w-[24ch] text-[clamp(1.85rem,4vw,3rem)] leading-[1.07] tracking-[-0.02em]", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }: HeadingProps) => (
    <h3
      className={cn("mt-12 max-w-[28ch] text-[clamp(1.45rem,3vw,2.25rem)] leading-[1.12] tracking-[-0.015em]", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: ParagraphProps) => (
    <p
      className={cn(
        "mt-7 max-w-[70ch] text-[clamp(1.04rem,0.25vw+0.98rem,1.16rem)] leading-[1.9] text-[color:var(--foreground)]/88",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: AnchorProps) => (
    <a
      className={cn(
        "underline decoration-[color:var(--accent)]/55 decoration-1 underline-offset-4 hover:text-[color:var(--accent-strong)] hover:decoration-[color:var(--accent-strong)]",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ListProps) => (
    <ul
      className={cn(
        "mt-7 max-w-[68ch] list-disc space-y-5 pl-7 text-[clamp(1.02rem,0.2vw+0.97rem,1.12rem)] leading-[1.85] text-[color:var(--foreground)]/88",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: OrderedListProps) => (
    <ol
      className={cn(
        "mt-7 max-w-[68ch] list-decimal space-y-5 pl-7 text-[clamp(1.02rem,0.2vw+0.97rem,1.12rem)] leading-[1.85] text-[color:var(--foreground)]/88",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: ListItemProps) => (
    <li className={cn("leading-[1.85]", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: BlockquoteProps) => (
    <blockquote
      className={cn(
        "mt-10 max-w-[56ch] border-l-2 border-[color:var(--line-strong)] pl-6 text-[1.45rem] leading-[1.65] tracking-[-0.01em] text-[color:var(--ink-soft)]",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: PreProps) => (
    <pre
      className={cn(
        "mt-10 overflow-x-auto rounded-[1.2rem] border border-[color:var(--line)] bg-[#1f1d1a] p-5 text-[0.92rem] leading-7 text-[#f6f1e8]",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, children, ...props }: CodeProps) => {
    const isInline = !className || !className.includes("language-");

    return (
      <code
        className={cn(
          isInline
            ? "rounded bg-[color:var(--surface-strong)] px-1.5 py-0.5 text-[0.9em] text-[color:var(--foreground)]"
            : "text-inherit",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  hr: () => <hr className="my-14 border-0 border-t border-[color:var(--line)]" />,
};

export function MdxContainer({ children }: MdxContainerProps) {
  return <div className="mdx-content">{children}</div>;
}
