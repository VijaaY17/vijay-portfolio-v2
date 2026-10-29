import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Eye } from "lucide-react";
import { profile } from "../content";

/*
 * Visitor count backed by GoatCounter (https://www.goatcounter.com).
 * - Set `profile.goatcounter` to your GoatCounter site code to switch it on.
 * - In GoatCounter: Settings -> tick "Allow adding visitor counts on your website".
 * - Until a code is set, the live site shows nothing. `npm run dev` shows a labelled sample number
 *   so the design can be checked.
 * - Visit the site once with ?me at the end of the address to stop counting your own visits.
 */

const SAMPLE = 128;
let cache: Promise<number | null> | null = null;

function loadViews(): Promise<number | null> {
  if (cache) return cache;
  const code = profile.goatcounter;

  if (!code) {
    cache = Promise.resolve(import.meta.env.DEV ? SAMPLE : null);
    return cache;
  }

  // opt out of counting your own visits (GoatCounter's documented skip flag)
  try {
    if (new URLSearchParams(window.location.search).has("me")) localStorage.setItem("skipgc", "t");
  } catch {
    /* storage unavailable */
  }

  // only the deployed site reports a visit
  if (import.meta.env.PROD && !document.querySelector("script[data-goatcounter]")) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
    document.head.appendChild(s);
  }

  cache = fetch(`https://${code}.goatcounter.com/counter/TOTAL.json`)
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const n = Number(String(d?.count ?? "").replace(/[^\d]/g, ""));
      return Number.isFinite(n) && n > 0 ? n : null;
    })
    .catch(() => null);
  return cache;
}

/** Eye icon plus a visitor count that counts up. Renders nothing when there is no real number to show. */
export default function ViewCount() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [views, setViews] = useState<number | null>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let live = true;
    loadViews().then((n) => live && setViews(n));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (views == null || !inView) return;
    if (reduce) {
      setShown(views);
      return;
    }
    // small ease-out count-up (kept dependency-free so it adds almost nothing to the bundle)
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 1300);
      setShown(Math.round(views * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [views, inView, reduce]);

  if (views == null) return null;

  const label = `${views.toLocaleString("en-IN")} visitors`;
  return (
    <span
      role="img"
      aria-label={label}
      title={profile.goatcounter ? label : "Design preview: sample number, hidden on the live site until a counter is connected"}
      className="inline-flex items-center gap-1.5"
    >
      <span className="eye-blink inline-flex" aria-hidden>
        <Eye size={12} />
      </span>
      <span ref={ref} aria-hidden className="tabular-nums">
        {shown.toLocaleString("en-IN")}
      </span>
      <span aria-hidden>visitors</span>
    </span>
  );
}
