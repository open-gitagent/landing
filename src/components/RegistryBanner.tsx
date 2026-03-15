import { motion } from "framer-motion";
import { Search } from "lucide-react";

export function RegistryBanner() {
  return (
    <section className="px-6 -mt-8 mb-8 relative z-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <a
            href="https://registry.gitagent.sh/"
            target="_blank"
            rel="noopener noreferrer"
            className="block sketch-border border-primary/50 bg-primary/5 rounded-lg p-4 sm:p-5 hover:border-primary/80 hover:bg-primary/10 transition-all group"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <div className="sm:hidden">
                  <span className="text-[10px] uppercase tracking-widest text-primary font-body font-medium">New</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="hidden sm:inline text-[10px] uppercase tracking-widest bg-primary/15 text-primary px-2 py-0.5 rounded-full font-body font-medium">New</span>
                  <h3 className="text-sm sm:text-base font-heading font-bold text-foreground">
                    Agent Registry is Live
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  Discover, share, and run community-built agents — all from a single command. Browse the registry now.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-md font-body sketch-border border-primary shrink-0 group-hover:opacity-90 transition-opacity">
                Browse Registry →
              </span>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
