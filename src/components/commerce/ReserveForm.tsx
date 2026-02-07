"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { Calendar, ShoppingBag, Truck, ChevronRight, ChevronDown, Minus, Plus, User, Mail, Phone, CreditCard, MessageSquare } from "lucide-react";

type Fulfillment = "pickup" | "delivery";

const PRICES = {
    Classic: 14,
    Specialty: 18
};

// Legacy Backend URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyf22NCc5Zwl1xPjrYkQCQMGnRAc00X0XO_l91AUir29lS1f5tScm9hoBCIgmdjVAXc/exec";

export const ReserveForm = () => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    // Cart State
    const [cart, setCart] = useState({
        Classic: 0,
        Specialty: 0
    });

    // Fulfillment State
    const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
    const [selectedDate, setSelectedDate] = useState<string>("");

    // Contact State - Venmo Removed
    const [contact, setContact] = useState({
        name: "",
        email: "",
        phone: "",
        notes: ""
    });

    const updateCart = (type: "Classic" | "Specialty", delta: number) => {
        setCart(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + delta)
        }));
    };

    const breadCount = cart.Classic + cart.Specialty;
    const isFreeDelivery = breadCount >= 3;
    const subtotal = (cart.Classic * PRICES.Classic) + (cart.Specialty * PRICES.Specialty);
    const deliveryFee = fulfillment === "delivery" ? (isFreeDelivery ? 0 : 6) : 0;
    const total = subtotal + deliveryFee;

    const getDates = (type: Fulfillment) => {
        const dates = [];
        const today = new Date();
        const fourWeeksFromNow = new Date();
        fourWeeksFromNow.setDate(today.getDate() + 28);

        // Pickup: Tuesday (2) and Sunday (0)
        // Delivery: Saturday (6)
        const targetDays = type === "pickup" ? [2, 0] : [6];

        for (let d = new Date(today); d <= fourWeeksFromNow; d.setDate(d.getDate() + 1)) {
            if (targetDays.includes(d.getDay())) {
                const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
                const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                // Format: "Tuesday, Feb 13"
                const label = `${dayName}, ${monthDay}`;
                const id = d.toISOString().split('T')[0]; // YYYY-MM-DD

                let time = "";
                if (type === "pickup") {
                    time = d.getDay() === 2 ? "9am - 2pm" : (d.getDay() === 0 ? "9am - 2pm" : "");
                } else {
                    time = "Delivery Window: 10am - 4pm";
                }

                dates.push({ id, label, time });
            }
        }
        return dates;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitStatus("idle");

        // Construct Payload matching legacy schema where possible
        const fulfillmentValue = `${fulfillment}_${selectedDate}`;

        const payload = {
            type: "order",
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            notes: contact.notes,
            classic: cart.Classic,
            matcha: cart.Specialty,
            fulfillment: fulfillmentValue,
            total: total,
            _gotcha: ""
        };

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(payload),
                headers: { "Content-Type": "text/plain;charset=utf-8" },
            });

            setSubmitStatus("success");
            setStep(5); // Success Step

        } catch (error) {
            console.error("Submission Error:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === 5) {
        return (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-matcha/20 max-w-2xl mx-auto text-center py-16 space-y-6">
                <div className="w-20 h-20 bg-matcha rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
                    <ShoppingBag size={40} />
                </div>
                <h2 className="font-serif text-4xl text-matcha">Order Received!</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    Thank you, {contact.name}. We've received your reservation. Check your email (<b>{contact.email}</b>) for confirmation details.
                </p>
                <div className="p-4 bg-flour rounded-xl inline-block text-left mx-auto">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Payment Reminders</p>
                    <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Venmo: <b>@ShokupanSlope</b></li>
                        <li>• Cash: Accepted upon {fulfillment}</li>
                    </ul>
                </div>
                <button onClick={() => window.location.reload()} className="block mx-auto text-matcha underline hover:text-matcha-dark font-bold mt-8">
                    Place Another Order
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-flour-50 max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={clsx("h-1 flex-1 rounded-full transition-colors", step >= i ? "bg-matcha" : "bg-gray-100")} />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Build Order */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h2 className="font-serif text-3xl text-matcha">Build Your Order</h2>
                        <div className="space-y-4">
                            {/* Classic Row */}
                            <div className={clsx("p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center gap-4", cart.Classic > 0 ? "border-matcha bg-matcha/5" : "border-gray-100")}>
                                <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                                    <img src="/classic-shokupan.png" alt="Classic Loaf" className="w-24 h-24 object-cover rounded-xl" />
                                    <div className="flex-1">
                                        <span className="block font-serif text-xl mb-1 text-matcha">Classic Shokupan</span>
                                        <span className="block text-sm text-gray-500 mb-2">${PRICES.Classic}.00 / loaf</span>
                                        <p className="text-xs text-gray-400">Cloud-like Hokkaido milk bread.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                    <button onClick={() => updateCart("Classic", -1)} className="w-10 h-10 rounded-full bg-white border flex items-center justify-center hover:bg-gray-50 disabled:opacity-50" disabled={cart.Classic === 0}>
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-6 text-center font-mono text-lg font-bold">{cart.Classic}</span>
                                    <button onClick={() => updateCart("Classic", 1)} className="w-10 h-10 rounded-full bg-white border flex items-center justify-center hover:bg-gray-50">
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Specialty Row */}
                            <div className={clsx("p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center gap-4", cart.Specialty > 0 ? "border-matcha bg-matcha/5" : "border-gray-100")}>
                                <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                                    <img src="/matcha-shokupan.png" alt="Specialty Loaf" className="w-24 h-24 object-cover rounded-xl" />
                                    <div className="flex-1">
                                        <span className="block font-serif text-xl mb-1 text-matcha">Weekly Specialty</span>
                                        <span className="block text-sm text-gray-500 mb-2">${PRICES.Specialty}.00 / loaf</span>
                                        <p className="text-xs text-gray-400 max-w-[200px]">
                                            Flavor rotates weekly. <br />
                                            <span className="font-bold text-matcha/80">Current: Kyoto Matcha Swirl</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                    <button onClick={() => updateCart("Specialty", -1)} className="w-10 h-10 rounded-full bg-white border flex items-center justify-center hover:bg-gray-50 disabled:opacity-50" disabled={cart.Specialty === 0}>
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-6 text-center font-mono text-lg font-bold">{cart.Specialty}</span>
                                    <button onClick={() => updateCart("Specialty", 1)} className="w-10 h-10 rounded-full bg-white border flex items-center justify-center hover:bg-gray-50">
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-flour rounded-xl">
                            <span className="font-bold text-matcha">Subtotal</span>
                            <span className="font-mono text-xl text-matcha">${subtotal}.00</span>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            disabled={breadCount === 0}
                            className="w-full bg-matcha text-flour py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-matcha-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next Step <ChevronRight size={18} />
                        </button>
                    </motion.div>
                )}

                {/* Step 2: Fulfillment */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h2 className="font-serif text-3xl text-matcha">How to get it</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => { setFulfillment("pickup"); setSelectedDate(""); }}
                                className={clsx(
                                    "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                                    fulfillment === "pickup" ? "border-matcha bg-matcha/5 text-matcha" : "border-gray-100 text-gray-400"
                                )}
                            >
                                <ShoppingBag size={24} />
                                <span className="font-bold">Pickup</span>
                                <span className="text-xs text-center">739 Sixth Ave<br />(Free)</span>
                            </button>
                            <button
                                onClick={() => { setFulfillment("delivery"); setSelectedDate(""); }}
                                className={clsx(
                                    "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                                    fulfillment === "delivery" ? "border-matcha bg-matcha/5 text-matcha" : "border-gray-100 text-gray-400"
                                )}
                            >
                                <Truck size={24} />
                                <span className="font-bold">Delivery</span>
                                <span className="text-xs">{isFreeDelivery ? "Free (3+ items)" : "+$6.00"}</span>
                            </button>
                        </div>

                        {fulfillment === "delivery" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="overflow-hidden rounded-xl border border-gray-100"
                            >
                                <img src="/delivery-map.png" alt="Delivery Zone Map" className="w-full h-48 object-cover" />
                                <p className="text-xs text-center text-gray-400 p-2 bg-gray-50">We deliver to Park Slope, Gowanus, and Windsor Terrace.</p>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Select Date</label>
                            <div className="space-y-2">
                                <div className="relative">
                                    <select
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:border-matcha focus:ring-1 focus:ring-matcha outline-none appearance-none bg-white font-bold text-gray-700 transition-shadow"
                                    >
                                        <option value="" disabled>Select a {fulfillment === "pickup" ? "Pickup" : "Delivery"} Date</option>
                                        {getDates(fulfillment).map((date) => (
                                            <option key={date.id} value={date.id}>
                                                {date.label} {date.time ? `- ${date.time}` : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-matcha pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 text-gray-400 font-bold py-4 hover:text-gray-600">Back</button>
                            <button
                                disabled={!selectedDate}
                                onClick={() => setStep(3)}
                                className="flex-[2] bg-matcha text-flour py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-matcha-light transition-colors disabled:opacity-50"
                            >
                                Next Step <ChevronRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Your Details */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h2 className="font-serif text-3xl text-matcha">Your Details</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                    <User size={16} /> Name
                                </label>
                                <input
                                    type="text"
                                    value={contact.name}
                                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                    placeholder="Jane Doe"
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-matcha focus:ring-1 focus:ring-matcha outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                    <Mail size={16} /> Email
                                </label>
                                <input
                                    type="email"
                                    value={contact.email}
                                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                    placeholder="jane@example.com"
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-matcha focus:ring-1 focus:ring-matcha outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                    <Phone size={16} /> Phone
                                </label>
                                <input
                                    type="tel"
                                    value={contact.phone}
                                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                                    placeholder="(555) 123-4567"
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-matcha focus:ring-1 focus:ring-matcha outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                    <MessageSquare size={16} /> Notes
                                </label>
                                <textarea
                                    value={contact.notes}
                                    onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                                    placeholder="Allergies, gate codes, or special requests..."
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-matcha focus:ring-1 focus:ring-matcha outline-none transition-all min-h-[100px]"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="flex-1 text-gray-400 font-bold py-4 hover:text-gray-600">Back</button>
                            <button
                                disabled={!contact.name || !contact.email || !contact.phone}
                                onClick={() => setStep(4)}
                                className="flex-[2] bg-matcha text-flour py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-matcha-light transition-colors disabled:opacity-50"
                            >
                                Review <ChevronRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Summary & Submit (Was Step 3) */}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 text-center"
                    >
                        <h2 className="font-serif text-3xl text-matcha">Order Summary</h2>
                        <div className="bg-flour p-6 rounded-2xl space-y-4">
                            {cart.Classic > 0 && (
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600">{cart.Classic}x Classic Loaf</span>
                                    <span className="font-bold">${PRICES.Classic * cart.Classic}.00</span>
                                </div>
                            )}
                            {cart.Specialty > 0 && (
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600">{cart.Specialty}x Specialty Loaf</span>
                                    <span className="font-bold">${PRICES.Specialty * cart.Specialty}.00</span>
                                </div>
                            )}

                            {fulfillment === "delivery" && (
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Local Delivery</span>
                                    <span>{deliveryFee === 0 ? "Free" : "$6.00"}</span>
                                </div>
                            )}
                            <div className="h-px bg-matcha/10 my-4" />
                            <div className="flex justify-between text-xl font-serif text-matcha">
                                <span>Total</span>
                                <span>${total}.00</span>
                            </div>
                        </div>

                        {/* Payment Disclaimer */}
                        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800">
                            <strong>Payment:</strong> We accept <u>Cash</u> or <u>Venmo</u> upon {fulfillment}.
                        </div>

                        {submitStatus === "error" && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                                Something went wrong. Please try again or DM us on Instagram.
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-crust text-white py-4 rounded-xl font-bold shadow-lg hover:bg-crust-dark transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100"
                        >
                            {isSubmitting ? "Submitting..." : "Confirm Reservation"}
                        </button>
                        <button onClick={() => setStep(3)} className="text-gray-400 text-sm hover:underline">Change Details</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
