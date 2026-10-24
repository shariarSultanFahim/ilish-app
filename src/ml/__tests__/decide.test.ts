import { decide } from '../decide';
import { ILISH_THRESHOLD, MIN_CONFIDENCE } from '../../config';

describe('decide() ML pure decision logic', () => {
  const labels = [
    'boal',
    'ilish',
    'kalibaush',
    'katla',
    'koi',
    'mrigel',
    'pabda',
    'rui',
    'telapia',
  ];

  test('Rule 2: returns UNSURE if top probability < MIN_CONFIDENCE (e.g. 0.45)', () => {
    // Top is rui at 0.45
    const probs = [0.05, 0.1, 0.05, 0.05, 0.05, 0.05, 0.05, 0.45, 0.15];
    const res = decide(probs, labels);
    expect(res.verdict).toBe('UNSURE');
    expect(res.topClass).toBe('rui');
    expect(res.topProbability).toBe(0.45);
    expect(res.topPercentage).toBe(45);
    expect(res.top3.length).toBe(3);
    expect(res.top3[0].label).toBe('rui');
  });

  test('Rule 3: returns ILISH when top is ilish and p >= ILISH_THRESHOLD (e.g. 0.85)', () => {
    const probs = [0.02, 0.85, 0.01, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02];
    const res = decide(probs, labels);
    expect(res.verdict).toBe('ILISH');
    expect(res.topClass).toBe('ilish');
    expect(res.topProbability).toBe(0.85);
    expect(res.topPercentage).toBe(85);
    expect(res.top3[0].label).toBe('ilish');
  });

  test('Rule 3 boundary: returns ILISH exactly at ILISH_THRESHOLD (0.80)', () => {
    const probs = [0.02, ILISH_THRESHOLD, 0.02, 0.02, 0.02, 0.02, 0.02, 0.04, 0.04];
    const res = decide(probs, labels);
    expect(res.verdict).toBe('ILISH');
    expect(res.topClass).toBe('ilish');
    expect(res.topProbability).toBe(ILISH_THRESHOLD);
  });

  test('Rule 4: returns UNSURE when top is ilish but p < ILISH_THRESHOLD (e.g. 0.72)', () => {
    const probs = [0.02, 0.72, 0.02, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04];
    const res = decide(probs, labels);
    expect(res.verdict).toBe('UNSURE');
    expect(res.topClass).toBe('ilish');
    expect(res.topProbability).toBe(0.72);
  });

  test('Rule 4 boundary: returns UNSURE just below ILISH_THRESHOLD (0.799)', () => {
    const probs = [0.01, 0.799, 0.01, 0.03, 0.03, 0.03, 0.03, 0.03, 0.031];
    const res = decide(probs, labels);
    expect(res.verdict).toBe('UNSURE');
    expect(res.topClass).toBe('ilish');
  });

  test('Rule 5: returns NOT_ILISH when top is another species with p >= MIN_CONFIDENCE', () => {
    // Rui is top at 0.91
    const probs = [0.01, 0.02, 0.01, 0.02, 0.01, 0.01, 0.01, 0.91, 0.0];
    const res = decide(probs, labels);
    expect(res.verdict).toBe('NOT_ILISH');
    expect(res.topClass).toBe('rui');
    expect(res.bestGuessSpecies).toBe('rui');
    expect(res.topProbability).toBe(0.91);
    expect(res.topPercentage).toBe(91);
  });

  test('Rule 5 boundary: returns NOT_ILISH exactly at MIN_CONFIDENCE (0.50) for another species', () => {
    const probs = [0.05, 0.1, 0.05, 0.1, 0.05, 0.05, 0.05, MIN_CONFIDENCE, 0.05];
    const res = decide(probs, labels);
    expect(res.verdict).toBe('NOT_ILISH');
    expect(res.topClass).toBe('rui');
    expect(res.bestGuessSpecies).toBe('rui');
  });

  test('Error handling: throws on length mismatch or empty input', () => {
    expect(() => decide([], labels)).toThrow();
    expect(() => decide([0.5], labels)).toThrow('Length mismatch');
  });
});
