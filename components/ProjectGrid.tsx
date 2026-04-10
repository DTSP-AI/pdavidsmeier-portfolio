"use client";

import { projects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
  onLearnMore: (projectTitle: string) => void;
}

export default function ProjectGrid({ onLearnMore }: ProjectGridProps) {
  return (
    <section className="w-full bg-[#F4F2EE] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-[#191919] mb-8">What I Build</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onLearnMore={onLearnMore}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
