import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { inject } from "@vercel/analytics";
import App from "./App";

// Privacy-friendly visitor counts (no cookies). Only reports from the deployed site; turn it on in the Vercel dashboard.
inject();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
