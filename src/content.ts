// All content is taken from resume.md.

export const profile = {
  name: "Vijay R",
  headline: "Full Stack Developer",
  summary:
    "Full Stack Developer with 1.5+ years of experience at Rumango building banking software: a React Native mobile banking app and a Spring Boot loan origination backend with OCR-driven document processing. Also built MERN-stack projects end to end.",
  email: "vijayrajendran03@gmail.com",
  linkedin: "https://linkedin.com/in/vijaay",
  github: "https://github.com/VijaaY17",
  resumeFile: "Vijay_R_SDE.pdf", // lives in /public
  resume: `${import.meta.env.BASE_URL}Vijay_R_SDE.pdf`,
  // set to a path such as "/profile.jpg" (file in /public) to show a photo instead of the VR monogram
  photo: "" as string,
};

export const focus = [
  {
    title: "Backend",
    groups: [
      { label: "Languages", items: ["Java", "SQL"] },
      { label: "Frameworks", items: ["Spring Boot", "JPA/Hibernate", "Node.js", "Express.js"] },
      { label: "APIs & realtime", items: ["REST APIs", "WebSockets", "Socket.IO"] },
      { label: "Databases", items: ["Oracle", "MySQL", "MongoDB"] },
    ],
  },
  {
    title: "Mobile & Frontend",
    groups: [
      { label: "Languages", items: ["TypeScript", "JavaScript"] },
      { label: "Frameworks", items: ["React", "React Native", "Expo"] },
      { label: "State & forms", items: ["Redux Toolkit", "React Query", "React Hook Form"] },
      { label: "Styling", items: ["HTML", "Tailwind CSS"] },
    ],
  },
];

export const tools = ["Git/GitHub", "Postman", "DBeaver", "Cursor"];
export const coreCS = ["OOP", "Operating Systems", "Computer Networks"];

export const company = {
  name: "Rumango Software and Consulting Services",
  location: "Bengaluru",
  period: "Mar 2025 – Present",
};

export const roles = [
  {
    id: "backend",
    title: "Backend Developer – Loan Origination System (LOS), ABC Banking",
    period: "Nov 2025 – Present",
    stack: ["Java", "Spring Boot", "JPA/Hibernate", "REST APIs", "Oracle"],
    bullets: [
      {
        lead: "Loan APIs",
        text: "Developed and modified Spring Boot REST APIs for loan creation and related operations, with request handling and validation; tested APIs and debugged loan flows end to end with senior developers.",
      },
      {
        lead: "Document scanning",
        text: "Engineered a document-scanning service that validates uploads and routes 12+ document types (national ID, passport, payslip, bank statement, credit bureau report, utility bill, civil certificates, vehicle quotation) to external Python OCR endpoints, normalizing responses for the UI and mapping upstream errors to clear messages.",
      },
      {
        lead: "Persistence",
        text: "Designed insert-or-update persistence for extracted document data, including versioned payslip records, so repeat uploads update records instead of duplicating them; used JPA/Hibernate on Oracle and validated records with DBeaver.",
      },
      {
        lead: "Bank-statement analysis",
        text: "Automated bank-statement analysis (run asynchronously after each scan): calculated monthly and annual income and expenses, flagged risk indicators (gambling transactions, cheque bounces, unusually large transactions) and reconciled payslip net pay against salary credits month by month; processed credit bureau data to derive existing-loan details and estimated repayments.",
      },
    ],
  },
  {
    id: "mobile",
    title: "React Native Developer – Mobile Banking App",
    period: "Mar 2025 – Oct 2025",
    stack: ["React Native", "TypeScript", "Expo Router"],
    bullets: [
      {
        lead: "Customer features",
        text: "Delivered customer-facing banking features in React Native and TypeScript: list and search screens, multistep transaction flows, forms and file uploads.",
      },
      {
        lead: "Multistep flows",
        text: "Implemented multistep flows with Expo Router and Redux Toolkit, adding OTP-verified confirmation before each transaction is submitted.",
      },
      {
        lead: "Validation",
        text: "Enforced business-rule validation (duplicate-request checks, zero-balance blocking, terms acceptance) so invalid requests never reach the API.",
      },
      {
        lead: "Server state",
        text: "Managed server state with React Query (conditional fetching, caching, retries, mutations), cutting redundant network calls on list and filter screens.",
      },
      {
        lead: "Forms & APIs",
        text: "Created forms with React Hook Form and reusable components; integrated token-authenticated REST APIs with multipart uploads.",
      },
    ],
  },
];

export const projects = [
  {
    name: "DevTinder",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.IO"],
    text: "Designed the connection-request lifecycle (send, accept, reject) and secure authentication for a developer-matching platform; added real-time chat between connected developers using WebSockets (Socket.IO).",
  },
  {
    name: "Bill Buddy",
    stack: ["React", "Node.js", "Express", "MySQL"],
    text: "Led backend development of an online ordering and billing system for a college amenity center, replacing manually written orders, reducing queue times by 40% and serving 1000+ users daily.",
  },
];


export type StackCategory = "Backend" | "Mobile & Frontend" | "Databases" | "Tools";

// `slug` is a simple-icons logo; items without one use a generic icon in the UI.
export type StackItem = { name: string; category: StackCategory; slug?: string; fallback?: "api" | "socket" | "sql" | "cursor"; color?: string };

export const stack: StackItem[] = [
  { name: "Java", category: "Backend", slug: "openjdk", color: "#ED8B00" },
  { name: "Spring Boot", category: "Backend", slug: "springboot", color: "#6DB33F" },
  { name: "JPA/Hibernate", category: "Backend", slug: "hibernate", color: "#BCAE79" },
  { name: "REST APIs", category: "Backend", fallback: "api", color: "#34D399" },
  { name: "Node.js", category: "Backend", slug: "nodedotjs", color: "#5FA04E" },
  { name: "Express.js", category: "Backend", slug: "express" },
  { name: "WebSockets", category: "Backend", fallback: "socket", color: "#22D3EE" },
  { name: "Socket.IO", category: "Backend", slug: "socketdotio" },
  { name: "React", category: "Mobile & Frontend", slug: "react", color: "#61DAFB" },
  { name: "React Native", category: "Mobile & Frontend", slug: "react", color: "#61DAFB" },
  { name: "Expo", category: "Mobile & Frontend", slug: "expo" },
  { name: "TypeScript", category: "Mobile & Frontend", slug: "typescript", color: "#3178C6" },
  { name: "JavaScript", category: "Mobile & Frontend", slug: "javascript", color: "#F7DF1E" },
  { name: "Redux Toolkit", category: "Mobile & Frontend", slug: "redux", color: "#764ABC" },
  { name: "React Query", category: "Mobile & Frontend", slug: "reactquery", color: "#FF4154" },
  { name: "React Hook Form", category: "Mobile & Frontend", slug: "reacthookform", color: "#EC5990" },
  { name: "HTML", category: "Mobile & Frontend", slug: "html5", color: "#E34F26" },
  { name: "Tailwind CSS", category: "Mobile & Frontend", slug: "tailwindcss", color: "#06B6D4" },
  { name: "Oracle", category: "Databases", slug: "oracle", color: "#F80000" },
  { name: "MySQL", category: "Databases", slug: "mysql", color: "#4479A1" },
  { name: "MongoDB", category: "Databases", slug: "mongodb", color: "#47A248" },
  { name: "SQL", category: "Databases", fallback: "sql", color: "#7DD3FC" },
  { name: "Git/GitHub", category: "Tools", slug: "github" },
  { name: "Postman", category: "Tools", slug: "postman", color: "#FF6C37" },
  { name: "DBeaver", category: "Tools", slug: "dbeaver", color: "#B8A08A" },
  { name: "Cursor", category: "Tools", fallback: "cursor" },
];

export const pipeline = [
  { title: "Upload", note: "Validates uploads" },
  { title: "Route", note: "12+ document types" },
  { title: "OCR", note: "External Python OCR endpoints" },
  { title: "Normalize", note: "Clean responses, clear error messages" },
  { title: "Persist", note: "Insert-or-update, versioned payslips (Oracle)" },
  { title: "Analyze", note: "Async bank-statement analysis" },
];

export const mobileFlow = [
  { title: "Browse", note: "List and search screens" },
  { title: "Fill", note: "Multistep forms and file uploads" },
  { title: "Validate", note: "Duplicate-request check, zero-balance block, terms acceptance" },
  { title: "Verify", note: "OTP-verified confirmation" },
  { title: "Submit", note: "Token-authenticated REST API call" },
];

// LinkedIn posts, newest first. Dates are month and year; descriptions summarise the posts.
export const posts = [
  {
    title: "How the V8 Engine Works Behind the Scenes in JavaScript",
    date: "Feb 2025",
    text: "Parsing into an AST, Ignition bytecode, TurboFan optimization, and what happens when optimized code is deoptimized.",
    tags: ["JavaScript", "V8"],
    href: "https://www.linkedin.com/posts/vijaay_javascript-v8engine-performance-ugcPost-7297119030123905024-ugxa",
  },
  {
    title: "Boosting Node.js Efficiency: The Role of the Thread Pool",
    date: "Feb 2025",
    text: "How the libuv thread pool keeps heavy work like file reads and crypto off the event loop, explained with a restaurant kitchen.",
    tags: ["Node.js", "libuv"],
    href: "https://www.linkedin.com/posts/vijaay_javascript-nodejs-threadpool-share-7291642380913360896-5Obm",
  },
  {
    title: "Understanding the Power Behind Node.js: The Event Loop Simplified",
    date: "Jan 2025",
    text: "How Node.js handles asynchronous work without blocking: the call stack, callback queues, the loop's phases and microtasks.",
    tags: ["Node.js", "Event loop"],
    href: "https://www.linkedin.com/posts/vijaay_understanding-the-power-behind-nodejs-ugcPost-7285526772954152960-YA-T",
  },
];
