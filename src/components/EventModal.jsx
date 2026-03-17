import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const overlayVariants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(5px)',
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 46,
    rotateX: -5,
    transformPerspective: 1200,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 26,
      mass: 0.9,
      when: 'beforeChildren',
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 34,
    rotateX: 4,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
};

export default function EventModal({ event, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-5xl max-h-[95svh] md:max-h-[90vh] overflow-hidden bg-[#FFF5E1] rounded-2xl shadow-2xl border-2 border-[#D4AF37]"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-20 text-[#D4AF37] hover:text-white text-2xl leading-none w-10 h-10 flex items-center justify-center rounded-full bg-[#3E2723]/90 hover:bg-[#5A3A1B] transition-colors"
            aria-label="Close"
          >
            ×
          </button>

          <div className="grid md:grid-cols-[minmax(260px,0.92fr)_1fr] h-full max-h-[95svh] md:max-h-[90vh]">
            {/* Left visual card panel */}
            <motion.div
              variants={sectionVariants}
              className="relative min-h-[260px] md:min-h-full bg-[#3E2723]"
            >
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0D]/85 via-[#3E2723]/25 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="text-[#D4AF37] text-[11px] mb-1.5 font-semibold tracking-[0.22em] uppercase">
                  Thiagarajar College of Engineering
                </p>
                <h2 className="text-[#FFF5E1] text-xl md:text-2xl font-bold leading-snug pr-8">
                  {event.title}
                </h2>
              </div>
            </motion.div>

            {/* Right details panel — flex column with floating button */}
            <div className="flex flex-col h-full max-h-[95svh] md:max-h-[90vh]">
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-5 md:px-7 py-6 md:py-7 space-y-5 pb-72 md:pb-24">
              <motion.div variants={sectionVariants}>
                <h3 className="flex items-center gap-2 text-[#7B1E1E] font-bold text-base mb-3">
                  <span className="text-gold">◆</span> தலைப்புகள்
                </h3>
                <ul className="space-y-2">
                  {event.topics.map((topic, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[#3E2723] text-sm leading-7"
                    >
                      <span className="text-gold mt-1 shrink-0">›</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={sectionVariants} className="gold-divider" />

              <motion.div variants={sectionVariants}>
                <h3 className="flex items-center gap-2 text-[#7B1E1E] font-bold text-base mb-3">
                  <span className="text-gold">◆</span> விதிமுறைகள்
                </h3>
                <ul className="space-y-2">
                  {event.rules.map((rule, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[#3E2723] text-sm leading-7"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#3E2723] text-[#D4AF37] text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {event.evaluation && event.evaluation.length > 0 && (
                <>
                  <motion.div variants={sectionVariants} className="gold-divider" />
                  <motion.div variants={sectionVariants}>
                    <h3 className="flex items-center gap-2 text-[#7B1E1E] font-bold text-base mb-3">
                      <span className="text-gold">◆</span> மதிப்பீட்டு அளவுகோல்கள்
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {event.evaluation.map((item, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-[#3E2723]/10 border border-[#D4AF37]/40 rounded-full text-[#3E2723] text-xs font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}

              <motion.div variants={sectionVariants} className="gold-divider" />
              </div>

              {/* Floating register button at bottom */}
              <motion.div variants={sectionVariants} className="sticky bottom-0 z-10 bg-gradient-to-t from-[#FFF5E1] via-[#FFF5E1] to-transparent pt-4 pb-6 md:pb-4 px-5 md:px-7 border-t border-[#D4AF37]/20 flex justify-center md:justify-start">
                <motion.a
                  href={event.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full md:w-auto inline-flex items-center justify-center md:justify-start gap-2 bg-[#D4AF37] text-[#3E2723] font-bold text-base px-8 py-3.5 rounded-xl shadow-lg hover:bg-[#c9a530] transition-colors duration-200"
                >
                  <span>பதிவு செய்ய</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
