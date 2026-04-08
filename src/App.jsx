import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventsSection from './components/EventsSection';
import EventModal from './components/EventModal';
import Kaviarangam from './components/Kaviarangam';
import MouseTrailEffect from './components/MouseTrailEffect';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="min-h-screen bg-parchment font-tamil relative">
      <MouseTrailEffect />

      {/* Fixed Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="hero" className="scroll-mt-24">
          <Hero />
        </section>

        {/* Gold divider */}
        <div className="gold-divider" />

        {/* About Section */}
        <section
          id="about"
          className="scroll-mt-24 py-14 px-4 max-w-3xl mx-auto text-center"
        >
          <p className="text-lg leading-9 text-[#5A3A1B] font-medium">
            தமிழின் செழுமையையும் மாணவர்களின் படைப்பாற்றலையும் வெளிப்படுத்தும்
            நோக்கில் தியாகராசர் பொறியியல் கல்லூரி{' '}
            <span className="text-gold font-bold">
              TCE சிருட்டி கலை குழுமம்
            </span>{' '}
            சார்பில் &ldquo;சித்திரை சாரல்&rdquo; நடத்தப்படுகிறது. இந்நிகழ்வு
            கல்லூரி மாணவர்களுக்காக நடத்தப்படும் தமிழ் திறன் போட்டிகளின்
            தொகுப்பாகும்.
          </p>

          {/* Decorative kolam dots */}
          <div className="flex justify-center gap-3 mt-8 animate-gold-pulse">
            {['✦', '◆', '✦'].map((sym, i) => (
              <span key={i} className="text-gold text-xl">
                {sym}
              </span>
            ))}
          </div>
        </section>

        {/* Gold divider */}
        <div className="gold-divider" />

        {/* Competitions Section */}
        <section id="events" className="scroll-mt-24">
          <EventsSection onEventClick={setSelectedEvent} />
        </section>

        {/* Gold divider */}
        <div className="gold-divider" />

        {/* Kaviarangam Section */}
        <section id="kaviarangam" className="scroll-mt-24">
          <Kaviarangam />
        </section>

        {/* Footer */}
        <footer className="bg-[#3E2723] text-[#FFF5E1] py-8 px-4 text-center">
          <div className="flex justify-center gap-3 mb-4 animate-gold-pulse">
            {['✦', '◆', '✦'].map((sym, i) => (
              <span key={i} className="text-gold text-lg">
                {sym}
              </span>
            ))}
          </div>
          <p className="text-gold font-bold text-lg mb-1">
            சித்திரை சாரல்
          </p>
          <p className="text-sm text-[#ccc] mb-2">
            TCE சிருட்டி கலை குழுமம்
          </p>
          <p className="text-xs text-[#aaa]">
            தியாகராசர் பொறியியல் கல்லூரி, மதுரை – 625015
          </p>

          <div className="mt-6 border-t border-[#D4AF37]/30 pt-5 max-w-xl mx-auto">
            <p className="text-[#D4AF37] font-semibold text-base mb-2">
              For Further Details
            </p>
            <p className="text-sm text-[#ddd]">
              Student Coordinator: Vignesh S - +91 98765 43210
            </p>
            <p className="text-sm text-[#ddd]">
              Student Coordinator: Keerthana R - +91 91234 56789
            </p>
          </div>
        </footer>
      </main>

      {/* Event Rules Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
