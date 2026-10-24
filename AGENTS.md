# AGENTS.md: Ilish Checker (offline mobile app)

You are building a complete, working React Native mobile app for a university final year project. Read this whole file before writing any code, and follow it. If something here conflicts with what you find in the environment, stop and ask the user instead of guessing.

## 1. What the app does

The user takes a photo of a fish, or picks one from their gallery. The app runs an on-device TensorFlow Lite model and says whether the fish is **Ilish (hilsa, ইলিশ)** or **not Ilish**. It must work **100% offline**.

Out of scope (do not build, do not claim): Jatka (juvenile Ilish) detection, fake-Ilish or counterfeit detection, length measurement, accounts, cloud sync, analytics, ads.

## 2. Hard rules

1. **Fully offline.** No network calls of any kind at runtime: no fetch, no analytics, no crash reporters, no remote fonts, no remote images. The model and all assets are bundled in the app. Test in airplane mode.
2. **Never invent a model or results.** The trained model file is supplied by the user (see section 4). If it is missing, stop and ask the user to place it. Never create a dummy model. Never hardcode accuracy numbers in the UI.
3. **Never change the model contract** in section 4. Preprocessing mistakes silently ruin accuracy.
4. **TypeScript, strict mode.** No `any` unless justified in a comment.
5. **Ask before running anything destructive or costly** (cloud builds, deleting files, installing system software). Show the command and wait.
6. The user is on **Windows** (project lives under `E:\CODES\Ilish`). iOS builds are not possible there, so **target Android first**. Keep the code iOS-compatible but do not spend time on iOS.
7. Keep the app simple and readable. This code will be explained in a project book, so prefer clear small files with short comments over clever abstractions.

## 3. Tech stack

- **Expo** (latest stable SDK) with **TypeScript** and **expo-router**, created with `npx create-expo-app@latest`. Use a **development build** (`expo-dev-client` / `npx expo run:android`). **Expo Go will not work** because TFLite needs native code.
- **react-native-fast-tflite** for inference. Follow its current README for the Expo config plugin and the Metro `assetExts` change that lets `.tflite` files be bundled. Use the default CPU delegate.
- **expo-image-picker** for both camera capture (`launchCameraAsync`) and gallery selection (`launchImageLibraryAsync`).
- **expo-image-manipulator** to resize the image to exactly 224x224. Check the installed SDK's docs and use the current, non-deprecated API.
- **jpeg-js** to decode the resized JPEG into raw pixels (plus `buffer` / `base64-js` if React Native needs them to decode base64).
- **@react-native-async-storage/async-storage** for settings (language) and optional history.
- **jest** for unit tests of the pure decision logic.

If a library's current API differs from this file, follow the library's current docs, and tell the user what you changed.

## 4. Model contract (do not change)

Files the user provides, to be placed in the project:

```
assets/model/ilish_classifier.tflite
assets/model/labels.txt
```

- **Input:** one tensor, shape `[1, 224, 224, 3]`, dtype `float32`, RGB channel order, pixel values **raw 0 to 255**.
- **No normalization in the app.** Do NOT divide by 255 or by 127.5, and do not subtract a mean. Rescaling is already inside the model.
- **Resize:** the model was trained with plain stretch resize to 224x224 (no center crop, no padding, aspect ratio NOT preserved). The app must do the same.
- **Output:** one tensor, shape `[1, 9]`, dtype `float32`, softmax probabilities that sum to about 1.
- **Class order** (alphabetical, index 0 to 8). Read it from `labels.txt` at startup and verify it matches:

```
0 boal
1 ilish
2 kalibaush
3 katla
4 koi
5 mrigel
6 pabda
7 rui
8 telapia
```

- At startup, log the model's actual input/output shapes. If they differ from the above, show a clear error screen. Do not continue silently.

### Preprocessing pipeline

1. Get the image URI from the picker (camera or gallery).
2. Resize to exactly 224x224 (stretch) with the image manipulator, output **JPEG** at maximum quality, and request **base64**.
3. Decode the base64 JPEG with `jpeg-js`. Assert `width === 224` and `height === 224`.
4. Convert RGBA to a flat `Float32Array` of length `224*224*3` (drop alpha, keep values 0..255):

```ts
const input = new Float32Array(224 * 224 * 3);
for (let i = 0, j = 0; i < rgba.length; i += 4) {
  input[j++] = rgba[i];       // R
  input[j++] = rgba[i + 1];   // G
  input[j++] = rgba[i + 2];   // B
}
```

5. Run the model with `[input]` and read the 9 probabilities from the first output.
6. Measure inference time (preprocessing and model run, separately) with `performance.now()` or `Date.now()` and keep it for the result screen.

## 5. Decision logic (pure function, unit tested)

Put all thresholds in `src/config.ts`. Create `src/ml/decide.ts` exporting a pure function `decide(probs: number[], labels: string[])` that returns one of three verdicts:

```ts
// src/config.ts: tune these after reading the training notebook's threshold table
export const ILISH_THRESHOLD = 0.80;   // TODO(user): set from the notebook's precision/recall/false-Ilish table
export const MIN_CONFIDENCE  = 0.50;   // below this, the photo is "unclear"
```

Rules, in order:

1. Let `top` be the class with the highest probability and `p` its probability.
2. If `p < MIN_CONFIDENCE` then verdict `UNSURE` (photo unclear or not a supported fish).
3. If `top === "ilish"` and `p >= ILISH_THRESHOLD` then verdict `ILISH`.
4. If `top === "ilish"` and `p < ILISH_THRESHOLD` then verdict `UNSURE` (looks like Ilish but not confident enough).
5. Otherwise (top is another species with `p >= MIN_CONFIDENCE`) then verdict `NOT_ILISH`, and include the best-guess species name.

Always also return the top 3 classes with probabilities. Write jest tests that cover each rule and the boundary values.

## 6. Screens and UX

Clean, large touch targets, readable in bright sunlight outdoors (high contrast). Default language English, with a one-tap **English / বাংলা** toggle saved in AsyncStorage. All user-visible strings live in `src/i18n/` (en and bn files). No hardcoded strings in components.

Bengali species names for display: boal = বোয়াল, ilish = ইলিশ, kalibaush = কালিবাউশ, katla = কাতলা, koi = কই, mrigel = মৃগেল, pabda = পাবদা, rui = রুই, telapia = তেলাপিয়া.

### 6.1 Home screen
- App title: "Ilish Checker" (bn: ইলিশ চেকার)
- Two large buttons: **Take Photo** and **Choose from Gallery**
- A short "Tips for a good photo" card: whole fish in frame, side view, plain background, good light, no hands covering the body.
- Small links to **About** and the language toggle.
- Handle camera permission denial gracefully: explain why it is needed and offer a button to open system settings. The gallery option must keep working even if the camera is denied.

### 6.2 Result screen
- The photo preview.
- A large verdict card:
  - `ILISH`: green, "Ilish" with a check icon
  - `NOT_ILISH`: red, "Not Ilish" with the best-guess species ("Looks like Rui")
  - `UNSURE`: amber, "Not sure. Try a clearer photo"
- Confidence percentage for the top class.
- Top 3 predictions as simple horizontal bars (species name plus percent).
- Inference time in milliseconds (small text).
- Buttons: **Check another photo** and (if history is enabled) **Save**.
- A permanent short disclaimer: "This is an AI estimate based on 9 freshwater fish species. It cannot detect fake fish, juvenile Ilish (Jatka), or fish outside these species. Do not use it as a legal or commercial verdict."
- Show a loading state while the model runs. Never freeze the UI. If anything fails, show a friendly error and a Retry button.

### 6.3 About screen
App purpose, offline note, the 9 species the model knows, the model details (MobileNetV2, 224x224, TFLite), the dataset credit (SylFishBD, Scientific Data 2026, DOI 10.1038/s41597-026-07552-1), the limitations above, and the app version.

### 6.4 Debug screen (hidden)
Opened by tapping the app title 5 times. Shows model input/output shapes, load time, and for the last image the full 9-class probability list and timings. This is for testing and for the project book.

### 6.5 History (build this last, only after everything else works)
Optional local history of up to 50 results (thumbnail, verdict, confidence, date) stored with AsyncStorage and image copies in the app's document directory. Include a "Clear history" button.

## 7. Suggested structure

```
ilish-app/
  AGENTS.md
  app/                      (expo-router screens: index, result, about, debug)
  assets/
    model/ilish_classifier.tflite   (supplied by user)
    model/labels.txt                (supplied by user)
    samples/                        (user may add test photos here)
  src/
    config.ts               (thresholds, image size)
    ml/classifier.ts        (load model, run inference)
    ml/preprocess.ts        (resize, decode, to Float32Array)
    ml/decide.ts            (pure decision logic)
    ml/__tests__/decide.test.ts
    i18n/ (en.ts, bn.ts, index.ts)
    components/ (VerdictCard, ProbBar, BigButton)
    storage/ (settings, history)
```

## 8. Order of work

Work in this order and tell the user briefly when each step is done:

1. Create the Expo TypeScript project and confirm it builds as a development build for Android. Give the user the exact commands. Local `npx expo run:android` needs Android Studio, an Android SDK and JDK 17. The alternative is a cloud build with EAS. **Ask the user which they prefer before running anything.**
2. Ask the user to place `ilish_classifier.tflite` and `labels.txt` in `assets/model/`. Do not continue until they are there.
3. Load the model and show its input/output shapes on the debug screen. Check them against section 4.
4. Build the preprocessing pipeline. Verify it with a known test: for a photo of a clearly different size, confirm the decoded size is 224x224 and the tensor length is 150528.
5. Build `decide.ts` with unit tests (`npx jest`) and make them pass.
6. Build the Home and Result screens end to end (camera and gallery).
7. Add the About screen, language toggle, debug screen and permission handling.
8. Add history last.
9. Run the section 9 checks, then write a short `README.md` (setup, run, build, known limits).

## 9. Definition of done

- [ ] Works in **airplane mode** (verified)
- [ ] Both "Take Photo" and "Choose from Gallery" work on a real Android phone
- [ ] Camera permission denied is handled without a crash, and the gallery still works
- [ ] A photo of Ilish gives `ILISH`, and photos of other listed species mostly give `NOT_ILISH` (the user will test with real photos and report back; do not claim accuracy yourself)
- [ ] Inference takes well under 1 second per image on a mid-range phone, and the time is shown
- [ ] No network calls anywhere in the code (search for `fetch`, `axios`, `XMLHttpRequest` and remote URLs)
- [ ] `npx tsc --noEmit` passes and `npx jest` passes
- [ ] Release APK builds, and the file size is reported to the user
- [ ] `README.md` explains how to build and run

## 10. When to stop and ask the user

- The model or labels file is missing, or its shapes or labels differ from section 4
- A library's current API conflicts with this file in a way that changes behavior
- Any build step needs an account, a login, a paid service or a large system install
- You are unsure whether a threshold or label should change. Never tune thresholds yourself: the user sets `ILISH_THRESHOLD` from their own evaluation.
