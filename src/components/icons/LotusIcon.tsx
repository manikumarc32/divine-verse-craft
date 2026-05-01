import { SVGProps } from "react";

export function LotusIcon({ className = "h-6 w-6", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M32 50 C18 46 12 36 12 32 C 18 30 24 32 32 36 C 40 32 46 30 52 32 C 52 36 46 46 32 50Z" />
        <path d="M32 48 C26 36 26 24 32 14 C 38 24 38 36 32 48Z" />
        <path d="M32 46 C22 38 16 28 18 18 C 26 22 30 30 32 40" />
        <path d="M32 46 C42 38 48 28 46 18 C 38 22 34 30 32 40" />
        <circle cx="32" cy="50" r="1.4" fill="currentColor" />
      </g>
    </svg>
  );
}

export function OmIcon({ className = "h-6 w-6", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <span className={className} {...(props as never)} aria-label="Om">ॐ</span>
  );
}
