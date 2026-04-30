import { motion } from "framer-motion";

interface AncestorNodeProps {
  name: string;
  title: string;
  lineage: 'royal' | 'biological';
}

export function AncestorNode({ name, title, lineage }: AncestorNodeProps) {
  const color = lineage === 'royal' ? 'border-amber-500' : 'border-emerald-500';
  const glow = lineage === 'royal' ? 'shadow-amber-500/10' : 'shadow-emerald-500/10';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-lg border bg-zinc-900 ${color} shadow-lg ${glow}`}
    >
      <h3 className="font-semibold text-zinc-100">{name}</h3>
      <p className="text-xs text-zinc-400">{title}</p>
    </motion.div>
  );
}
