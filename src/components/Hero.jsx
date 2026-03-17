import { motion } from 'framer-motion';
import DotGrid from './DotGrid';

const textVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.7, ease: 'easeOut' },
  }),
};

export default function Hero() {
  return (
    <section
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-transparent pt-20"
    >
      {/* Dot grid is intentionally scoped to Hero only */}
      <div
        className="absolute inset-0"
        style={{ opacity: 0.9 }}
        aria-hidden="true"
      >
        <DotGrid
          dotSize={6}
          gap={18}
          baseColor="#7A4E1D"
          activeColor="#FFD56B"
          proximity={185}
          shockRadius={320}
        />
      </div>

      {/* Hero gradient scrim keeps text readable over the local DotGrid */}
      <div className="hero-gradient absolute inset-0 pointer-events-none" />

      {/* Logos container — centered at top */}
      <div className="relative z-10 mt-4 sm:mt-0 sm:absolute sm:top-12 sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center gap-4 sm:gap-10 pointer-events-none">
        {/* Tamil Mandram logo */}
        <motion.img
          src="/assets/tamil-mandram-logo.png"
          alt="Tamil Mandram logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="w-12 h-12 sm:w-20 sm:h-20 object-contain"
        />

        {/* Sithirai logo — centered */}
        <motion.img
          src="/assets/sithirai-white-bg-logo.png"
          alt="சித்திரை"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="w-24 h-24 sm:w-44 sm:h-44 object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-8 sm:pt-24 pb-12 sm:pb-16">
        {/* Top emblem decoration */}
        <motion.div
          custom={0}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center gap-5 mb-6"
        >
          {['. ', '. ', '. '].map((sym, i) => (
            <span
              key={i}
              className="text-gold text-2xl animate-gold-pulse"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              {sym}
            </span>
          ))}
        </motion.div>

        {/* Organisation name */}
        <motion.p
          custom={1}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-[#5A3A1B] text-sm sm:text-base font-semibold tracking-[0.15em] uppercase mb-2"
        >
          TCE சிருட்டி கலைக் குழுமம் தமிழ் மன்றம் நடத்தும்
        </motion.p>

        {/* College banner — full-width, blends with background */}
        <motion.div
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-4 mb-6 w-full"
        >
          <img
            src="/assets/tce-banner.png"
            alt="தியாகராசர் பொறியியல் கல்லூரி"
            className="w-full max-w-[92vw] sm:max-w-3xl h-14 sm:h-24 object-contain sm:object-cover object-center"
          />


        </motion.div>

        {/* Main title */}
        <motion.h1
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-2"
        >
          <span className="text-shimmer">சித்திரை</span>
        </motion.h1>

        {/* Decorative gold rule */}
        <motion.div
          custom={4}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center gap-4 my-5"
        >
          <span className="flex-1 max-w-[120px] h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <span className="text-gold text-lg">◆</span>
          <span className="flex-1 max-w-[120px] h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </motion.div>

        {/* Location & Time */}
        <motion.p
          custom={5}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-[#3E2723]/80 text-sm sm:text-base leading-8 mb-8"
        >
          தியாகராசர் பொறியியல் கல்லூரி, மதுரை – 625015
          <br />
          <span className="text-[#7B1E1E] font-semibold">
            காலை 10:00 – மதியம் 12:00
          </span>
          &nbsp;|&nbsp;
          <span className="text-[#5A3A1B]">பிற கல்லூரி மாணவர்கள்</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={6}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document
                .getElementById('events')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] text-[#3E2723] font-bold rounded-xl shadow-lg hover:bg-[#c9a530] transition-colors"
          >
            போட்டிகளை காண்க
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document
                .getElementById('kaviarangam')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="w-full sm:w-auto px-8 py-3.5 border-2 border-[#3E2723] text-[#3E2723] font-bold rounded-xl hover:bg-[#3E2723] hover:text-[#D4AF37] transition-colors"
          >
            கவியரங்கம்
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: [0, 1, 0], y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 2 }}
          className="mt-16 flex flex-col items-center gap-1 text-[#5A3A1B]/60 text-xs"
        >
          <span>கீழே உருட்டவும்</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
