import { ILISH_THRESHOLD, MIN_CONFIDENCE } from '../config';

export type Verdict = 'ILISH' | 'NOT_ILISH' | 'UNSURE';

export interface ClassProbability {
  label: string;
  probability: number; // 0.0 to 1.0
  percentage: number;  // 0 to 100
}

export interface DecisionResult {
  verdict: Verdict;
  topClass: string;
  topProbability: number;
  topPercentage: number;
  bestGuessSpecies?: string;
  top3: ClassProbability[];
  allProbabilities: ClassProbability[];
}

/**
 * Pure decision logic function.
 * Evaluates model output probabilities against predefined thresholds.
 *
 * Rules, strictly in order:
 * 1. Let `top` be the class with the highest probability and `p` its probability.
 * 2. If `p < MIN_CONFIDENCE` then verdict `UNSURE` (photo unclear or not a supported fish).
 * 3. If `top === "ilish"` and `p >= ILISH_THRESHOLD` then verdict `ILISH`.
 * 4. If `top === "ilish"` and `p < ILISH_THRESHOLD` then verdict `UNSURE` (looks like Ilish but not confident enough).
 * 5. Otherwise (top is another species with `p >= MIN_CONFIDENCE`) then verdict `NOT_ILISH`, and include the best-guess species name.
 */
export function decide(probs: number[], labels: string[]): DecisionResult {
  if (!probs || probs.length === 0) {
    throw new Error('Probabilities array cannot be empty');
  }
  if (!labels || labels.length === 0) {
    throw new Error('Labels array cannot be empty');
  }
  if (probs.length !== labels.length) {
    throw new Error(`Length mismatch: ${probs.length} probabilities vs ${labels.length} labels`);
  }

  // Combine and sort descending by probability
  const sorted: ClassProbability[] = probs
    .map((p, idx) => {
      const probability = Number.isFinite(p) ? Math.max(0, p) : 0;
      return {
        label: labels[idx],
        probability,
        percentage: Math.round(probability * 100),
      };
    })
    .sort((a, b) => b.probability - a.probability);

  const top = sorted[0];
  const p = top.probability;
  const topLabel = top.label.toLowerCase().trim();

  let verdict: Verdict;
  let bestGuessSpecies: string | undefined;

  if (p < MIN_CONFIDENCE) {
    // Rule 2
    verdict = 'UNSURE';
  } else if (topLabel === 'ilish') {
    if (p >= ILISH_THRESHOLD) {
      // Rule 3
      verdict = 'ILISH';
    } else {
      // Rule 4
      verdict = 'UNSURE';
    }
  } else {
    // Rule 5: Top is another species with p >= MIN_CONFIDENCE
    verdict = 'NOT_ILISH';
    bestGuessSpecies = top.label;
  }

  return {
    verdict,
    topClass: top.label,
    topProbability: p,
    topPercentage: Math.round(p * 100),
    bestGuessSpecies,
    top3: sorted.slice(0, 3),
    allProbabilities: sorted,
  };
}
