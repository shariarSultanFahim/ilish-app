// src/config.ts: Model and classification configuration
// Values should match model contract in AGENTS.md

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
