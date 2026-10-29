import { MotionConfig } from "motion/react";
import Nav from "./components/Nav";
import CommandPalette from "./components/CommandPalette";
import { Hero } from "./components/Hero";
import { Contact, Experience, Footer, Projects, Stack, Notes } from "./components/Sections";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#content"
        className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-md bg-fg px-3 py-2 text-sm font-medium text-bg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav />
      <CommandPalette />
      <div className="page-in min-h-screen overflow-x-clip px-3 pb-10 pt-20 sm:px-5 sm:pt-24">
        <main id="content" tabIndex={-1} className="mx-auto flex w-full max-w-2xl flex-col gap-5 outline-none">
          <Hero />
          <Experience />
          <Projects />
          <Notes />
          <Stack />
          <Contact />
          <Footer />
        </main>
      </div>
    </MotionConfig>
  );
}
