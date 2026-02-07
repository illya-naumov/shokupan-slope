import './style.css';
import { loadHeader, loadFooter } from './components.js';

// Shokupan Slope Main Script

// Load Global Components
loadHeader();
loadFooter();

// --- Waitlist Form Logic ---
const form = document.getElementById('waitlist-form');
if (form) {
    // TODO: User must replace this URL with their deployed Google Apps Script Web App URL
    // See README_BACKEND.md
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz3xQAY-OR-rPzyhaZyqu8G4OEHDMseei4eVfUoadQGaowVDlYYkwLwNtQA_0pb1QhM/exec";

    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const messageEl = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value;

        if (!email) return;

        // Honeypot Check
        const honeyPot = form.querySelector('input[name="_gotcha"]');
        if (honeyPot && honeyPot.value) {
            console.log("Bot detected. Silently ignoring.");
            // Fake success
            submitBtn.classList.add('success');
            submitBtn.innerHTML = `<span class="btn-text">Joined!</span> <span class="btn-icon">✓</span>`;
            return;
        }

        // UI: Loading State
        setLoading(true);

        try {
            if (GOOGLE_SCRIPT_URL === "REPLACE_WITH_YOUR_WEB_APP_URL") {
                await new Promise(r => setTimeout(r, 1000));
            } else {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify({ email: email }),
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                });
            }

            // UI: Success State (Micro-interaction)
            submitBtn.classList.add('success');
            submitBtn.innerHTML = `<span class="btn-text">Joined!</span> <span class="btn-icon">✓</span>`;

            // Optional: Reset after a few seconds or keep it as confirmation
            form.reset();

        } catch (error) {
            console.error("Error:", error);
            showMessage("Something went wrong. Please try again.", "error");
            setLoading(false); // Only reset if error
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.innerHTML = `<span class="btn-text">Joining...</span>`;
            submitBtn.disabled = true;
        } else {
            // Reset to default is handled by HTML, but if we needed to revert:
            // submitBtn.innerHTML = ...
            submitBtn.disabled = false;
        }
    }

    function showMessage(text, type) {
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
    }
}

// --- Order Page Password Logic ---
const passwordForm = document.getElementById('password-form');
if (passwordForm) {
    const passwordInput = document.getElementById('password-input');
    const lockedSection = document.getElementById('order-locked');
    const unlockedSection = document.getElementById('order-unlocked');
    const errorMsg = document.getElementById('password-error');

    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = passwordInput.value;

        // Simple client-side check
        if (password === 'shokupan2026') {
            lockedSection.classList.add('hidden');
            unlockedSection.classList.remove('hidden');
        } else {
            errorMsg.classList.remove('hidden');
            passwordInput.value = '';
        }
    });
}

// --- Order Form Submission ---
const orderForm = document.getElementById('order-form');
if (orderForm) {
    // TODO: User must replace this URL with their deployed Google Apps Script Web App URL
    // See README_BACKEND.md
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz3xQAY-OR-rPzyhaZyqu8G4OEHDMseei4eVfUoadQGaowVDlYYkwLwNtQA_0pb1QhM/exec";
    const orderMessageEl = document.getElementById('order-message');
    const orderSubmitBtn = document.getElementById('order-submit-btn');

    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect Data
        const formData = new FormData(orderForm);
        const data = Object.fromEntries(formData);

        // Honeypot Check
        if (data._gotcha) {
            console.log("Bot detected. Silently ignoring.");
            // Fake success
            showMessage(orderMessageEl, "Order received! Check your email for confirmation.", "success");
            orderForm.reset();
            return;
        }

        data.type = "order"; // Tag requests to distinguish from waitlist

        // UI Loading
        orderSubmitBtn.textContent = "Placing Order...";
        orderSubmitBtn.disabled = true;
        orderMessageEl.classList.add('hidden');

        try {
            if (GOOGLE_SCRIPT_URL === "REPLACE_WITH_YOUR_WEB_APP_URL") {
                await new Promise(r => setTimeout(r, 1500));
                console.warn("Backend URL not set. Simulating success.");
                const mockID = "ORD-" + Math.floor(Math.random() * 10000);
                showMessage(orderMessageEl, `Order ${mockID} placed! Check your email.`, "success");
            } else {
                // Real submission with no-cors for robustness
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                });

                // With no-cors, we can't read the response JSON (Order ID).
                // But we know it succeeded if it didn't throw.
                showMessage(orderMessageEl, "Order received! Check your email for confirmation.", "success");
                orderForm.reset();
            }

        } catch (error) {
            console.error(error);
            showMessage(orderMessageEl, "Error placement order. calling us might be faster!", "error");
        } finally {
            orderSubmitBtn.textContent = "Place Order";
            orderSubmitBtn.disabled = false;
        }
    });

    function showMessage(el, text, type) {
        el.textContent = text;
        el.className = `message ${type}`;
    }
}


