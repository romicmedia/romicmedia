# 🚀 Romic Media — Official Mobile App (Client Demo Edition)

Welcome to the **Romic Media Mobile App** codebase. This app has been designed and built specifically to give high-converting, interactive client demos today, with zero setup or build friction, while being 100% architected for future **Google Play Store & Apple App Store** publication.

---

## 📱 How to Run & Demo Right Now

### 1. Instant Desktop / Laptop Demo (For Client Pitches)
- Simply double-click **`index.html`** or open it in Google Chrome / Brave / Edge.
- **Phone Frame Mode**: By default on desktop, it displays a sleek floating smartphone mockup with dynamic island, live time, status bar, and realistic glassmorphic lighting. This blows clients away during screen-share or in-person meetings!
- **Full Screen Toggle**: Click the `"Full Screen Mode"` button in the top presentation bar to switch to edge-to-edge view.

### 2. Live Demo on Real Android / iPhone
- Send `index.html` (or host this `romicapp` folder on GitHub Pages / Vercel / your existing domain `romicmedia.com/romicapp/`).
- Open the URL on mobile Chrome or Safari.
- Tap **"Add to Home screen"** (or Install App).
- The app installs directly onto the phone with the Romic Media icon and runs in full-screen standalone mode without any browser URL bar!

---

## ✨ Features Built Into the App

| Feature | Description | Interactive Capabilities |
| :--- | :--- | :--- |
| **🏠 Home Showcase** | Viral-first agency showcase with cyberpunk dark glassmorphism. | Tap play on the featured video reel, like counter with heart animation, live counters (50+ projects), brand marquee strip. |
| **⚡ Services Catalog** | Full 9 core services with category filtering. | Tap any service to open a bottom sheet modal detailing deliverables, turnaround times, and 1-tap WhatsApp booking. |
| **🤖 AI Viral Hook Generator** | Retention engine for creators and brands. | Select Industry (Real Estate, Gym, E-commerce, Food, SaaS) & Tone $\rightarrow$ Click *"Generate Viral Hooks"* $\rightarrow$ Instant 3-second hooks with 1-click clipboard copy! |
| **💰 Scope & Budget Calculator** | Interactive video package quote builder. | Adjust short-form video slider (4 to 30 videos), toggle 4K shoot / 3D VFX / Express $\rightarrow$ Live price updates $\rightarrow$ 1-tap WhatsApp button with pre-filled quote! |
| **📊 Live Campaign Tracker** | Client portal to track video production. | Search presets (`ROMIC-2026`, `UK-GONGCHA`, `LONDON-MOTORS`) $\rightarrow$ Real-time progress bar (75%), milestone checklist, draft video preview, and revision request button. |
| **💬 VIP Support Hub** | Direct agency communication desk. | 1-Tap WhatsApp VIP chat (`wa.me/923209670625`), direct phone, email, and social channels. |

---

## 📦 Publishing to Google Play Store (Future Phase)

When you are ready to compile this into an Android App Bundle (`.aab`) or `.apk` for Google Play Store:
1. `capacitor.config.json` and `manifest.json` are already pre-configured.
2. In terminal:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap add android
   npx cap open android
   ```
3. Android Studio will open your app. Click **Build > Generate Signed Bundle / APK** and upload the `.aab` directly to Google Play Console!
