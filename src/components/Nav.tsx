import { motion } from "motion/react";
import { Briefcase, FolderGit2, House, Layers, Mail, Moon, PenLine, Search, Sun } from "lucide-react";
import { useActiveSection, useTheme } from "../hooks";
import AvatarFace from "./AvatarFace";
import { OPEN_PALETTE } from "./CommandPalette";

const isMac = typeof navigator !== "undefined" && /mac/i.test(navigator.platform);

const links = [
  { id: "top", label: "Home", Icon: House },
  { id: "experience", label: "Experience", Icon: Briefcase },
  { id: "projects", label: "Projects", Icon: FolderGit2 },
  { id: "notes", label: "Notes", Icon: PenLine },
  { id: "stack", label: "Stack", Icon: Layers },
  { id: "contact", label: "Contact", Icon: Mail },
];
const ids = links.map((l) => l.id);

export default function Nav() {
  const { theme, toggle } = useTheme();
  const active = useActiveSection(ids);

  return (
    <>
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
        </div>
      </div>
    </header>
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden"
    >
      <div className="flex items-center gap-0.5 rounded-full border border-tile2b bg-bg/80 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {links.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-label={label}
              aria-current={on ? "true" : undefined}
              className={`relative flex h-10 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors active:scale-95 ${
                on ? "text-bg" : "text-muted"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="dock-pill"
                  className="absolute inset-0 rounded-full bg-fg"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                />
              )}
              <Icon size={17} aria-hidden className="relative" />
              {on && <span className="relative">{label}</span>}
            </a>
          );
        })}
      </div>
    </nav>
    </>
  );
}
