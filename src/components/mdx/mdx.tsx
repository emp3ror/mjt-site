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
      className={cn(
        "mt-12 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: HeadingProps) => (
    <h2
      className={cn(
        "mt-12 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: HeadingProps) => (
    <h3
      className={cn(
        "mt-10 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: ParagraphProps) => (
    <p
      className={cn(
        "mt-6 text-base leading-relaxed text-neutral-700 dark:text-neutral-300",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: AnchorProps) => (
    <a
      className={cn(
        "font-medium text-blue-600 underline decoration-blue-400/70 decoration-2 underline-offset-4 hover:text-blue-500 dark:text-blue-400",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ListProps) => (
    <ul
      className={cn(
        "mt-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-neutral-700 dark:text-neutral-300",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: OrderedListProps) => (
    <ol
      className={cn(
        "mt-6 list-decimal space-y-2 pl-6 text-base leading-relaxed text-neutral-700 dark:text-neutral-300",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: ListItemProps) => (
    <li className={cn("leading-relaxed", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: BlockquoteProps) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 border-neutral-200 pl-4 italic text-neutral-600 dark:border-neutral-700 dark:text-neutral-300",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: PreProps) => (
    <pre
      className={cn(
        "mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-950/95 p-4 text-sm text-neutral-100 shadow-inner dark:border-neutral-800",
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
            ? "rounded-md bg-neutral-100 px-1.5 py-0.5 text-sm text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
            : "text-neutral-100",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  hr: () => <hr className="my-12 border-neutral-200 dark:border-neutral-800" />,
};

export function MdxContainer({ children }: MdxContainerProps) {
  return <div className="mdx-content">{children}</div>;
}
