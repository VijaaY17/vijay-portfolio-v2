import { motion } from "motion/react";
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
        <div className="flex items-center gap-2 sm:gap-5">
          <nav aria-label="Primary" className="flex items-center gap-2.5 text-[12px] sm:gap-5 sm:text-sm">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`relative py-1 transition-colors ${l.id === "top" ? "hidden sm:inline-block" : ""} ${
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
            className="grid size-9 place-items-center rounded-md text-muted transition-all hover:bg-tile hover:text-fg active:scale-95"
          >
            <motion.span
              key={theme}
              initial={{ rotate: -70, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </motion.span>
          </button>
        </div>
      </div>
    </header>
  );
}
