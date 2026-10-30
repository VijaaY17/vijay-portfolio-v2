import type { MouseEvent } from "react";
import { profile } from "./content";

const SUBJECT = "Hi Vijay";

/** Plain mail link: used as the link target everywhere, and the way phones open their own mail app. */
export const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(SUBJECT)}`;

/** Gmail's compose window, with your address already in the To box. */
export const gmailComposeHref =
  "https://mail.google.com/mail/?" + new URLSearchParams({ view: "cm", fs: "1", to: profile.email, su: SUBJECT }).toString();

// phones and tablets have a mail app that handles mailto: well, so leave those alone
const isTouch = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

/** Start an email. On a computer this opens Gmail's compose window in a new tab; on a phone it opens the mail app. */
export function openEmail(e?: MouseEvent) {
  if (isTouch()) {
    if (!e) window.location.href = mailtoHref; // called without a link click (palette, clipboard fallback)
    return; // a link click falls through to the normal mailto: href
  }
  e?.preventDefault();
  // Open through a link click. (window.open with "noopener" always returns null, which looks like a blocked
  // pop-up and used to trigger the mailto: fallback at the same time as Gmail opened.)
  const a = document.createElement("a");
  a.href = gmailComposeHref;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
