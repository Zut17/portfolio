import type { ReactNode } from "react";
import { motion } from "framer-motion";

export default function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-10 text-3xl font-bold">
          <span className="text-primary">{title}</span>
          <span className="text-accent">.</span>
        </h2>
        {children}
      </motion.div>
    </section>
  );
}
