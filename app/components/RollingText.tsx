import type { CSSProperties } from "react";

export function RollingText({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`text-swap ${className}`} aria-label={children}>
      {Array.from(children).map((character, index) => (
        <span
          className="text-swap-character"
          aria-hidden="true"
          key={`${character}-${index}`}
          style={{ "--roll-index": index } as CSSProperties}
        >
          <span className="text-swap-line">{character === " " ? "\u00a0" : character}</span>
          <span className="text-swap-line">{character === " " ? "\u00a0" : character}</span>
        </span>
      ))}
    </span>
  );
}
