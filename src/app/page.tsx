import { TextureHero } from "@/components/commerce/TextureHero";
import { LiveInventory } from "@/components/commerce/LiveInventory";

export default function Home() {
  return (
    <main className="min-h-screen bg-flour">
      {/* 1. Hero Section (Sensory) */}
      <TextureHero />

      {/* 2. Live Commerce Strip */}
      <div className="border-y border-matcha/10 py-3 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <span className="font-serif text-matcha font-bold">Slope Shokupan 🍞</span>
          <LiveInventory />
        </div>
      </div>

      {/* 3. Narrative Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-8">
        <h2 className="font-serif text-4xl md:text-5xl text-matcha italic">
          "It’s not just bread. It’s a memory."
        </h2>
        <p className="text-lg text-matcha/70 leading-relaxed font-sans">
          We wake up at 3 AM to start the tangzhong method. By 7 AM, the air in South Slope smells like caramelized milk and patience.
          Our shokupan is designed for the tear — that specific elastic pull that releases a puff of steam.
        </p>
      </section>



      {/* Footer */}
      <footer className="py-12 text-center text-matcha/40 text-sm">
        <p>&copy; 2026 Slope Shokupan. South Slope, Brooklyn.</p>
        <p className="mt-2 text-xs">A Phoenix Project.</p>
      </footer>
    </main>
  );
}
