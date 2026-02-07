import { TextureHero } from "@/components/commerce/TextureHero";
import { ReserveForm } from "@/components/commerce/ReserveForm";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ReservePage() {
    return (
        <main className="min-h-screen bg-flour">
            <div className="max-w-4xl mx-auto py-12 px-6">
                <Link href="/" className="inline-flex items-center gap-2 text-matcha/60 hover:text-matcha mb-8 transition-colors font-bold">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
                <h1 className="font-serif text-5xl text-matcha mb-8">Reserve Your Loaf</h1>
                <p className="text-lg text-matcha/80 mb-12">
                    We bake limited quantities daily. Join the waitlist for our next drop.
                </p>

                {/* Placeholder for future Waitlist Component */}
                <ReserveForm />
            </div>
        </main>
    );
}
