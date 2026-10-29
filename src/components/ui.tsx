import type { ReactNode } from "react";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const corner = "pointer-events-none absolute z-20 hidden h-1 w-1 rounded-[0.5px] bg-muted/60 md:block";

/** A framed band: dotted rules above and below, dotted side rails and corner marks. */
export function Block({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease }}
      className="relative w-full"
    >
      <div aria-hidden className="dot-h pointer-events-none absolute left-[-2000px] right-[-2000px] top-0 z-10" />
      <div aria-hidden className="dot-h pointer-events-none absolute bottom-0 left-[-2000px] right-[-2000px] z-10" />
      <div aria-hidden className="dot-v pointer-events-none absolute -bottom-3 -top-3 left-0 z-10 hidden md:block" />
      <div aria-hidden className="dot-v pointer-events-none absolute -bottom-3 -top-3 right-0 z-10 hidden md:block" />
      <i aria-hidden className={`${corner} -left-[1.5px] -top-[1.5px]`} />
      <i aria-hidden className={`${corner} -right-[1.5px] -top-[1.5px]`} />
      <i aria-hidden className={`${corner} -bottom-[1.5px] -left-[1.5px]`} />
      <i aria-hidden className={`${corner} -bottom-[1.5px] -right-[1.5px]`} />
      <div className={`p-5 sm:p-6 ${className}`}>{children}</div>
    </motion.section>
  );
}

export function Heading({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-dashed border-line pb-2.5">
      <h2 className="text-lg font-bold tracking-tight sm:text-xl">{children}</h2>
      {aside && <span className="font-mono text-[11px] text-muted">{aside}</span>}
    </div>
  );
}

/** Nested double-border tile, as used for avatars and icon chips. */
export function Tile({
  children,
  size = "h-9 w-9",
  outer = "rounded-[14px]",
  inner = "rounded-[10px]",
  className = "",
}: {
  children: ReactNode;
  size?: string;
  outer?: string;
  inner?: string;
  className?: string;
}) {
  return (
    <span className={`flex shrink-0 items-center justify-center border border-tileb bg-tile p-[2px] ${outer} ${size} ${className}`}>
      <span className={`flex h-full w-full items-center justify-center border border-tile2b bg-tile2 ${inner}`}>
        {children}
      </span>
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-line bg-tile px-2 py-0.5 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}

export function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex h-2 w-2 ${className}`} aria-hidden>
      <span className="ping-soft absolute inset-0 rounded-full bg-emerald-400" />
      <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
    </span>
  );
}
