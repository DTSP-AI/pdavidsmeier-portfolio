"use client";

import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.5, delay },
});

const layers = [
  {
    name: "Hot Cache",
    latency: "~0ms",
    desc: "Request-scoped Python dict. Instant reads, zero overhead. Cleared at end of request lifecycle — no cross-session leakage.",
    color: "bg-red-500",
    barWidth: "w-full",
  },
  {
    name: "Local SQLite",
    latency: "~5ms",
    desc: "Persistent local cache that survives process restarts. Eliminates cold-start penalties across deployments.",
    color: "bg-orange-500",
    barWidth: "w-[85%]",
  },
  {
    name: "Vector Store",
    latency: "~100ms",
    desc: "Semantic search layer for similarity matching across conversations and entities. Powers contextual recall and knowledge graph traversal.",
    color: "bg-[#0A66C2]",
    barWidth: "w-[60%]",
  },
  {
    name: "PostgreSQL",
    latency: "~50ms",
    desc: "Single source of truth. All writes land here first. Everything else is a cache. On conflict, PostgreSQL wins. Always.",
    color: "bg-indigo-700",
    barWidth: "w-[70%]",
  },
];

const graphFeatures = [
  {
    title: "Entity Resolution",
    desc: "Contacts, companies, and deals are linked through bidirectional ontological relationships — not flat foreign keys.",
  },
  {
    title: "Write-Through Architecture",
    desc: "Every write hits PostgreSQL first, then propagates up through cache layers. Reads cascade down: hot cache, local, vector, then source of truth.",
  },
  {
    title: "Contextual Recall",
    desc: "Agents don't just retrieve data — they traverse the graph to understand relationships, history, and relevance before generating a response.",
  },
  {
    title: "Session Isolation",
    desc: "Hot cache is request-scoped. No conversation bleeds into another. Each session gets its own memory context, built fresh from the graph.",
  },
];

interface MemorySectionProps {
  videoSrc?: string;
}

export default function MemorySection({ videoSrc }: MemorySectionProps) {
  return (
    <section className="w-full bg-[#F4F2EE] dark:bg-neutral-900 py-12 md:py-16 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div {...fadeUp(0)}>
          <h2 className="text-2xl font-bold text-[#191919] dark:text-white mb-2">
            4-Layer Memory & Knowledge Graphs
          </h2>
          <p className="text-[#666] dark:text-neutral-400 mb-10 max-w-2xl">
            Every agent system I build has the same memory backbone — a
            write-through architecture with PostgreSQL as the single source of
            truth and three progressively faster cache layers above it. Context
            isn't retrieved, it's <em>constructed</em> from a living graph.
          </p>
        </motion.div>

        {/* Video player */}
        <motion.div
          {...fadeUp(0.1)}
          className="mb-10 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-sm bg-black aspect-video"
        >
          {videoSrc ? (
            <video
              src={videoSrc}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                </svg>
                <p className="text-sm">Memory architecture walkthrough</p>
                <p className="text-xs text-gray-400 mt-1">Video coming soon</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* 4-Layer visualization */}
        <div className="mb-10">
          <motion.h3 {...fadeUp(0.15)} className="text-lg font-bold text-[#191919] dark:text-white mb-5">
            The Memory Stack
          </motion.h3>
          <div className="space-y-4">
            {layers.map((layer, i) => (
              <motion.div key={layer.name} {...fadeUp(0.2 + i * 0.08)}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${layer.color}`} />
                    <span className="text-sm font-semibold text-[#191919] dark:text-white">
                      {layer.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#0A66C2]">
                    {layer.latency}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-1.5 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                    className={`h-1.5 rounded-full ${layer.color} ${layer.barWidth}`}
                    style={{ maxWidth: layer.barWidth === "w-full" ? "100%" : undefined }}
                  />
                </div>
                <p className="text-xs text-[#666] dark:text-neutral-400 leading-relaxed">{layer.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Knowledge graph features */}
        <motion.h3 {...fadeUp(0.5)} className="text-lg font-bold text-[#191919] dark:text-white mb-5">
          Knowledge Graph Construction
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {graphFeatures.map((feat, i) => (
            <motion.div
              key={feat.title}
              {...fadeUp(0.55 + i * 0.08)}
              className="bg-white dark:bg-neutral-950 rounded-xl border border-gray-200 dark:border-neutral-800 p-5"
            >
              <h4 className="text-sm font-bold text-[#191919] dark:text-white mb-1.5">
                {feat.title}
              </h4>
              <p className="text-xs text-[#666] dark:text-neutral-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
