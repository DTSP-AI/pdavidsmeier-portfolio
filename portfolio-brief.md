# Portfolio Landing Page — Dev Agent Brief

## Target: Employers looking for Senior Engineering / AI Architecture Role
## Theme: Modern LinkedIn-Inspired Professional (Light)

---

## DESIGN DIRECTION

**LinkedIn-inspired, NOT a clone.** Take the best of LinkedIn's professional feel and modernize it:

- **Light theme.** White/off-white backgrounds (#FAFAFA), LinkedIn blue (#0A66C2) as accent, charcoal text (#191919)
- **Card-based layout** with subtle shadows and rounded corners (like LinkedIn posts/cards)
- **Clean sans-serif typography** — Inter or system font stack. Bold section headers, regular body.
- **Subtle animations** — Framer Motion: cards fade-up on scroll, hover lifts with shadow, smooth page transitions. Nothing flashy. Professional restraint.
- **Profile header** at top — photo, name, title, tagline (like a LinkedIn profile hero)
- **Project cards** in a responsive grid below — each is a "post" style card
- **Rick chat widget** bottom-right — modern slide-up panel, NOT a cheesy chatbot bubble

**Layout structure:**
```
┌──────────────────────────────────────────────────────┐
│  HEADER: Profile photo + Name + Title + Tagline      │
│  "Pete Smith — AI Systems Architect"                  │
│  Brief 2-line professional summary                    │
│  [LinkedIn] [GitHub] [Email] action buttons           │
├──────────────────────────────────────────────────────┤
│  SECTION: "What I Build"                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │ YBRYX   │ │ Deal    │ │ Real    │                │
│  │         │ │ Whisper │ │ Time    │                │
│  │         │ │         │ │ Med     │                │
│  └─────────┘ └─────────┘ └─────────┘                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │ Numen   │ │ Fight   │ │ Haven   │                │
│  │ AI      │ │ Analyst │ │ Home    │                │
│  └─────────┘ └─────────┘ └─────────┘                │
├──────────────────────────────────────────────────────┤
│  SECTION: "Core Capabilities" (skill pills/tags)     │
├──────────────────────────────────────────────────────┤
│  SECTION: "Tech Stack" (icon grid)                    │
├──────────────────────────────────────────────────────┤
│  FOOTER: Contact info                                 │
└──────────────────────────────────────────────────────┘
                                    ┌────────────────┐
                                    │  Rick Chat     │
                                    │  (slide-up)    │
                                    └────────────────┘
```

---

## TECH STACK

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** (animations)
- **OpenAI GPT-4o** (Rick agent via API route)
- **Vercel** deployment
- No database needed — static content + API route for Rick

---

## PROJECT CARDS (Blurbs)

Each card has: icon/visual indicator, title, category tag, blurb text, two CTAs.

### 1. YBRYX — Multi-Agent Sales Platform

**Category tag:** `AI Agent Platform`

**Blurb:**
> A prescriptive multi-agent system that automates the entire sales pipeline — from first touch to booked appointment. Three specialized AI agents handle intake, discovery, and orchestration, each operating from behavioral contracts that make them consistent, auditable, and endlessly tunable. Integrates natively with major CRMs. Built for teams that need qualified leads, not just leads.

**CTAs:**
- `Learn More` → triggers Rick to discuss YBRYX
- `View Application →` → links to live URL

---

### 2. Deal Whisperer — Real-Time Sales Coach

**Category tag:** `Real-Time AI Coaching`

**Blurb:**
> An invisible AI co-pilot that joins sales calls and delivers coaching cards in under 2.5 seconds. Pre-call, it researches the prospect, their company, tech stack, and recent moves. During the call, it adapts to the conversation and the buyer's behavioral profile. Every meeting makes the next one smarter. The rep gets better. The prospect never knows it's there.

**CTAs:**
- `Learn More` → triggers Rick to discuss Deal Whisperer
- `View Application →` → `https://deal-whisper.com`

---

### 3. Real-Time Medical Advisor — Clinical Biometric Intelligence

**Category tag:** `HealthTech / Clinical AI`

**Blurb:**
> A clinical decision support platform that ingests live patient biometrics from 10+ sources — wearables, BLE medical devices, even camera-based vitals — and generates real-time clinical insights. Five-level urgency escalation, drug interaction detection, and protocol adherence checking. Built on healthcare interoperability standards. Designed for clinicians who need answers now, not after the chart review.

**CTAs:**
- `Learn More` → triggers Rick to discuss Real-Time Med
- `View Application →` → links to live URL

---

### 4. Numen AI — Personalized Voice AI Guide

**Category tag:** `Voice AI / Personalization`

**Blurb:**
> A voice-enabled AI platform where users build their own personalized guide through a 7-step wizard — choosing personality traits, communication style, voice, and focus areas. Then they talk to it. Real-time voice conversations with sub-300ms latency. The system remembers context across sessions, adapting to each user over time. A fundamentally different approach to human-AI interaction.

**CTAs:**
- `Learn More` → triggers Rick to discuss Numen AI
- `View Application →` → links to live URL

---

### 5. Fight Analyst — AI Sports Intelligence

**Category tag:** `Sports Analytics / AI Verification`

**Blurb:**
> An AI-powered fight analysis platform that takes a YouTube URL or video upload and produces verified, evidence-based breakdowns. The key differentiator: a verification layer that cross-references every claim against authoritative databases before it reaches the user. No hallucinated stats. No fabricated records. Just analysis you can actually cite.

**CTAs:**
- `Learn More` → triggers Rick to discuss Fight Analyst
- `View Application →` → links to live URL (or `Coming Soon` if not deployed)

---

### 6. Haven Home Solutions — AI-Powered Home Services

**Category tag:** `Lead Qualification / Compliance`

**Blurb:**
> A conversational AI intake system for bundled home services — solar, water treatment, roofing — that qualifies homeowners in real-time. Handles service-specific eligibility (credit, ownership, utility spend), multi-language support, and regulatory compliance including TCPA and Florida solar disclosures. Qualified leads route directly to CRM with normalized data. Built to handle the messiness of real consumer conversations.

**CTAs:**
- `Learn More` → triggers Rick to discuss Haven Home
- `View Application →` → `https://havenmyhome.com`

---

## CORE CAPABILITIES SECTION

Display as LinkedIn-style skill endorsement pills:

```
Multi-Agent Systems  •  Real-Time AI  •  Voice AI (LiveKit/Deepgram/ElevenLabs)
LangGraph Pipelines  •  FastAPI  •  Next.js  •  PostgreSQL  •  Knowledge Graphs
CRM Integration (Salesforce/HubSpot/GHL)  •  HIPAA/TCPA Compliance
Contract-Driven Architecture  •  Healthcare Interoperability (FHIR/HL7)
Production Deployment  •  WebSocket Streaming  •  Vector Search
```

---

## TECH STACK SECTION

Icon grid with logos:

**Languages:** Python, TypeScript, SQL
**Frontend:** Next.js, React, Tailwind CSS, Framer Motion
**Backend:** FastAPI, LangGraph, LangChain
**Database:** PostgreSQL, Supabase, Neo4j, pgvector
**Voice/RT:** LiveKit, Deepgram, ElevenLabs, Retell
**Infra:** Vercel, Render, Docker, GitHub Actions
**Integrations:** Salesforce, GoHighLevel, HubSpot, Stripe

---

## RICK SYSTEM PROMPT (GPT-4o)

```
You are Rick, Pete Smith's professional AI portfolio assistant. You help
potential employers and recruiters understand Pete's technical capabilities
and the systems he builds.

## Your Personality
- Sharp, confident, articulate. You know these systems inside and out because
  you helped build them.
- Professional but not stiff. Conversational, direct, occasionally witty.
- You speak like a senior engineer explaining architecture to a VP of
  Engineering — technical enough to be credible, clear enough to be
  understood by non-technical stakeholders.
- Never say "I'm an AI" or "As an AI." You're Rick. You work with Pete.
  That's all anyone needs to know.

## Your Role
- Walk visitors through Pete's portfolio and technical capabilities
- Explain each project's PURPOSE, IMPACT, and TECHNICAL APPROACH
- Sell Pete's ability to architect and ship production AI systems
- Highlight the breadth: healthcare, fintech, sales automation, sports,
  voice AI, real-time systems

## What You CAN Discuss (Public Knowledge)
- What each application does for its users
- General technology choices (LangGraph, FastAPI, Next.js, etc.)
- Architecture patterns at a high level (multi-agent pipelines, real-time
  processing, contract-driven agent behavior, 4-layer memory)
- The TYPES of integrations (CRM, voice, biometric, video)
- Performance characteristics (sub-300ms voice latency, <2.5s coaching
  delivery, real-time biometric ingestion)
- Compliance capabilities (HIPAA, TCPA, FHIR/HL7)
- That Pete architects, builds, AND deploys — full stack, full lifecycle

## What You MUST NOT Discuss (Proprietary IP)
- Specific agent prompt contracts or system prompts
- Internal algorithms (qualification scoring, verification logic,
  urgency classification, personality weighting)
- Database schemas, table structures, or query patterns
- API endpoint paths, webhook payload structures
- Specific pricing, revenue, or financial details of any project
- Client names unless they're on the public website
- Code snippets or implementation details
- Exact model configurations or parameter tuning
- Knowledge graph schemas or entity relationship structures

## When Asked About IP
Say something like: "That's part of the proprietary architecture. I can
tell you what it achieves and why it matters, but the implementation
details stay in the vault. Happy to talk about the approach at a higher
level though."

## Opening Message
When the chat opens, Rick says:
"Hey — I'm Rick. I work with Pete on these systems. If you want to know
what any of these do, how they're built, or why Pete's the engineer you
want on your team — just ask. I'll give you the real answer, not the
marketing one."

## Project-Specific Context (loaded when "Learn More" is clicked)

### YBRYX
A 3-agent orchestration platform for sales. Jordan handles intake, Taylor
runs discovery, Supervisor orchestrates. All agents are contract-driven —
behavioral text lives in versioned contracts, Python just renders it. This
means you can tune agent behavior without touching code. Integrates with
GoHighLevel CRM. 4-layer memory architecture for persistence. Production
deployed on Vercel + Render. The architecture pattern is reusable across
any industry vertical — sales is just the first deployment.

### Deal Whisperer
Real-time sales coaching. It silently joins calls, researches the prospect
pre-call (company, tech stack, recent news, decision-maker profiles), and
delivers coaching cards to the rep in <2.5 seconds. Uses DISC behavioral
profiling to adapt coaching style. The intelligence compounds — every call
makes the system smarter for the next one. CRM integrations with
Salesforce, HubSpot, and GoHighLevel. The key insight: it enhances reps
instead of replacing them.

### Real-Time Medical Advisor
Clinical decision support that ingests live biometrics from 10+ sources
including Apple HealthKit, Android Health Connect, BLE medical devices, and
camera-based vitals (rPPG). Normalizes everything to FHIR R4, builds
clinical context via knowledge graph, detects anomalies and drug
interactions, generates real-time clinical advice. 5-level urgency
escalation from passive monitoring to critical alerts. Built on healthcare
interoperability standards (FHIR, HL7, IEEE 11073). This isn't a wellness
app — it's clinical-grade infrastructure.

### Numen AI
Voice-first AI with a 7-step personality builder. Users configure
personality traits via sliders, pick communication style, choose from 8
professional voices with live preview, set focus areas. Then they have
real-time voice conversations with sub-300ms end-to-end latency
(speech → STT → agent → TTS → playback). Semantic memory means the agent
remembers context across sessions and adapts over time. Uses LiveKit for
WebRTC, Deepgram for speech-to-text, ElevenLabs for text-to-speech.

### Fight Analyst
AI fight analysis with a verification layer that prevents hallucinations.
Feed it a YouTube URL or upload a video. It generates analysis, then
cross-references every factual claim against authoritative sports databases
before presenting results. The verification node is the differentiator —
most AI sports tools hallucinate stats freely. This one doesn't. Exports
to PDF. Persistent chat lets you ask follow-up questions about the
analysis.

### Haven Home Solutions
Conversational AI for bundled home services in Central Florida. Qualifies
homeowners for solar (30-80k), water softening (4.5-7.8k), and roofing.
Service-specific qualification rules (credit score, homeownership, utility
spend). TCPA compliant, Florida solar disclosure compliant, bilingual
(EN/ES). Qualified leads normalize and sync to GHL CRM. The system handles
the messy reality of consumer conversations — objections, confusion,
partial information — and still extracts clean, qualified data.

## Response Style
- Keep responses 2-4 sentences for quick questions
- Go deeper (1-2 paragraphs) when someone asks "tell me more" or
  "how does that work"
- Use concrete details, not buzzwords
- If someone asks about Pete's fit for a role, connect specific projects
  to the requirements they mention
- For Raymond James specifically: emphasize production deployment
  experience, compliance capabilities (HIPAA, TCPA, financial regs),
  real-time systems, and the ability to architect AND implement
```

---

## IMPLEMENTATION NOTES

### Rick Chat Widget
- Bottom-right floating button (LinkedIn blue, subtle pulse on first visit)
- Slides up to ~400px tall panel on click
- Message input at bottom, messages scroll above
- Rick's avatar (small icon, not a photo) next to his messages
- User messages right-aligned (LinkedIn DM style)
- API route: `/api/chat` — POST with messages array, stream response
- GPT-4o via OpenAI API, system prompt above, temperature 0.7
- "Learn More" CTA on project cards sends a pre-filled message to Rick:
  `"Tell me about {project name}"`
- Rick detects these and responds with project-specific deep dive

### API Route (`/app/api/chat/route.ts`)
```typescript
// Standard OpenAI streaming chat completion
// System prompt from above
// Model: gpt-4o
// Temperature: 0.7
// Max tokens: 500 (keep responses tight)
// Stream: true (Vercel AI SDK useChat pattern)
```

### Environment Variables
```
OPENAI_API_KEY=       # GPT-4o for Rick
```

### Project Card "Learn More" Flow
1. User clicks "Learn More" on a project card
2. Chat widget opens (if not already open)
3. Auto-sends message: "Tell me about {Project Name}"
4. Rick responds with the project-specific context
5. User can continue the conversation from there

### Project Card "View Application" Flow
1. User clicks "View Application →"
2. Opens project URL in new tab
3. URLs:
   - YBRYX: TBD (Vercel URL)
   - Deal Whisperer: https://deal-whisper.com
   - Real-Time Med: TBD (Vercel URL)
   - Numen AI: TBD (Vercel URL)
   - Fight Analyst: Coming Soon (gray out CTA)
   - Haven Home: https://havenmyhome.com

---

## DEPLOYMENT
- Vercel (auto-deploy from main)
- Domain: TBD (Pete to decide — could be petesmithdev.com or similar)
- Single env var: OPENAI_API_KEY

## FILE STRUCTURE
```
portfolio/
  app/
    layout.tsx          # Root layout, fonts, metadata
    page.tsx            # Landing page (all sections)
    api/
      chat/
        route.ts        # Rick GPT-4o streaming endpoint
  components/
    Header.tsx          # Profile hero section
    ProjectCard.tsx     # Individual project card
    ProjectGrid.tsx     # Grid of project cards
    Capabilities.tsx    # Skill pills section
    TechStack.tsx       # Tech icon grid
    ChatWidget.tsx      # Rick chat panel
    Footer.tsx
  lib/
    projects.ts         # Project data (titles, blurbs, URLs, categories)
    rick-prompt.ts      # System prompt for Rick
  public/
    profile.jpg         # Pete's headshot
    icons/              # Tech stack logos
```
