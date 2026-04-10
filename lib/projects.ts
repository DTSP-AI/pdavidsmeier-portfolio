export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  blurb: string;
  url: string | null;
  comingSoon?: boolean;
}

export const projects: Project[] = [
  {
    id: "ybryx",
    title: "YBRYX",
    subtitle: "Multi-Agent Sales Platform",
    category: "AI Agent Platform",
    blurb:
      "A prescriptive multi-agent system that automates the entire sales pipeline \u2014 from first touch to booked appointment. Three specialized AI agents handle intake, discovery, and orchestration, each operating from behavioral contracts that make them consistent, auditable, and endlessly tunable. Integrates natively with major CRMs. Built for teams that need qualified leads, not just leads.",
    url: "https://frontend-nu-six-45.vercel.app",
  },
  {
    id: "deal-whisperer",
    title: "Deal Whisperer",
    subtitle: "Real-Time Sales Coach",
    category: "Real-Time AI Coaching",
    blurb:
      "An invisible AI co-pilot that joins sales calls and delivers coaching cards in under 2.5 seconds. Pre-call, it researches the prospect, their company, tech stack, and recent moves. During the call, it adapts to the conversation and the buyer\u2019s behavioral profile. Every meeting makes the next one smarter. The rep gets better. The prospect never knows it\u2019s there.",
    url: "https://deal-whisper.com",
  },
  {
    id: "realtime-med",
    title: "Real-Time Medical Advisor",
    subtitle: "Clinical Biometric Intelligence",
    category: "HealthTech / Clinical AI",
    blurb:
      "A clinical decision support platform that ingests live patient biometrics from 10+ sources \u2014 wearables, BLE medical devices, even camera-based vitals \u2014 and generates real-time clinical insights. Five-level urgency escalation, drug interaction detection, and protocol adherence checking. Built on healthcare interoperability standards. Designed for clinicians who need answers now, not after the chart review.",
    url: "https://real-time-med-agent.vercel.app",
  },
  {
    id: "numen-ai",
    title: "Numen AI",
    subtitle: "Personalized Voice AI Guide",
    category: "Voice AI / Personalization",
    blurb:
      "A voice-enabled AI platform where users build their own personalized guide through a 7-step wizard \u2014 choosing personality traits, communication style, voice, and focus areas. Then they talk to it. Real-time voice conversations with sub-300ms latency. The system remembers context across sessions, adapting to each user over time. A fundamentally different approach to human-AI interaction.",
    url: null,
  },
  {
    id: "fight-analyst",
    title: "Fight Analyst",
    subtitle: "AI Sports Intelligence",
    category: "Sports Analytics / AI Verification",
    blurb:
      "An AI-powered fight analysis platform that takes a YouTube URL or video upload and produces verified, evidence-based breakdowns. The key differentiator: a verification layer that cross-references every claim against authoritative databases before it reaches the user. No hallucinated stats. No fabricated records. Just analysis you can actually cite.",
    url: "https://fight-analyst-frontend-v2.vercel.app",
  },
  {
    id: "haven-home",
    title: "Haven Home Solutions",
    subtitle: "AI-Powered Home Services",
    category: "Lead Qualification / Compliance",
    blurb:
      "A conversational AI intake system for bundled home services \u2014 solar, water treatment, roofing \u2014 that qualifies homeowners in real-time. Handles service-specific eligibility (credit, ownership, utility spend), multi-language support, and regulatory compliance including TCPA and Florida solar disclosures. Qualified leads route directly to CRM with normalized data. Built to handle the messiness of real consumer conversations.",
    url: "https://haven-frontend-zeta.vercel.app",
  },
];

export const capabilities = [
  "Multi-Agent Systems",
  "Real-Time AI",
  "Voice AI (LiveKit/Deepgram/ElevenLabs)",
  "LangGraph Pipelines",
  "FastAPI",
  "Next.js",
  "PostgreSQL",
  "Knowledge Graphs",
  "CRM Integration (Salesforce/HubSpot/GHL)",
  "HIPAA/TCPA Compliance",
  "Contract-Driven Architecture",
  "Healthcare Interoperability (FHIR/HL7)",
  "Production Deployment",
  "WebSocket Streaming",
  "Vector Search",
];

export interface TechCategory {
  label: string;
  items: string[];
}

export const techStack: TechCategory[] = [
  { label: "Languages", items: ["Python", "TypeScript", "SQL"] },
  { label: "Frontend", items: ["Next.js", "React", "Tailwind CSS", "Framer Motion"] },
  { label: "Backend", items: ["FastAPI", "LangGraph", "LangChain"] },
  { label: "Database", items: ["PostgreSQL", "Supabase", "Neo4j", "pgvector"] },
  { label: "Voice / RT", items: ["LiveKit", "Deepgram", "ElevenLabs", "Retell"] },
  { label: "Infra", items: ["Vercel", "Render", "Docker", "GitHub Actions"] },
  { label: "Integrations", items: ["Salesforce", "GoHighLevel", "HubSpot", "Stripe"] },
];
