import { useEffect, useState } from "react";

/**
 * Hidden diagnostic: open the site with ?debug at the end of the address.
 * It shows what the browser reports, to find out why a phone might be laying the page out as a desktop.
 */
export default function DebugInfo() {
  const [text, setText] = useState("");

  useEffect(() => {
    const read = () => {
      const de = document.documentElement;
      const vv = window.visualViewport;
      const meta = document.querySelector('meta[name="viewport"]')?.getAttribute("content");
      const uad = (navigator as Navigator & { userAgentData?: { mobile: boolean; platform: string } }).userAgentData;
      setText(
        [
          `layout width (innerWidth): ${window.innerWidth}`,
          `clientWidth / scrollWidth: ${de.clientWidth} / ${de.scrollWidth}`,
          `screen.width x height: ${screen.width} x ${screen.height}`,
          `devicePixelRatio: ${window.devicePixelRatio}`,
          `visual viewport width / scale: ${vv ? `${Math.round(vv.width)} / ${vv.scale.toFixed(2)}` : "n/a"}`,
          `min-width 640px matches (desktop nav): ${window.matchMedia("(min-width: 640px)").matches}`,
          `touch screen (pointer: coarse): ${window.matchMedia("(pointer: coarse)").matches}`,
          `hover available: ${window.matchMedia("(hover: hover)").matches}`,
          `userAgentData mobile / platform: ${uad ? `${uad.mobile} / ${uad.platform}` : "n/a"}`,
          `viewport meta: ${meta ?? "MISSING"}`,
          `user agent: ${navigator.userAgent}`,
        ].join("\n"),
      );
    };
    read();
    window.addEventListener("resize", read);
    window.visualViewport?.addEventListener("resize", read);
    return () => {
      window.removeEventListener("resize", read);
      window.visualViewport?.removeEventListener("resize", read);
    };
  }, []);

  return (
    <pre className="fixed inset-x-2 bottom-2 z-[200] whitespace-pre-wrap break-all rounded-lg border border-line bg-black/90 p-3 font-mono text-[11px] leading-relaxed text-white">
      {text}
    </pre>
  );
}
