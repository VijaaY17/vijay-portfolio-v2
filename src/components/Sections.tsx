import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUp, ArrowUpRight, Cable, Check, ChevronDown, Copy, Database, GitBranch, Mail, MousePointer2, UserRound, Webhook } from "lucide-react";
import { company, posts, profile, projects, roles, stack, type StackCategory, type StackItem } from "../content";
import { useCycle } from "../hooks";
import { Block, Heading, LiveDot, Tag, Tile } from "./ui";
import ViewCount from "./ViewCount";
import { mailtoHref, openEmail } from "../mail";

const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------ Experience ------------------------------ */

function Role({ role, current, defaultOpen }: { role: (typeof roles)[number]; current: boolean; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panel = `role-${role.id}`;
  return (
    <li className="rounded-xl border border-dotted border-dot">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panel}
        className="flex w-full items-start justify-between gap-4 p-4 text-left"
      >
        <span className="min-w-0">
          <span className="block font-mono text-[11px] text-muted">
            {current && <LiveDot className="mr-2 align-middle" />}
            {role.period}
          </span>
          <span className="mt-1 block text-[15px] font-bold leading-snug tracking-tight">{role.title}</span>
          <span className="mt-2.5 flex flex-wrap gap-1.5">
            {role.stack.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </span>
        </span>
        <span className="mt-0.5 flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted">
          <span className="hidden sm:inline">{open ? "Hide" : "Details"}</span>
          <ChevronDown size={16} aria-hidden className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <div className="border-t border-dotted border-dot p-4">
              <ul className="space-y-3.5">
                {role.bullets.map((b, i) => (
                  <motion.li
                    key={b.lead}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 + i * 0.06, ease }}
                    className="flex gap-3 text-sm leading-relaxed text-muted"
                  >
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-fg/60" />
                    <span>
                      <span className="font-medium text-fg">{b.lead}. </span>
                      {b.text}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Experience() {
  return (
    <Block id="experience">
      <Heading aside={company.period}>Experience</Heading>
      <div className="mb-4 flex items-center gap-3">
        <Tile>
          <span className="font-display text-lg">R</span>
        </Tile>
        <div>
          <p className="text-sm font-bold tracking-tight">{company.name}</p>
          <p className="font-mono text-[11px] text-muted">{company.location}</p>
        </div>
      </div>
      <ul className="space-y-3">
        {roles.map((r, i) => (
          <Role key={r.id} role={r} current={i === 0} defaultOpen={i === 0} />
        ))}
      </ul>
    </Block>
  );
}

/* ------------------------------- Projects ------------------------------- */

const floatY = (d: number, amp = 5) => ({
  animate: { y: [0, -amp, 0] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay: d },
});

function ProfileCard({ rotate, d, className }: { rotate: number; d: number; className: string }) {
  return (
    <motion.div
      {...floatY(d)}
      style={{ rotate }}
      className={`absolute w-24 rounded-2xl border border-tile2b bg-bg/85 p-2.5 shadow-lg shadow-black/10 backdrop-blur sm:w-28 ${className}`}
    >
      <div className="grid h-16 place-items-center rounded-xl bg-tile2 sm:h-20">
        <span className="size-7 rounded-full bg-fg/80 sm:size-9" />
      </div>
      <div className="mt-2.5 h-1.5 w-3/4 rounded-full bg-fg/70" />
      <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-muted/50" />
      <div className="mt-3 flex justify-between">
        <span className="grid size-5 place-items-center rounded-full border border-tile2b text-[9px] text-muted">✕</span>
        <span className="grid size-5 place-items-center rounded-full bg-fg text-[9px] text-bg">✓</span>
      </div>
    </motion.div>
  );
}

const requestStates = ["Send", "Accept", "Connected"];

function DevTinderArt() {
  const [i] = useCycle(requestStates.length, 1800);
  return (
    <div
      className="relative h-44 overflow-hidden rounded-lg border border-dotted border-dot sm:h-48"
      style={{
        background:
          "radial-gradient(60% 80% at 15% 0%, rgba(244,63,94,0.30), transparent 70%), radial-gradient(55% 70% at 90% 100%, rgba(251,146,60,0.26), transparent 70%), var(--card)",
      }}
    >
      <div aria-hidden className="dot-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_85%)]" />
      <ProfileCard rotate={-7} d={0} className="left-[14%] top-5 sm:left-[18%]" />
      <ProfileCard rotate={6} d={1.4} className="right-[14%] top-9 sm:right-[18%]" />
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-7 min-w-24 items-center justify-center overflow-hidden rounded-full border border-tile2b bg-bg px-3 font-mono text-[10px] shadow-md">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={requestStates[i]}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1.5"
            >
              {i === 2 && <LiveDot />}
              {requestStates[i]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-2.5 hidden justify-center gap-2 sm:flex">
        <motion.span
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.15, 0.8, 1] }}
          className="rounded-full rounded-bl-sm border border-tile2b bg-bg/90 px-2.5 py-1 font-mono text-[9px] text-muted"
        >
          hey 👋
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.45, 0.85, 1] }}
          className="rounded-full rounded-br-sm bg-fg px-2.5 py-1 font-mono text-[9px] text-bg"
        >
          real-time chat
        </motion.span>
      </div>
    </div>
  );
}

const ZIGZAG = `polygon(0 0, 100% 0, ${Array.from({ length: 21 }, (_, k) => `${100 - k * 5}% ${k % 2 ? "calc(100% - 6px)" : "100%"}`).join(", ")})`;

function BillBuddyArt() {
  const rows = [0.62, 0.48, 0.7, 0.4];
  return (
    <div
      className="relative h-44 overflow-hidden rounded-lg border border-dotted border-dot sm:h-48"
      style={{
        background:
          "radial-gradient(60% 80% at 85% 0%, rgba(16,185,129,0.28), transparent 70%), radial-gradient(55% 70% at 10% 100%, rgba(56,189,248,0.22), transparent 70%), var(--card)",
      }}
    >
      <div aria-hidden className="dot-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_85%)]" />

      {/* queue of orders shrinking into the counter */}
      <div className="absolute left-5 top-1/2 hidden -translate-y-1/2 sm:block">
        <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-muted">Queue</p>
        <div className="flex flex-col gap-1.5">
          {[0, 1, 2, 3].map((k) => (
            <motion.span
              key={k}
              className="block h-1.5 rounded-full bg-fg/70"
              style={{ width: 52 - k * 9 }}
              animate={{ opacity: [0.2, 0.9, 0.2], x: [0, 4, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: k * 0.4, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>

      {/* receipt */}
      <motion.div
        {...floatY(0, 4)}
        className="absolute left-1/2 top-4 w-36 -translate-x-1/2 sm:left-[58%] sm:w-40"
      >
        <div
          className="rounded-t-lg border border-b-0 border-tile2b bg-bg/90 px-3 pb-6 pt-3 backdrop-blur"
          style={{ clipPath: ZIGZAG }}
        >
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Bill</p>
          <ul className="mt-2.5 space-y-2">
            {rows.map((w, k) => (
              <li key={k} className="flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [0.15, 1, 1, 0.15] }}
                  transition={{ duration: 5, repeat: Infinity, delay: k * 0.5, times: [0, 0.15, 0.85, 1] }}
                  className="size-2.5 rounded-[3px] bg-fg"
                />
                <span className="h-1.5 rounded-full bg-muted/50" style={{ width: `${w * 100}%` }} />
                <span className="ml-auto h-1.5 w-4 rounded-full bg-fg/60" />
              </li>
            ))}
          </ul>
          <div className="my-3 border-t border-dashed border-line" />
          <div className="flex items-center justify-between">
            <span className="h-1.5 w-8 rounded-full bg-muted/60" />
            <span className="h-2 w-10 rounded-full bg-fg" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Projects() {
  const arts = [<DevTinderArt key="d" />, <BillBuddyArt key="b" />];
  return (
    <Block id="projects">
      <Heading aside={`${projects.length} built end to end`}>Projects</Heading>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p, i) => (
          <motion.article
            key={p.name}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25, ease }}
            className="group flex flex-col rounded-xl border border-dotted border-dot bg-tile/30 p-3 transition-colors hover:bg-tile/60"
          >
            {arts[i]}
            <div className="flex flex-1 flex-col px-1 pb-1 pt-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-tight">{p.name}</h3>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.name} on GitHub`}
                  className="grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-tile2 hover:text-fg"
                >
                  <ArrowUpRight size={15} />
                </a>
              </div>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">{p.text}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Block>
  );
}

/* --------------------------------- Stack -------------------------------- */

const ICON_CDN = "https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/";
const groups: StackCategory[] = ["Backend", "Mobile & Frontend", "Databases", "Tools"];
const fallbackIcon = { api: Webhook, socket: Cable, sql: Database, cursor: MousePointer2 };

function Logo({ item, size = 16 }: { item: StackItem; size?: number }) {
  if (item.slug) {
    const url = `url(${ICON_CDN}${item.slug}.svg)`;
    return (
      <span
        aria-hidden
        className="shrink-0 bg-current transition-transform duration-300 group-hover:scale-110"
        style={{ width: size, height: size, WebkitMask: `${url} center / contain no-repeat`, mask: `${url} center / contain no-repeat` }}
      />
    );
  }
  const Icon = fallbackIcon[item.fallback ?? "api"];
  return <Icon size={size} aria-hidden className="shrink-0 transition-transform duration-300 group-hover:scale-110" />;
}

function chipMove(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

const filters: ("All" | StackCategory)[] = ["All", ...groups];

export function Stack() {
  const [cat, setCat] = useState<(typeof filters)[number]>("All");
  const [hovered, setHovered] = useState<StackItem | null>(null);
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const inView = useInView(listRef, { margin: "-80px" });
  const [auto, setAuto] = useState(0);
  const matches = (s: StackItem) => cat === "All" || s.category === cat;
  const pool = stack.filter(matches);
  const count = pool.length;

  // one gentle ambient animation: a highlight walks across the logos on its own, and pauses on hover
  useEffect(() => {
    if (reduce || hovered || !inView) return;
    const id = window.setInterval(() => setAuto((i) => i + 1), 1700);
    return () => window.clearInterval(id);
  }, [reduce, hovered, inView]);
  const lit = hovered ?? (reduce || !inView ? null : pool[auto % pool.length]);

  const caption = lit
    ? `${lit.name} · ${lit.category}`
    : cat === "All"
      ? `${stack.length} tools. Hover a logo for its name.`
      : `${count} in ${cat}`;

  return (
    <Block id="stack">
      <Heading aside={`${stack.length} tools`}>Tech stack</Heading>

      {/* category filter */}
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
        {filters.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`relative rounded-md px-3 py-1.5 font-mono text-[11px] transition-colors ${
              cat === c ? "text-bg" : "text-muted hover:text-fg"
            }`}
          >
            {cat === c && (
              <motion.span
                layoutId="stack-filter"
                className="absolute inset-0 rounded-md bg-fg"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>

      {/* logo dock */}
      <motion.ul
        ref={listRef}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        transition={{ staggerChildren: 0.02 }}
        className="mt-5 flex flex-wrap gap-2"
        onPointerLeave={() => setHovered(null)}
      >
        {stack.map((s) => {
          const on = matches(s);
          return (
            <motion.li
              key={s.name}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.35, ease }}
              whileHover={on ? { y: -3 } : undefined}
              onPointerMove={chipMove}
              onPointerEnter={() => setHovered(s)}
              onFocus={() => setHovered(s)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              aria-label={`${s.name}, ${s.category}`}
              data-name={s.name}
              style={{ "--c": s.color ?? "var(--fg)" } as CSSProperties}
              className={`chip dock group relative rounded-[14px] outline-none focus-visible:ring-2 focus-visible:ring-fg ${lit?.name === s.name ? "is-lit" : ""}`}
            >
              <span className={`block transition-[opacity,filter,transform] duration-300 ${on ? "" : "scale-90 opacity-40 grayscale"}`}>
                <Tile size="size-11" outer="rounded-[14px]" inner="rounded-[10px]" className="chip-logo text-fg/70">
                  <Logo item={s} size={20} />
                </Tile>
              </span>
            </motion.li>
          );
        })}
      </motion.ul>

      <p className="mt-4 h-4 font-mono text-[11px] text-muted">
        {caption}
      </p>
    </Block>
  );
}

/* --------------------------------- Notes -------------------------------- */

export function Notes() {
  return (
    <Block id="notes">
      <Heading aside={`${posts.length} posts on LinkedIn`}>Tech notes</Heading>
      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        transition={{ staggerChildren: 0.08 }}
        className="space-y-3"
      >
        {posts.map((p) => (
          <motion.li key={p.href} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.45, ease }}>
            <motion.a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              onPointerMove={chipMove}
              whileHover={{ y: -2 }}
              className="glow-card group relative flex items-start justify-between gap-4 rounded-xl border border-dotted border-dot bg-tile/30 p-4"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[11px] text-muted">{p.date} · LinkedIn</span>
                <span className="mt-1 block text-[15px] font-bold leading-snug tracking-tight">{p.title}</span>
                <span className="mt-1.5 block text-[13px] leading-relaxed text-muted">{p.text}</span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </span>
              </span>
              <ArrowUpRight
                size={16}
                aria-hidden
                className="mt-0.5 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
              />
            </motion.a>
          </motion.li>
        ))}
      </motion.ul>
    </Block>
  );
}

/* -------------------------------- Contact ------------------------------- */

/** Calm closing headline: words settle in one by one, and a hairline draws under the last word. */
function Headline() {
  const words = ["Let's", "build", "something"];
  return (
    <h2 className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl">
      {words.map((w, i) => (
        <motion.span
          key={w}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.08, ease }}
          className="mr-[0.25em] inline-block"
        >
          {w}
        </motion.span>
      ))}
      <motion.em
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.26, ease }}
        className="relative inline-block text-muted"
      >
        together.
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.6, ease }}
          className="absolute -bottom-1 left-0 h-px w-full origin-left bg-line"
        />
      </motion.em>
    </h2>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // clipboard unavailable (insecure context or blocked): fall back to a mail draft
      openEmail();
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const glow = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const socials = [
    { href: profile.github, label: "GitHub", handle: "VijaaY17", icon: GitBranch },
    { href: profile.linkedin, label: "LinkedIn", handle: "in/vijaay", icon: UserRound },
  ];

  return (
    <Block id="contact">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Get in touch</p>
      <div className="mt-3">
        <Headline />
      </div>
      <p className="mt-3 max-w-md text-sm text-muted">Backend, React Native, or both. Say hello.</p>

      {/* email card */}
      <div
        onPointerMove={glow}
        className="glow-card relative mt-6 flex flex-col gap-4 overflow-hidden rounded-xl border border-dotted border-dot bg-tile/30 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Tile size="size-10" outer="rounded-[14px]" inner="rounded-[10px]">
            <Mail size={17} aria-hidden />
          </Tile>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Email</p>
            <p className="truncate font-mono text-[14px] sm:text-[15px]">{profile.email}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={copy}
            aria-live="polite"
            className="relative inline-flex h-9 min-w-[5.75rem] items-center justify-center gap-1.5 rounded-lg border border-tileb bg-tile px-3 text-sm transition-colors hover:border-tile2b hover:bg-tile2 active:scale-[0.98]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "done" : "copy"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className={`inline-flex items-center gap-1.5 ${copied ? "text-emerald-400" : ""}`}
              >
                {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
                {copied ? "Copied" : "Copy"}
              </motion.span>
            </AnimatePresence>
          </button>
          <a
            href={mailtoHref}
            onClick={openEmail}
            className="group inline-flex h-9 items-center gap-1.5 rounded-lg bg-fg px-3.5 text-sm font-medium text-bg transition-all hover:opacity-85 active:scale-[0.98]"
          >
            Send email
            <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* social tiles */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {socials.map(({ href, label, handle, icon: Icon }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            onPointerMove={glow as never}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="glow-card group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-dotted border-dot bg-tile/30 p-4"
          >
            <span className="flex items-center gap-3">
              <Tile size="size-10" outer="rounded-[14px]" inner="rounded-[10px]">
                <Icon size={17} aria-hidden className="transition-transform duration-300 group-hover:scale-110" />
              </Tile>
              <span>
                <span className="block text-sm font-medium">{label}</span>
                <span className="block font-mono text-[11px] text-muted">{handle}</span>
              </span>
            </span>
            <ArrowUpRight
              size={16}
              aria-hidden
              className="text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
            />
          </motion.a>
        ))}
      </div>
    </Block>
  );
}

export function Footer(): ReactNode {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 px-4 font-mono text-[11px] text-muted sm:px-1">
      <span className="inline-flex items-center gap-3">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <ViewCount />
      </span>
      <span className="hidden sm:inline">Built with React, Tailwind CSS and Motion</span>
      <a href="#top" className="group inline-flex items-center gap-1 transition-colors hover:text-fg">
        Back to top
        <ArrowUp size={12} aria-hidden className="transition-transform group-hover:-translate-y-0.5" />
      </a>
    </footer>
  );
}
