# PROJECT SUMMARY: Ilish Checker

This document summarizes the exact versions, architecture, configurations, build commands, and test verification results for the Ilish Checker project.

---

## (1) Exact Package Versions

From `package.json` and active environment:

- **Expo SDK (`expo`)**: `~58.0.19` (SDK 58)
- **React Native (`react-native`)**: `0.88.0`
- **React (`react`)**: `19.3.0`
- **`react-native-fast-tflite`**: `^3.0.1` (Nitro Modules integration)
- **`react-native-nitro-modules`**: `^0.37.1`
- **`expo-router`**: `~58.0.26`
- **`expo-dev-client`**: `~58.0.15`
- **`expo-image-picker`**: `~58.0.10`
- **`expo-image-manipulator`**: `~58.0.15`
- **`expo-file-system`**: `~58.0.11`
- **`@react-native-async-storage/async-storage`**: `^2.2.0`
- **`jpeg-js`**: `^0.4.4`
- **`base64-js`**: `^1.5.1`
- **`react-native-safe-area-context`**: `~5.10.1`
- **`react-native-screens`**: `~4.30.0`
- **`typescript`**: `~6.0.3`
- **`jest`**: `^30.5.2`
- **`ts-jest`**: `^29.4.15`

---

## (2) Final File Tree

```
ilish-app/
├── .claude/
│   └── settings.json
├── .gitignore
├── .npmrc
├── AGENTS.md
├── LICENSE
├── PROJECT_SUMMARY.md
├── README.md
├── app.json
├── app/
│   ├── _layout.tsx
│   ├── about.tsx
│   ├── debug.tsx
│   ├── history.tsx
│   ├── index.tsx
│   └── result.tsx
├── assets/
│   ├── android-icon-background.png
│   ├── android-icon-foreground.png
│   ├── android-icon-monochrome.png
│   ├── favicon.png
│   ├── icon.png
│   ├── model/
│   │   ├── ilish_classifier.tflite
│   │   └── labels.txt
│   └── splash-icon.png
├── eas.json
├── index.ts
├── jest.config.js
├── metro.config.js
├── package-lock.json
├── package.json
├── src/
│   ├── components/
│   │   ├── BigButton.tsx
│   │   ├── ProbBar.tsx
│   │   └── VerdictCard.tsx
│   ├── config.ts
│   ├── i18n/
│   │   ├── bn.ts
│   │   ├── en.ts
│   │   └── index.tsx
│   ├── ml/
│   │   ├── __tests__/
│   │   │   ├── decide.test.ts
│   │   │   └── preprocess.test.ts
│   │   ├── classifier.ts
│   │   ├── decide.ts
│   │   └── preprocess.ts
│   └── storage/
│       └── history.ts
└── tsconfig.json
```

---

## (3) Final Values in `src/config.ts`

```ts
export const MODEL_IMAGE_SIZE = 224;
export const EXPECTED_CHANNELS = 3;
export const EXPECTED_INPUT_SIZE = MODEL_IMAGE_SIZE * MODEL_IMAGE_SIZE * EXPECTED_CHANNELS; // 150528
export const EXPECTED_CLASSES_COUNT = 9;

// Decision thresholds: tune these after reading the training notebook's threshold table
export const ILISH_THRESHOLD = 0.80; // Above this -> ILISH verdict
export const MIN_CONFIDENCE = 0.50;  // Below this -> UNSURE (photo unclear or not supported)

// Alphabetical class labels from training contract
export const EXPECTED_LABELS: readonly string[] = [
  'boal',
  'ilish',
  'kalibaush',
  'katla',
  'koi',
  'mrigel',
  'pabda',
  'rui',
  'telapia',
] as const;

export type SupportedSpecies = (typeof EXPECTED_LABELS)[number];
```

---

## (4) Deviations from `AGENTS.md` and Rationale

1. **`expo-image-manipulator` API**:
   - *AGENTS.md* suggested legacy `manipulateAsync`.
   - *Deviation*: Used the current non-deprecated contextual API `ImageManipulator.manipulate(uri).resize({ width: 224, height: 224 })` followed by `.renderAsync()` and `.saveAsync(...)`.
   - *Why*: In Expo SDK 58, `manipulateAsync` is formally marked deprecated. Following the instruction in Section 3 ("Check the installed SDK's docs and use the current, non-deprecated API"), the modern API was used.

2. **`expo-file-system` API**:
   - *AGENTS.md* suggested legacy string-based `FileSystem.documentDirectory` and `FileSystem.copyAsync`.
   - *Deviation*: Used modern SDK 58 object-based API `new Directory(Paths.document, ...)` and `new File(...).copy(...)`.
   - *Why*: In SDK 58, `FileSystem.documentDirectory` property does not exist on the base export; `Paths.document`, `File`, and `Directory` are the typed modern APIs.

3. **`src/i18n/index.tsx` Extension**:
   - *AGENTS.md* suggested `src/i18n/index.ts`.
   - *Deviation*: Renamed to `src/i18n/index.tsx`.
   - *Why*: The file provides `I18nProvider` which renders JSX (`<I18nContext.Provider>`). TypeScript requires `.tsx` for files containing JSX elements.

4. **Added `.npmrc` with `legacy-peer-deps=true`**:
   - *Deviation*: Added `.npmrc` file to the root.
   - *Why*: React 19.3.0 and transitive Expo packages have an upstream peer dependency conflict (`react-dom@19.3.1` vs `react@19.3.0`). Without `.npmrc`, EAS remote builds running `npm ci --include=dev` fail with `ERESOLVE could not resolve`.

5. **`app/history.tsx` Screen Added**:
   - *Deviation*: Added dedicated `app/history.tsx` route screen connected to Home top-bar button.
   - *Why*: To allow viewing and clearing the up to 50 saved history items mentioned in Section 6.5.

---

## (5) Build and Run Commands & Build Type

All native builds were performed using **EAS Cloud Build** (not local Android Studio, per user choice and Windows environment constraints).

### Development Client Build (EAS Cloud)
```bash
# Installed development client
npm install --legacy-peer-deps expo-dev-client

# Triggered cloud build
npx eas build --platform android --profile development
```

### Running Locally with Development Client
```bash
npx expo start
```
*(User installed development APK on Android phone and tested connected to local server)*.

### Standalone Production APK Build (EAS Cloud)
```bash
npx eas build --platform android --profile production
```

---

## (6) Problems Encountered and Resolutions

1. **`npx create-expo-app` Directory Collision**:
   - *Problem*: Scaffolding into the existing directory aborted because `AGENTS.md` and `assets/model/` were already present.
   - *Resolution*: Scaffolded into a temporary folder, copied the template files while preserving `AGENTS.md` and `assets/model/`, and cleaned up temporary files.

2. **NPM Peer Dependency Conflict with React 19**:
   - *Problem*: `npm install` and EAS `npm ci` failed with `ERESOLVE could not resolve` between `react-dom@19.3.1` and `react@19.3.0`.
   - *Resolution*: Used `--legacy-peer-deps` locally and created root `.npmrc` with `legacy-peer-deps=true`, then committed the updated `package-lock.json`.

3. **Missing `expo-font` Config Plugin Error on `npm start`**:
   - *Problem*: `npm run start` and `npm run android` failed with `PluginError: Failed to resolve plugin for module "expo-font"`.
   - *Resolution*: Removed `"expo-font"` from `plugins` array in `app.json` (fonts are offline system fonts per offline rule).

4. **TypeScript JSX and Type Errors**:
   - *Problem*: `src/i18n/index.ts` failed typecheck because of JSX in a `.ts` file; `src/ml/classifier.ts` had an `ArrayBufferLike` vs `ArrayBuffer` type mismatch for `model.run()`.
   - *Resolution*: Renamed `src/i18n/index.ts` to `index.tsx`, added `as ArrayBuffer` type assertion on the sliced buffer, and added `["jest", "node"]` to `tsconfig.json`.

5. **`expo-file-system` Type Errors**:
   - *Problem*: `FileSystem.documentDirectory` and legacy methods were undefined in SDK 58 types.
   - *Resolution*: Refactored `src/storage/history.ts` to use `Paths.document`, `Directory`, and `File` from `expo-file-system`.

6. **Release APK `java.net.MalformedURLException: no protocol: assets_model_ilish_classifier`**:
   - *Problem*: In standalone Android release APK builds, Metro bundles assets as raw resource names (e.g., `assets_model_ilish_classifier`) instead of URLs. In `react-native-fast-tflite`, the Android Kotlin `HybridAssetLoader` directly passes the path to `java.net.URL(path).readBytes()`, throwing `MalformedURLException` because there is no protocol (`file://` or `http://`).
   - *Resolution*: Integrated `expo-asset` in `src/ml/classifier.ts`. At runtime, `Asset.loadAsync(require('../../assets/model/ilish_classifier.tflite'))` extracts the bundled asset to a valid local file path (`file://.../assets_model_ilish_classifier.tflite`), ensuring `HybridAssetLoader` receives a valid URL protocol.

---

## (7) Results of Verification Commands

### `npx tsc --noEmit`
- **Result**: Passed with zero errors (Exit code 0).

### `npx jest`
- **Result**: Passed with zero failures (Exit code 0).
- **Test Suites**: 2 passed, 2 total
- **Tests**: 9 passed, 9 total
  - `decide.test.ts`:
    - Rule 2 (top < MIN_CONFIDENCE -> UNSURE)
    - Rule 3 (top === ilish & p >= 0.80 -> ILISH)
    - Rule 3 boundary (exact 0.80 -> ILISH)
    - Rule 4 (top === ilish & p < 0.80 -> UNSURE)
    - Rule 4 boundary (0.799 -> UNSURE)
    - Rule 5 (other species & p >= 0.50 -> NOT_ILISH with best-guess)
    - Rule 5 boundary (exact 0.50 -> NOT_ILISH)
    - Error handling (empty array and length mismatch throws)
  - `preprocess.test.ts`:
    - Decodes synthetic JPEG and asserts 224x224 RGB raw tensor length is exactly 150,528 with raw 0..255 values.

### Offline Security Audit
- Grep search for `fetch`, `axios`, `XMLHttpRequest`, and remote URLs in `src/` and `app/`:
- **Result**: 0 network calls found.

---

## (8) Release APK Size

- **Status**: Not done (The user built the development APK to run on device and was given the production build command `npx eas build --platform android --profile production`; the production release APK cloud build was not triggered within this session, so the final production APK byte size is not yet measured).
