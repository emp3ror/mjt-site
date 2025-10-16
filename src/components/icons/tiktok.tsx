import type { LucideProps } from "lucide-react";

export function TikTokIcon({ color = "currentColor", ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? 24}
      height={props.height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="none"
      {...props}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M14 3h2.34a5.35 5.35 0 0 0 3.66 2.96v3.38a8.52 8.52 0 0 1-3.66-1.1v6.14A6.38 6.38 0 1 1 9 8.08h.02v3.44a2.44 2.44 0 1 0 2.44 2.44V3H14Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
