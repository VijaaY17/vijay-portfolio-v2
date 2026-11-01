import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Search, Sun } from "lucide-react";
import { useActiveSection, useTheme } from "../hooks";
import AvatarFace from "./AvatarFace";
import { OPEN_PALETTE } from "./CommandPalette";

const isMac = typeof navigator !== "undefined" && /mac/i.test(navigator.platform);

const links = [
  { id: "top", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "notes", label: "Notes" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];
const ids = links.map((l) => l.id);

export default function Nav() {
  const { theme, toggle } = useTheme();
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-dashed border-dot bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 w-full max-w-2xl items-center justify-between px-4 md:border-x md:border-dashed md:border-dot">
        <a
          href="#top"
          aria-label="Home"
          className="av size-8 overflow-hidden rounded-full border border-tile2b bg-tile transition-transform hover:scale-110 active:scale-95"
        >
          <AvatarFace decorative />
        </a>
        <div className="ml-2.5 mr-auto flex min-w-0 items-baseline gap-1.5 text-sm sm:hidden" aria-hidden>
          <span className="font-semibold">Vijay R</span>
          <span className="text-muted">/</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={active}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.16 }}
              className="truncate text-muted"
            >
              {links.find((l) => l.id === active)?.label ?? "Home"}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 sm:gap-5">
          <nav aria-label="Primary" className="hidden items-center gap-5 text-sm sm:flex">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`relative py-1 transition-colors ${
                  active === l.id ? "font-semibold text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {l.label}
                {active === l.id && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-fg"
                    transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  />
                )}
              </a>
            ))}
          </nav>
          <button
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}
            aria-label="Open command palette"
            className="hidden h-8 items-center gap-2 rounded-md border border-line px-2 text-muted transition-colors hover:border-tile2b hover:text-fg sm:inline-flex"
          >
            <Search size={14} aria-hidden />
            <kbd className="font-mono text-[10px]">{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="relative grid size-9 place-items-center rounded-md text-muted transition-colors hover:bg-tile hover:text-fg active:scale-95"
          >
            <Sun size={16} aria-hidden className="ic-swap ic-sun absolute" />
            <Moon size={16} aria-hidden className="ic-swap ic-moon absolute" />
          </button>
          <div className="relative sm:hidden">
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid size-9 place-items-center rounded-md text-fg transition-colors hover:bg-tile active:scale-95"
            >
              <span className="relative block h-2.5 w-[18px]" aria-hidden>
                <span className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
              </span>
            </button>
            <AnimatePresence>
              {open && (
                <>
                  <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} aria-hidden />
                  <motion.nav
                    id="mobile-menu"
                    aria-label="Sections"
                    initial={{ opacity: 0, scale: 0.94, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -6 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "top right" }}
                    className="absolute right-0 top-11 w-52 rounded-xl border border-tile2b bg-bg p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
                  >
                    {links.map((l) => {
                      const on = active === l.id;
                      return (
                        <a
                          key={l.id}
                          href={`#${l.id}`}
                          onClick={() => setOpen(false)}
                          aria-current={on ? "true" : undefined}
                          className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] transition-colors active:bg-tile ${
                            on ? "bg-tile font-semibold text-fg" : "text-muted"
                          }`}
                        >
                          {l.label}
                          {on && <span className="size-1.5 rounded-full bg-fg" aria-hidden />}
                        </a>
                      );
                    })}
                  </motion.nav>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
