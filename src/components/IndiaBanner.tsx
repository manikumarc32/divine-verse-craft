import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function IndiaBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-saffron text-primary-foreground"
    >
      <div className="container py-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center text-sm">
        <span className="text-xl">🇮🇳</span>
        <p className="font-medium">Coming Soon to India — local printing, INR pricing, UPI payments.</p>
        <Link
          to="/india"
          className="underline underline-offset-4 font-semibold hover:opacity-90"
        >
          Join the waitlist →
        </Link>
      </div>
    </motion.section>
  );
}
