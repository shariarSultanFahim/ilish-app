# Ilish Checker (ইলিশ চেকার)

An offline on-device mobile application built with React Native and Expo for a university final year project. The app uses an on-device TensorFlow Lite model to classify fish photos into **Ilish (Tenualosa ilisha)** or **Not Ilish** across 9 freshwater species.

## Features

- **100% Offline AI Inference**: Runs directly on mobile CPU using `react-native-fast-tflite`. Zero network requests (`fetch`, `axios`, analytics, or cloud sync). Functions fully in Airplane Mode.
- **Strict Model Contract**: Stretches input images to 224x224 RGB raw tensor (`Float32Array` of size 150,528, raw 0..255 values, no double normalization).
- **Pure Decision Logic**: Tested with Jest covering all confidence/threshold edge boundaries:
  - `ILISH`: Top class is `ilish` with confidence $\ge 0.80$ (green badge).
  - `NOT_ILISH`: Top class is another species with confidence $\ge 0.50$ (red badge, shows best-guess species).
  - `UNSURE`: Top confidence $< 0.50$ or Ilish $< 0.80$ (amber badge).
- **Bilingual Interface**: Full English / Bengali (বাংলা) support with an instant toggle persisted to AsyncStorage.
- **Offline History**: Saves up to 50 recent classifications locally with photo thumbnails in the app's document directory.
- **Hidden Debug Screen**: Tap the app title 5 times to view model tensor shapes, load times, and complete 9-class softmax probability distributions.

## Supported Species (9 Classes)

1. `boal` (বোয়াল)
2. `ilish` (ইলিশ - Tenualosa ilisha)
3. `kalibaush` (কালিবাউশ)
4. `katla` (কাতলা)
5. `koi` (কই)
6. `mrigel` (মৃগেল)
7. `pabda` (পাবda)
8. `rui` (রুই)
9. `telapia` (তেলাপিয়া)

---

## Project Structure

```
ilish-app/
├── app/                        # Expo Router screen routes
│   ├── _layout.tsx             # Root Stack layout & I18n provider
│   ├── index.tsx               # Home screen (Camera, Gallery, Tips)
│   ├── result.tsx              # Result screen (Verdict, Probabilities, Timing)
│   ├── about.tsx               # About & Academic credits screen
│   ├── debug.tsx               # Hidden diagnostics screen (5 taps)
│   └── history.tsx             # Local offline history list
├── assets/
│   └── model/
│       ├── ilish_classifier.tflite   # Trained MobileNetV2 TFLite model
│       └── labels.txt                # Alphabetical 9 class labels
├── src/
│   ├── config.ts               # Thresholds and model constants
│   ├── components/             # Reusable UI components
│   │   ├── BigButton.tsx       # Large touch targets for outdoor use
│   │   ├── VerdictCard.tsx     # High-contrast color-coded verdict badge
│   │   └── ProbBar.tsx         # Species confidence horizontal bar
│   ├── i18n/                   # Localized strings (no hardcoded text)
│   │   ├── en.ts               # English translations
│   │   ├── bn.ts               # Bengali translations
│   │   └── index.tsx           # I18n context provider
│   ├── ml/
│   │   ├── classifier.ts       # Model initialization and inference
│   │   ├── preprocess.ts       # 224x224 stretch resize & raw pixel conversion
│   │   ├── decide.ts           # Pure decision logic function
│   │   └── __tests__/          # Jest unit tests for decide & preprocess
│   └── storage/
│       └── history.ts          # Local file and AsyncStorage history
├── app.json                    # Expo config with plugins and permissions
├── eas.json                    # EAS Build profiles
├── metro.config.js             # Bundles .tflite files in assets
└── tsconfig.json               # Strict TypeScript configuration
```

---

## Setup & Running Locally

### Prerequisites

- Node.js 18+ (tested on Node 22)
- npm or yarn

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Run Tests & Typechecks

```bash
npx jest
npx tsc --noEmit
```

### 3. Start Development Server

```bash
npx expo start
```

*Note: TensorFlow Lite utilizes native C++ modules via `react-native-fast-tflite`. It requires a Development Build (`expo-dev-client`) or a standalone build; Expo Go cannot execute native TFLite binaries.*

---

## Building the Android APK

### Option A: EAS Cloud Build (Recommended - No Android Studio required)

1. Log in to your Expo account:
   ```bash
   npx eas login
   ```
2. Build an Android development APK:
   ```bash
   npx eas build --platform android --profile development
   ```
3. Build a standalone preview release APK (installable on any Android phone):
   ```bash
   npx eas build --platform android --profile preview
   ```

### Option B: Local Android Build

Requires Android Studio, Android SDK (API 34+), and JDK 17 installed and configured on your system:

```bash
npx expo run:android
```

---

## Known Scope & Limitations

- **Out of Scope**: Juvenile Ilish (Jatka) detection, counterfeit/fake fish detection, physical length/weight measurement.
- **Dataset Scope**: Model is trained on the SylFishBD dataset across 9 freshwater species. Unlisted fish will yield `UNSURE` or low confidence.
- **Academic Context**: Created for a university final year project; not intended for legal or commercial enforcement.

---

## Dataset & Model Citation

- **Dataset**: SylFishBD
- **Citation**: *Scientific Data 2026*, DOI: [10.1038/s41597-026-07552-1](https://doi.org/10.1038/s41597-026-07552-1)
