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
            தமிழின் செழுமையையும் கல்லூரி மாணவர்களின் படைப்பாற்றலையும் வெளிப்படுத்தும்
            நோக்கில் தியாகராசர் பொறியியல் கல்லூரி{' '}
            <span className="text-gold font-bold">
              தமிழ் மன்றம்
            </span>{' '}
            சார்பில் &ldquo;சித்திரைச் சாரல்&rdquo; நடத்தப்படுகிறது. இந்நிகழ்வு
            கல்லூரி மாணவர்களுக்காக நடத்தப்படும் தமிழ்த்திறன் போட்டிகளின்
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
          <div className="mt-6 border-t border-[#D4AF37]/30 pt-6 max-w-6xl mx-auto text-left">
            <div>
              <h3 className="text-gold text-base sm:text-lg font-bold mb-3">
                தமிழ் மன்ற ஒருங்கிணைப்பாளர்கள்
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-[#FFF5E1] text-sm sm:text-base font-semibold leading-relaxed">
                <li>பேரா. ம. பாபு, து.நி.ஒ, தமிழ்த்துறை</li>
                <li>முனைவர். பெ. சிவக்குமார், து.நி.ஒ, இயற்பியல்</li>
              </ul>

              <h3 className="text-gold text-base sm:text-lg font-bold mt-5 mb-3">
                சிருட்டி கலைக்குழும கல்லூரி நிலை ஒருங்கிணைப்பாளர்கள்
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-[#FFF5E1] text-sm sm:text-base font-semibold leading-relaxed">
                <li>முனைவர். ஆ. அனிதா, க.நி.ஒ, கணிதவியல்</li>
                <li>முனைவர். ப. மோ. தேவி, க.நி.ஒ, மின் மற்றும் மின்னணுவியல்</li>
              </ul>
            </div>

            <div className="border-t border-[#D4AF37]/30 mt-6 mb-4" />

            <p className="text-[#D4AF37] font-semibold text-base mt-6 mb-4 text-center">
              மேலும் விவரங்களுக்கு
            </p>

            <div className="max-w-xl mx-auto">
              <h3 className="text-gold text-base sm:text-lg font-bold mb-3 text-center md:text-left">
                மாணவ ஒருங்கிணைப்பாளர்கள்
              </h3>
              <ul className="list-disc pl-6 space-y-3 text-[#FFF5E1] text-sm sm:text-base font-semibold leading-relaxed">
                <li>பெரியண்ணா மு - 9952712101</li>
                <li>சுபநிதி சுப்பிரமணி ச - 7092484534</li>
                <li>ஸ்ரீநிவாஸ் கேசவன் - 87543 83307</li>
                <li>பாலதர்ஷினி ரா - 75300 63405</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#D4AF37]/30">
            <div className="flex justify-center gap-3 mb-4 animate-gold-pulse">
              {['✦', '◆', '✦'].map((sym, i) => (
                <span key={i} className="text-gold text-lg">
                  {sym}
                </span>
              ))}
            </div>
            <p className="text-gold font-bold text-lg mb-1">
              சித்திரைச் சாரல்
            </p>
            <p className="text-sm text-[#ccc] mb-2">
              தமிழ் மன்றம்
            </p>
            <p className="text-xs text-[#aaa]">
              தியாகராசர் பொறியியல் கல்லூரி, மதுரை – 625015
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
