import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

const scheduleItems = [
  { time: '2:00', label: 'தமிழ்த்தாய் வாழ்த்து' },
  { time: '2:05', label: 'முதல்வர் உரை' },
  { time: '2:15', label: 'வரவேற்புரை' },
  { time: '2:25', label: 'விருந்தினர் உரை' },
  { time: '2:50', label: 'மேடை கவிதை வாசிப்பு' },
  { time: '3:30', label: 'பரிசளிப்பு' },
  { time: '3:50', label: 'நன்றியுரை' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

/* ─── The interactive timeline card ─────────────────────────────────────── */
function TimelineCard() {
  const cardRef = useRef(null);

  /* Raw mouse position (normalised -0.5 → +0.5 relative to card) */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  /* Smooth spring — gives that "lagging behind" feel */
  const springCfg = { stiffness: 200, damping: 22, mass: 0.6 };
  const smoothX = useSpring(rawX, springCfg);
  const smoothY = useSpring(rawY, springCfg);

  /* 3-D tilt (subtle — ±5 deg) */
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ['-5deg', '5deg']);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], ['4deg', '-4deg']);

  /* Gold spotlight position inside the card */
  const glowX = useTransform(smoothX, [-0.5, 0.5], ['15%', '85%']);
  const glowY = useTransform(smoothY, [-0.5, 0.5], ['15%', '85%']);

  /* Dynamic gradient background that follows cursor */
  const glowBg = useTransform(
    [glowX, glowY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(212,175,55,0.18), transparent 60%)`,
  );

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: '900px',
      }}
      className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 px-6 py-6 cursor-default no-mouse-trail"
      /* Semi-transparent bg so the section bg shows through */
      /* We keep the dark card bg intact */
    >
      {/* ── Inner dark card background ── */}
      <div className="absolute inset-0 rounded-2xl bg-[#FFF5E1]/5" />

      {/* ── Gold spotlight that tracks the cursor ── */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: glowBg }}
      />

      {/* ── Subtle edge shimmer ── */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.35)',
        }}
      />

      {/* ── Timeline rows ── */}
      <div className="relative z-10">
        {scheduleItems.map((item, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ x: 6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="kavi-timeline-item group"
          >
            {/* Dot — glows gold on row hover */}
            <div className="kavi-timeline-dot group-hover:scale-125 group-hover:shadow-[0_0_8px_#D4AF37] transition-all duration-200" />

            <div className="flex items-center gap-4">
              <span className="text-[#D4AF37] text-xs font-bold w-10 shrink-0 tabular-nums">
                {item.time}
              </span>
              <span className="text-[#FFF5E1] text-base font-medium leading-7 group-hover:text-[#D4AF37] transition-colors duration-200">
                {item.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */
export default function Kaviarangam() {
  return (
    <section className="py-16 px-4 bg-[#3E2723] relative overflow-hidden">
      {/* Background dot pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #D4AF37 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center gap-3 mb-4 animate-gold-pulse">
            {['✦', '◆', '✦'].map((sym, i) => (
              <span key={i} className="text-[#D4AF37] text-xl">
                {sym}
              </span>
            ))}
          </div>

          <h2 className="text-shimmer text-3xl sm:text-4xl font-bold mb-3">
            கவியரங்கம்
          </h2>

          <div className="gold-divider my-4" />

          {/* Venue & Time */}
          <div className="inline-flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2">
            <div className="flex items-center justify-center gap-2 text-[#FFF5E1]">
              <svg
                className="w-4 h-4 text-[#D4AF37] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                இடம் :{' '}
                <span className="text-[#D4AF37]">KS Auditorium</span>
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#FFF5E1]">
              <svg
                className="w-4 h-4 text-[#D4AF37] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                நேரம் :{' '}
                <span className="text-[#D4AF37]">2:00 – 4:00</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Interactive timeline card */}
        <TimelineCard />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 text-center text-[#FFF5E1]/85 text-sm"
        >
          கவியரங்கம் பதிவு தற்போது முடிக்கப்பட்டுள்ளது.
        </motion.p>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-3 mt-8 animate-gold-pulse"
        >
          {['✦', '◆', '✦'].map((sym, i) => (
            <span key={i} className="text-[#D4AF37] text-xl">
              {sym}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
