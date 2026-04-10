"use client";

import { useCallback } from "react";
import Header from "@/components/Header";
import ProjectGrid from "@/components/ProjectGrid";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import MemorySection from "@/components/MemorySection";
import SecuritySection from "@/components/SecuritySection";
import Capabilities from "@/components/Capabilities";
import TechStack from "@/components/TechStack";
import ChatWidget from "@/components/ChatWidget";
import Footer from "@/components/Footer";

export default function Home() {
  const handleLearnMore = useCallback((projectTitle: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn = (window as any).__rickChat;
    if (typeof fn === "function") {
      (fn as (t: string) => void)(projectTitle);
    }
  }, []);

  return (
    <>
      <Header />
      <ProjectGrid onLearnMore={handleLearnMore} />
      <ArchitectureDiagram />
      <MemorySection videoSrc="/video_clips/KG Example-highlight.mp4" />
      <SecuritySection videoSrc="/video_clips/Med-Prompt-Inject.mp4" />
      <Capabilities />
      <TechStack />
      <Footer />
      <ChatWidget />
    </>
  );
}
