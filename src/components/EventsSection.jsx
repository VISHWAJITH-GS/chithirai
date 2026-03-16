import { motion } from 'framer-motion';
import CircularGallery from './CircularGallery';
import eventsData from '../data/eventsData';

export default function EventsSection({ onEventClick }) {
  return (
    <section className="py-16 bg-transparent relative overflow-hidden">
      {/* Faint background kolam grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle, #3E2723 1.5px, transparent 1.5px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 px-4"
        >
          {/* Decorative top ornament */}
          <div className="flex justify-center gap-4 mb-5 animate-gold-pulse">
            {['✦', '◈', '✦'].map((sym, i) => (
              <span key={i} className="text-gold text-xl">
                {sym}
              </span>
            ))}
          </div>

          <h2 className="section-title mb-3">நடைபெறும் போட்டிகள்</h2>

          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-gold text-base">◆</span>
            <span className="flex-1 max-w-[100px] h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <p className="text-[#5A3A1B]/70 text-sm mt-4 max-w-lg mx-auto leading-7">
            போட்டியை தேர்வு செய்து கிளிக் செய்யுங்கள் — விதிகள் மற்றும் பதிவு
            செய்வதற்கான கட்டம் திறக்கும்.
          </p>
        </motion.div>

        {/* WebGL gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full"
        >
          <CircularGallery
            items={eventsData}
            bend={1.2}
            textColor="#D4AF37"
            borderRadius={0.05}
            onEventClick={onEventClick}
          />
        </motion.div>

        {/* Event cards fallback — always-visible below gallery for accessibility */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap justify-center gap-6 mt-12 px-4 max-w-5xl mx-auto"
        >
          {eventsData.map((event, i) => (
            <motion.button
              key={event.id}
              onClick={() => onEventClick(event)}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center gap-4 px-8 py-4 bg-[#3E2723] text-[#FFF5E1] rounded-2xl border-2 border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-[#5A3A1B] transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/20"
            >
              {/* Ordinal dot */}
              <span className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#3E2723] text-sm font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="font-semibold text-base">{event.title}</span>
              <svg
                className="w-5 h-5 text-[#D4AF37] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
