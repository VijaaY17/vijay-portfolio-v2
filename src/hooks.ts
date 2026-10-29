import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export type Theme = "light" | "dark";

// the theme a switch is heading towards, so a second click during the cross-fade still flips it back
let pendingTheme: Theme | null = null;

export function useTheme() {
  const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
  const [theme, setTheme] = useState<Theme>(read);

  // keep every consumer in sync, whoever changes the theme
  useEffect(() => {
    const mo = new MutationObserver(() => setTheme(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next: Theme = (pendingTheme ?? read()) === "dark" ? "light" : "dark";
    pendingTheme = next;
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* storage unavailable */
      }
    };

    // Animating every element's colour at once is what made the switch janky. Turn those transitions off for the
    // moment of the switch, and let the browser cross-fade the whole page as a single picture instead.
    root.classList.add("theme-switching");
    const done = () => {
      if (pendingTheme === next) pendingTheme = null;
      root.classList.remove("theme-switching");
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doc.startViewTransition(apply).finished.then(done, done);
    } else {
      apply();
      requestAnimationFrame(() => requestAnimationFrame(done));
    }
  };
  return { theme, toggle };
}

/** Advances an index 0..n-1 on an interval; stays on the first step for reduced motion. */
export function useCycle(n: number, ms: number, paused = false) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(id);
  }, [n, ms, reduce, paused]);
  return [i, setI] as const;
}

export function useClock(timeZone: string) {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}
