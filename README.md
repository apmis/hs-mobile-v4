# HealthStack Mobile V4

HealthStack Mobile V4 is a modular, feature-rich React Native mobile application built with Expo for managing healthcare departments and clinical workflows.

## 🚀 Features

- **Department-Based Architecture:** Scalable, independent modules for various healthcare functions (e.g., Appointments, Pharmacy, Laboratory, Managed Care, Ward).
- **AI Copilot Search:** Context-aware, global AI Copilot search integrated directly into the application's top navigation.
- **Semantic Theming:** Advanced system-aware dark and light mode UI utilizing a robust semantic token system.
- **Optimized UI:** Fluid interactions leveraging `ParallaxScrollView` and fully native, keyboard-avoiding absolute layout navigation without performance-heavy native Modals.

## 🛠️ Technology Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching:** [React Query](https://tanstack.com/query/latest) (`@tanstack/react-query`)
- **Backend/API Client:** [FeathersJS (v4)](https://feathersjs.com/) via WebSockets (`socket.io-client`)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Icons:** `lucide-react-native` and `iconsax-react-native`
- **Language:** TypeScript

## 📂 Project Structure

```text
hs-mobile-v4/
├── app/                  # Expo Router file-based routing directory
│   ├── (features)/       # Main feature modules
│   │   └── departments/  # Individual healthcare department domains
│   │       ├── appointments/
│   │       ├── pharmacy/
│   │       ├── managed-care/
│   │       └── ...
│   └── shared/           # Shared, highly reusable UI components & themes
├── assets/               # Static images, fonts, and icons
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

## 💻 Installation & Setup

This project uses `pnpm` as its package manager.

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd hs-mobile-v4
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the Expo development server:**
   ```bash
   pnpm run start
   ```

## 📱 Running the App

After starting the Expo server, you can run the app on various platforms:

- Press `a` to run on an Android Emulator
- Press `i` to run on an iOS Simulator
- Press `w` to run on the Web
- Scan the QR code in the terminal with the **Expo Go** app on your physical device.

## 🏛️ Architecture Overview

HealthStack uses a "Shell and Strategy" architectural pattern for feature modules.
- **Top-Level Routable Blocks:** Every department maintains its own independent routing logic and encapsulated state, ensuring the codebase scales beautifully as more clinical domains are added.
- **Global `AppHeader`:** A shared navigation header handles contextual back actions and houses the global "Ask Copilot" search integration.
- **Centralized Theming:** Colors and typography are managed semantically (e.g., `primary`, `background`, `card`) instead of hard-coded values, seamlessly bridging light and dark system preferences.
