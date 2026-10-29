import { useId } from "react";

/** The illustrated avatar artwork. Class names (av-*) are animated from index.css. */
export default function AvatarFace({ decorative = false }: { decorative?: boolean }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 96 96" className="block size-full" aria-hidden={decorative}>
                <defs>
                  <radialGradient id={`${u}-skin`} cx="0.42" cy="0.34" r="0.8">
                    <stop offset="0" stopColor="#f0c29c" />
                    <stop offset="1" stopColor="#d49568" />
                  </radialGradient>
                  <linearGradient id={`${u}-hair`} x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0" stopColor="#4a352b" />
                    <stop offset="1" stopColor="#241a16" />
                  </linearGradient>
                  <linearGradient id={`${u}-tee`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#3fd9a6" />
                    <stop offset="1" stopColor="#1f9b73" />
                  </linearGradient>
                </defs>

                <circle cx="48" cy="46" r="37" style={{ fill: "var(--tile)" }} />

                {/* neck and tee */}
                <g className="av-body">
                  <rect x="40.5" y="57" width="15" height="20" rx="6" fill="#c98a60" />
                  <path d="M8 100C10 83 24 75 38 72.5Q48 79 58 72.5C72 75 86 83 88 100Z" fill={`url(#${u}-tee)`} />
                  <path d="M38 72.5Q48 79 58 72.5" fill="none" stroke="#18795a" strokeWidth="1.6" strokeLinecap="round" />
                </g>

                <g className="av-head">
                  {/* ears */}
                  <ellipse cx="27.2" cy="46" rx="3.4" ry="4.8" fill="#d49568" />
                  <ellipse cx="68.8" cy="46" rx="3.4" ry="4.8" fill="#d49568" />
                  <ellipse cx="27.6" cy="46.4" rx="1.4" ry="2.6" fill="#bd7d55" opacity="0.6" />
                  <ellipse cx="68.4" cy="46.4" rx="1.4" ry="2.6" fill="#bd7d55" opacity="0.6" />

                  {/* face */}
                  <path d="M27 42C27 27 36 19.5 48 19.5C60 19.5 69 27 69 42C69 50 66 57 61 61.5C57 65 52.5 66.5 48 66.5C43.5 66.5 39 65 35 61.5C30 57 27 50 27 42Z" fill={`url(#${u}-skin)`} />
                  <ellipse cx="48" cy="67.5" rx="9" ry="2.2" fill="#a86a45" opacity="0.3" />

                  {/* soft cheeks */}
                  <circle cx="34.6" cy="54" r="4" fill="#f08a7a" opacity="0.22" />
                  <circle cx="61.4" cy="54" r="4" fill="#f08a7a" opacity="0.22" />

                  {/* brows */}
                  <g className="av-brows" fill="none" stroke="#2b1f1a" strokeWidth="2.7" strokeLinecap="round">
                    <path d="M35 40.2Q39.6 37.6 44.2 39.4" />
                    <path d="M51.8 39.4Q56.4 37.6 61 40.2" />
                  </g>

                  {/* eyes */}
                  <g className="av-eyes">
                    <g className="av-eye av-eye-l">
                      <g className="av-pupils">
                        <ellipse cx="40" cy="46" rx="2.5" ry="3.3" fill="#1b1411" />
                        <circle cx="40.9" cy="44.6" r="0.9" fill="#fff" />
                      </g>
                    </g>
                    <g className="av-eye av-eye-r">
                      <g className="av-pupils">
                        <ellipse cx="56" cy="46" rx="2.5" ry="3.3" fill="#1b1411" />
                        <circle cx="56.9" cy="44.6" r="0.9" fill="#fff" />
                      </g>
                    </g>
                  </g>
                  {/* wink, shown while clicked */}
                  <g className="av-happy-eyes" fill="none" stroke="#1b1411" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M36.6 46.6Q40 42 43.4 46.6" />
                  </g>

                  {/* nose */}
                  <path d="M46.4 52.6Q48 54.4 49.6 52.6" fill="none" stroke="#b97a52" strokeWidth="1.5" strokeLinecap="round" />

                  {/* mouth */}
                  <path className="av-smile" d="M42.8 57.4Q48 61.4 53.2 57.4" fill="none" stroke="#8a3f3a" strokeWidth="2" strokeLinecap="round" />
                  <g className="av-grin">
                    <path d="M42 56.4Q48 57.8 54 56.4Q52.8 63.8 48 63.8Q43.2 63.8 42 56.4Z" fill="#7a2f2f" />
                    <path d="M43 56.8Q48 58.2 53 56.8Q52.4 59.4 48 59.4Q43.6 59.4 43 56.8Z" fill="#fff" />
                    <ellipse cx="48" cy="62.4" rx="2.4" ry="1.2" fill="#ee7f8d" />
                  </g>

                  {/* short, neat hair */}
                  <path d="M25.6 45C22.8 26 31 13 48 12.6C65 13 73.2 26 70.4 45C69.4 38.6 67.6 34.4 64 31.6C57 33.8 43 33.4 35 29.8C31 33.2 28 38.6 25.6 45Z" fill={`url(#${u}-hair)`} />
                  <path d="M34 20C40 13.6 56 13.4 63 19.4" fill="none" stroke="#7a5a48" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
                </g>
              </svg>
  );
}
