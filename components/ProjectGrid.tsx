"use client";

import { useEffect, useState } from "react";
import { projects, type Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";
import AccessGateModal from "./AccessGateModal";

interface ProjectGridProps {
  onLearnMore: (projectTitle: string) => void;
}

export default function ProjectGrid({ onLearnMore }: ProjectGridProps) {
  const [gateProject, setGateProject] = useState<Project | null>(null);
  const [gateOpen, setGateOpen] = useState(false);

  // Auto-open the gate modal when redirected here from a gated app's
  // middleware (e.g. ?requestAccessFor=deal-whisperer). Strip the query
  // afterwards so reloads don't re-open it. Run after paint to satisfy
  // the no-set-state-in-effect rule (we're triggering a UI side effect
  // from a pure URL read, not derived state).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("requestAccessFor");
    if (!requested) return;
    const match = projects.find((p) => p.id === requested && p.gated);
    if (!match) return;
    const id = window.requestAnimationFrame(() => {
      setGateProject(match);
      setGateOpen(true);
      params.delete("requestAccessFor");
      const newSearch = params.toString();
      const newUrl =
        window.location.pathname + (newSearch ? `?${newSearch}` : "");
      window.history.replaceState({}, "", newUrl);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  function handleRequestAccess(project: Project) {
    setGateProject(project);
    setGateOpen(true);
  }

  function handleClose() {
    setGateOpen(false);
  }

  return (
    <>
      <section className="w-full bg-[#F4F2EE] dark:bg-neutral-900 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#191919] dark:text-white mb-8">What I Build</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onLearnMore={onLearnMore}
                onRequestAccess={handleRequestAccess}
              />
            ))}
          </div>
        </div>
      </section>
      <AccessGateModal
        open={gateOpen}
        project={gateProject}
        onClose={handleClose}
      />
    </>
  );
}
