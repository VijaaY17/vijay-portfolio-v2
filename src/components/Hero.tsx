import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { Download, GitBranch, Mail, UserRound } from "lucide-react";
import { company, profile } from "../content";
import { useClock } from "../hooks";
import AvatarFace from "./AvatarFace";
import { mailtoHref, openEmail } from "../mail";
import { Block, Heading, LiveDot, Tile } from "./ui";

/* ---- Animated cover: a perspective grid floor receding to a glowing horizon ---- */

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// motes drifting up from the floor
const motes = (() => {
  const r = rng(31);
  return Array.from({ length: 30 }, () => ({
    x: 4 + r() * 92,
    y: 40 + r() * 55,
    s: 1.2 + r() * 2,
    dur: 3 + r() * 4,
    d: -r() * 7,
  }));
})();

// light streaks racing toward the viewer along grid lines (x = column * 40px in the plane)
const streaks = (() => {
  const r = rng(77);
  return Array.from({ length: 14 }, (_, i) => ({
    col: 12 + Math.floor(r() * 18),
    dur: 2.2 + r() * 2.6,
    delay: -r() * 6,
    green: i % 3 === 0,
  }));
})();

function Banner() {
  const host = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [sweep, setSweep] = useState(0);
  const burstId = useRef(0);
  const [bursts, setBursts] = useState<{ id: number; cols: number[] }[]>([]);
  const [fast, setFast] = useState(false);
  const fastTimer = useRef<number>(0);

  // cursor shifts the vanishing point, so the floor seems to turn toward you
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    host.current?.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
  };
  const onLeave = () => host.current?.style.setProperty("--px", "0");

  return (
    <div
      ref={host}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setSweep((n) => n + 1);
        // aim the burst at the clicked column of the floor (the plane is 260% wide, shifted -80%)
        const center = Math.round(((e.clientX - r.left) / r.width * r.width + 0.8 * r.width) / 40);
        const cols = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((o) => center + o);
        setBursts((all) => [...all.slice(-2), { id: ++burstId.current, cols }]);
        setFast(true);
        window.clearTimeout(fastTimer.current);
        fastTimer.current = window.setTimeout(() => setFast(false), 1300);
      }}
      aria-hidden="true"
      className={`fl group relative h-40 cursor-pointer overflow-hidden rounded-xl border border-dotted border-dot bg-card sm:h-48 ${fast ? "fl-fast" : ""}`}
    >
      {/* horizon bloom */}
      <div key={sweep} aria-hidden className={`fl-bloom absolute inset-x-0 top-0 h-full ${sweep ? "fl-flash" : ""}`} />

      <div aria-hidden className="fl-horizon" />

      {/* floor */}
      <div aria-hidden className="fl-stage absolute inset-x-0 bottom-0 top-[38%]">
        <div className="fl-plane">
          <div className="fl-grid" />
          {streaks.map((k, i) => (
            <span
              key={i}
              className="fl-streak"
              style={{ left: k.col * 40 - 1, "--d": `${k.dur.toFixed(1)}s`, "--l": `${k.delay.toFixed(1)}s`, "--sc": k.green ? "#34d399" : "var(--fg)" } as CSSProperties}
            />
          ))}
          {bursts.flatMap((b) =>
            b.cols.map((col, i, all) => (
              <span
                key={`${b.id}-${col}`}
                className="fl-streak fl-streak-once"
                style={{ left: col * 40 - 1, "--d": `${(0.8 + ((i * 7) % 5) * 0.1).toFixed(1)}s`, "--l": `${(i * 0.045).toFixed(2)}s`, "--sc": i % 3 === 0 ? "#34d399" : "var(--fg)" } as CSSProperties}
                onAnimationEnd={i === all.length - 1 ? () => setBursts((x) => x.filter((a) => a.id !== b.id)) : undefined}
              />
            )),
          )}
          <div className="fl-sweep" />
        </div>
      </div>

      {/* motes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_40%,black_80%,transparent)]">
        {motes.map((m, i) => (
          <span
            key={i}
            className="lamp-dust absolute rounded-full bg-fg"
            style={{ left: `${m.x}%`, top: `${m.y}%`, width: m.s, height: m.s, animationDuration: `${m.dur.toFixed(1)}s`, animationDelay: `${m.d.toFixed(1)}s` }}
          />
        ))}
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-card to-transparent" />
      <p aria-hidden className="pointer-events-none absolute right-3 top-2.5 hidden font-mono text-[10px] text-muted sm:block">
        move · click
      </p>
    </div>
  );
}

const REACTIONS = ["🚀", "🔥", "✨", "☕", "❤️", "😄", "💻", "👏"];

/** Illustrated profile tile. Eyes follow the cursor; hover waves hello; click makes it grin and floats emoji up. */
function Avatar() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const happyTimer = useRef<number>(0);
  const [hover, setHover] = useState(false);
  const [happy, setHappy] = useState(false);
  const [burst, setBurst] = useState<{ id: number; ch: string; dx: number; dy: number; rot: number; delay: number }[]>([]);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const onMove = (e: globalThis.PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = root.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / 320;
        el.style.setProperty("--ex", String(Math.max(-1, Math.min(1, dx))));
        el.style.setProperty("--ey", String(Math.max(-1, Math.min(1, dy))));
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  const onClick = () => {
    setHappy(true);
    window.clearTimeout(happyTimer.current);
    happyTimer.current = window.setTimeout(() => setHappy(false), 1100);
    if (reduce) return;
    const pool = [...REACTIONS].sort(() => Math.random() - 0.5);
    const picks = Array.from({ length: 6 }, (_, i) => ({
      id: ++nextId.current,
      ch: pool[i],
      dx: (Math.random() - 0.5) * 90,
      dy: -(70 + Math.random() * 50),
      rot: (Math.random() - 0.5) * 60,
      delay: i * 0.06,
    }));
    setBurst((all) => [...all.slice(-8), ...picks]);
  };

  return (
    <div
      ref={root}
      role="button"
      tabIndex={0}
      aria-label={`${profile.name}, illustrated avatar. Press to say hi.`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={onClick}
      className={`av relative size-[88px] cursor-pointer select-none sm:size-24 ${happy ? "is-happy" : ""}`}
    >
      <motion.div
        className="size-full"
        whileHover={reduce ? undefined : { scale: 1.07, rotate: -3 }}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        animate={happy && !reduce ? { rotate: [0, -7, 7, -3, 0] } : undefined}
        transition={{ type: "spring", stiffness: 320, damping: 16 }}
      >
        <Tile size="size-full" outer="rounded-[22px]" inner="rounded-[17px]" className="bg-bg shadow-sm">
          <div className="size-full overflow-hidden rounded-[17px]">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} className="size-full object-cover" />
            ) : (
              <AvatarFace />
            )}
          </div>
        </Tile>
      </motion.div>

      {/* emoji layer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
        <AnimatePresence>
          {hover && !reduce && (
            <motion.span
              key="hi"
              initial={{ opacity: 0, scale: 0.3, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: 6 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
              className="absolute -right-3 -top-3 grid size-8 place-items-center rounded-full border border-line bg-bg text-base shadow-md"
            >
              <motion.span
                animate={{ rotate: [0, 18, -10, 18, -6, 0] }}
                transition={{ duration: 1.2, delay: 0.15, repeat: Infinity, repeatDelay: 0.8 }}
                style={{ display: "inline-block", transformOrigin: "70% 80%" }}
              >
                👋
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
        {burst.map((b) => (
          <motion.span
            key={b.id}
            initial={{ opacity: 0, scale: 0.3, x: 0, y: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.25, 1, 0.9], x: b.dx, y: b.dy, rotate: b.rot }}
            transition={{ duration: 1.3, delay: b.delay, ease: "easeOut", times: [0, 0.15, 0.7, 1] }}
            onAnimationComplete={() => setBurst((all) => all.filter((x) => x.id !== b.id))}
            className="absolute left-1/2 top-1/3 -ml-3 text-xl"
          >
            {b.ch}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const time = useClock("Asia/Kolkata");
  return (
    <Block id="top" className="!p-3 sm:!p-4">
      <Banner />
      <div className="px-2 pb-2 sm:px-3">
        <div className="flex items-start gap-4">
          <div className="relative -mt-10 sm:-mt-12">
            <Avatar />
            <LiveDot className="absolute! -bottom-1 -right-1 z-10 rounded-full bg-bg p-[3px] box-content" />
          </div>
          <div className="min-w-0 pt-3">
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-3xl">{profile.name}</h1>
            <p className="text-sm text-muted">{profile.headline}</p>
          </div>
        </div>

        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <LiveDot /> {company.name.split(" ")[0]} · {company.period}
          </span>
          <span className="tabular-nums">
            {company.location} · {time}
          </span>
        </p>

        <p className="mt-4 text-[15px] leading-relaxed text-muted">{profile.summary}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <a
            href={mailtoHref}
            onClick={openEmail}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-fg px-3 text-[13px] font-medium sm:gap-2 sm:px-3.5 sm:text-sm text-bg transition-all hover:opacity-85 active:scale-[0.98]"
          >
            <Mail size={15} aria-hidden /> Email me
          </a>
          {[
            { href: profile.github, label: "GitHub", icon: GitBranch },
            { href: profile.linkedin, label: "LinkedIn", icon: UserRound },
          ].map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-tileb bg-tile px-3 text-[13px] sm:gap-2 sm:px-3.5 sm:text-sm transition-all hover:border-tile2b hover:bg-tile2 active:scale-[0.98]"
            >
              <Icon size={15} aria-hidden /> <span className="hidden sm:inline">{label}</span>
            </a>
          ))}
          <a
            href={profile.resume}
            download={profile.resumeFile}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-tileb bg-tile px-3 text-[13px] transition-all hover:border-tile2b hover:bg-tile2 active:scale-[0.98] sm:gap-2 sm:px-3.5 sm:text-sm"
          >
            <Download size={15} aria-hidden /> Resume
          </a>
        </div>
      </div>
    </Block>
  );
}
