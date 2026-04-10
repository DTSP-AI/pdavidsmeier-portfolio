"use client";

import { motion } from "framer-motion";
import { capabilities } from "@/lib/projects";

export default function Capabilities() {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-[#191919] mb-6">
          Core Capabilities
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {capabilities.map((cap, i) => (
            <motion.span
              key={cap}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="inline-block px-4 py-2 rounded-full bg-[#F4F2EE] text-[#191919] text-sm font-medium border border-gray-200 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
            >
              {cap}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
