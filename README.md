# Shokupan Slope 🍞

**"The Sound of Softness."**

Shokupan Slope is a digital storefront for a premium Japanese milk bread bakery in Park Slope, Brooklyn. This project focuses on a high-sensory user experience, emphasizing the texture and quality of the bread through video, sound concepts, and smooth animations.

## 🚀 Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Testing:** [Vitest](https://vitest.dev/) & React Testing Library
*   **Hosting:** [Firebase Hosting](https://firebase.google.com/docs/hosting)

## ✨ Key Features

### 1. The Sensory Experience
*   **Texture Hero:** A cinematic video background (`TextureHero.tsx`) that immediately immerses the user in the product.
*   **Micro-interactions:** Subtle hover states and layout transitions that feel "soft" and responsive, mirroring the product itself.

### 2. Smart Reservation System (`/reserve`)
A custom-built ordering flow (`ReserveForm.tsx`) that replaces a traditional e-commerce cart:
*   **Dynamic Scheduling:** Automatically calculates valid pickup (Tue/Sun) and delivery (Sat) dates for the next 4 weeks.
*   **Live Cart Logic:** Real-time subtotal calculation with conditional delivery fees.
*   **Serverless Backend:** Submits orders directly to a Google Sheet via a Google Apps Script (GAS) API, keeping operational costs at zero.

### 3. Agentic CI/CD Pipeline
Fully automated DevOps workflow via GitHub Actions (`.github/workflows/ci.yml`):
*   **🧪 Test:** Runs unit tests to ensure business logic (pricing, dates) is correct.
*   **🏗️ Build:** Compiles the Next.js application into a static export.
*   **🚀 Deploy:** Automatically deploys to Firebase Hosting only if tests and build pass.

## 🛠️ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/illya-naumov/shokupan-slope.git
    cd shokupan-slope
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## ✅ Testing

We use **Vitest** for unit testing. The test suite covers the Reservation Form's logic, including:
*   Price calculations
*   Delivery fee logic (Free for 3+ items)
*   Mobile responsive layout checks
*   Dynamic date generation

**Run tests:**
```bash
npm test
# or
npx vitest run
```

## 📂 Project Structure

```
├── .github/workflows/  # CI/CD Pipeline configuration
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components (Commerce, UI)
│   └── lib/            # Utilities and helpers
├── public/             # Static assets (images, videos)
└── vitest.config.ts    # Test configuration
```

---
*Created with ❤️ for bread lovers.*
