import { motion, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface Props extends HTMLMotionProps<"section"> {
  children: ReactNode;
  delay?: number;
}

export function MotionSection({ children, delay = 0, ...rest }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

export function MotionItem({ children, delay = 0, ...rest }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
