"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
  onLearnMore: (projectTitle: string) => void;
  onRequestAccess: (project: Project) => void;
}

export default function ProjectCard({
  project,
  index,
  onLearnMore,
  onRequestAccess,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
      className="bg-white dark:bg-neutral-950 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col"
    >
      {/* Category tag */}
      <div className="px-5 pt-5">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#E8F0FE] dark:bg-[#0A66C2]/20 text-[#0A66C2] dark:text-[#4A9EFF]">
          {project.category}
        </span>
      </div>

      {/* Title + subtitle */}
      <div className="px-5 pt-3">
        <h3 className="text-xl font-bold text-[#191919] dark:text-white">{project.title}</h3>
        <p className="text-sm text-[#666] dark:text-neutral-400 mt-0.5">{project.subtitle}</p>
      </div>

      {/* Blurb */}
      <p className="px-5 pt-3 pb-4 text-sm text-[#444] dark:text-neutral-300 leading-relaxed flex-1">
        {project.blurb}
      </p>

      {/* CTAs */}
      <div className="px-5 pb-5 flex items-center gap-3 border-t border-gray-100 dark:border-neutral-800 pt-4">
        <button
          onClick={() => onLearnMore(project.title)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors cursor-pointer"
        >
          Learn More
        </button>
        {project.comingSoon ? (
          <span className="text-sm text-[#999] dark:text-neutral-500">Coming Soon</span>
        ) : project.gated ? (
          <button
            onClick={() => onRequestAccess(project)}
            className="text-sm font-medium text-[#0A66C2] hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <span aria-hidden>🔒</span> Request Access &rarr;
          </button>
        ) : project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#0A66C2] hover:underline"
          >
            View Application &rarr;
          </a>
        ) : null}
      </div>
    </motion.div>
  );
}
