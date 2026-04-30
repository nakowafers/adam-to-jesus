"use client";

import { motion } from "framer-motion";
import { AncestorNode } from "./ancestor-node";
import { DBNode } from "@/lib/db";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function LineageList({ nodes }: { nodes: DBNode[] }) {
  return (
    <motion.section 
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {nodes.map((node) => (
        <motion.div key={node.id} variants={item}>
          <AncestorNode 
            name={node.name} 
            title={node.title} 
            lineage={node.lineage} 
          />
        </motion.div>
      ))}
    </motion.section>
  );
}
