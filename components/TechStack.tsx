"use client";

import { motion } from "framer-motion";
import { techStack } from "@/lib/projects";

export default function TechStack() {
  return (
    <section className="w-full bg-[#F4F2EE] py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-[#191919] mb-8">Tech Stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((category, ci) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: ci * 0.06 }}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <h3 className="text-sm font-semibold text-[#0A66C2] uppercase tracking-wider mb-3">
                {category.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="text-sm text-[#444] bg-[#F4F2EE] px-3 py-1 rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
