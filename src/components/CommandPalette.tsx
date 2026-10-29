import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Briefcase,
  CornerDownLeft,
  Download,
  FolderGit2,
  GitBranch,
  Home,
  Layers,
  Mail,
  Copy,
  Moon,
  PenLine,
  Search,
  Send,
  Sun,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { profile } from "../content";
import { useTheme } from "../hooks";

type Cmd = {
  id: string;
  label: string;
  group: "Go to" | "Actions";
  icon: LucideIcon;
  keywords?: string;
  run: () => void;
};

export const OPEN_PALETTE = "open-palette";

const ease = [0.22, 1, 0.36, 1] as const;

function goTo(id: string) {
  if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
  else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/** Ctrl/Cmd+K command palette: jump to a section, or run a quick action. */
export default function CommandPalette() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<number>(0);

  const say = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 1900);
  }, []);

  const commands = useMemo<Cmd[]>(
    () => [
      { id: "top", label: "Home", group: "Go to", icon: Home, keywords: "top hero intro", run: () => goTo("top") },
      { id: "experience", label: "Experience", group: "Go to", icon: Briefcase, keywords: "work rumango roles", run: () => goTo("experience") },
      { id: "projects", label: "Projects", group: "Go to", icon: FolderGit2, keywords: "devtinder bill buddy", run: () => goTo("projects") },
      { id: "notes", label: "Tech notes", group: "Go to", icon: PenLine, keywords: "notes writing blog posts articles node javascript linkedin", run: () => goTo("notes") },
      { id: "stack", label: "Tech stack", group: "Go to", icon: Layers, keywords: "skills tools technologies", run: () => goTo("stack") },
      { id: "contact", label: "Contact", group: "Go to", icon: Send, keywords: "email reach hire", run: () => goTo("contact") },
      {
        id: "resume",
        label: "Download resume",
        group: "Actions",
        icon: Download,
        keywords: "cv pdf",
        run: () => {
          const a = document.createElement("a");
          a.href = profile.resume;
          a.download = profile.resumeFile;
          a.click();
          say("Resume downloading");
        },
      },
      {
        id: "copy",
        label: "Copy email address",
        group: "Actions",
        icon: Copy,
        keywords: "mail clipboard",
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            say("Email copied");
          } catch {
            window.location.href = `mailto:${profile.email}`;
          }
        },
      },
      { id: "mail", label: "Send an email", group: "Actions", icon: Mail, keywords: "write message", run: () => (window.location.href = `mailto:${profile.email}`) },
      { id: "github", label: "Open GitHub", group: "Actions", icon: GitBranch, keywords: "code repos", run: () => window.open(profile.github, "_blank", "noreferrer") },
      { id: "linkedin", label: "Open LinkedIn", group: "Actions", icon: UserRound, keywords: "profile network", run: () => window.open(profile.linkedin, "_blank", "noreferrer") },
      {
        id: "theme",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        group: "Actions",
        icon: theme === "dark" ? Sun : Moon,
        keywords: "dark light mode appearance",
        run: toggle,
      },
    ],
    [theme, toggle, say],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.keywords ?? ""} ${c.group}`.toLowerCase().includes(q));
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
    returnFocus.current?.focus?.();
  }, []);

  const openIt = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  // Ctrl/Cmd+K toggles; the nav button opens it through a window event
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) returnFocus.current = document.activeElement as HTMLElement | null;
          return !o;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE, openIt);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE, openIt);
    };
  }, [openIt]);

  useEffect(() => {
    if (open) {
      setIndex(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [open]);
  useEffect(() => setIndex(0), [query]);

  const run = (c: Cmd | undefined) => {
    if (!c) return;
    close();
    // let the dialog start closing before the action runs
    window.setTimeout(c.run, 60);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + (e.shiftKey ? -1 : 1) + results.length) % results.length : 0));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[index]);
    }
  };

  const groups = (["Go to", "Actions"] as const).map((g) => ({ g, items: results.filter((c) => c.group === g) }));

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[14vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <div aria-hidden className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              onKeyDown={onKeyDown}
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease }}
              className="relative w-full max-w-lg overflow-hidden rounded-xl border border-line bg-bg shadow-2xl shadow-black/30"
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Search size={16} aria-hidden className="shrink-0 text-muted" />
                <input
                  ref={input}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sections and actions…"
                  aria-label="Search commands"
                  role="combobox"
                  aria-expanded
                  aria-controls="palette-list"
                  aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined}
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
                />
                <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">esc</kbd>
              </div>

              <div id="palette-list" role="listbox" className="max-h-[min(27rem,60vh)] overflow-y-auto p-2 [scrollbar-width:thin]">
                {results.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted">No results for "{query}"</p>}
                {groups.map(
                  ({ g, items }) =>
                    items.length > 0 && (
                      <div key={g} className="mb-1 last:mb-0">
                        <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-muted">{g}</p>
                        {items.map((c) => {
                          const i = results.indexOf(c);
                          const active = i === index;
                          return (
                            <button
                              key={c.id}
                              id={`cmd-${c.id}`}
                              role="option"
                              aria-selected={active}
                              onMouseMove={() => setIndex(i)}
                              onClick={() => run(c)}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                active ? "bg-tile2 text-fg" : "text-fg/80"
                              }`}
                            >
                              <c.icon size={15} aria-hidden className={active ? "text-fg" : "text-muted"} />
                              <span className="flex-1">{c.label}</span>
                              {active && <CornerDownLeft size={13} aria-hidden className="text-muted" />}
                            </button>
                          );
                        })}
                      </div>
                    ),
                )}
              </div>

              <div className="flex items-center gap-4 border-t border-line px-4 py-2 font-mono text-[10px] text-muted">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span className="ml-auto">esc close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full border border-line bg-bg px-4 py-2 font-mono text-xs shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
