import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import jpeg from 'jpeg-js';
import { toByteArray } from 'base64-js';
import { MODEL_IMAGE_SIZE, EXPECTED_INPUT_SIZE } from '../config';

export interface PreprocessResult {
  inputTensor: Float32Array; // length 224 * 224 * 3 = 150528
  preprocessTimeMs: number;
  width: number;
  height: number;
}

/**
 * Preprocess image for TFLite model according to model contract:
 * 1. Resize to exactly 224x224 (stretch, aspect ratio NOT preserved).
 * 2. Save as JPEG at max quality and request base64.
 * 3. Decode base64 JPEG using jpeg-js and assert width=224, height=224.
 * 4. Convert RGBA to flat Float32Array of length 150528 (raw 0..255, RGB order, no normalization).
 */
export async function preprocessImage(imageUri: string): Promise<PreprocessResult> {
  const startTime = Date.now();

  if (!imageUri) {
    throw new Error('Image URI is required for preprocessing');
  }

  // 1 & 2. Resize to 224x224 (stretch) using ImageManipulator
  // Using contextual ImageManipulator.manipulate API
  const context = ImageManipulator.manipulate(imageUri);
  context.resize({
    width: MODEL_IMAGE_SIZE,
    height: MODEL_IMAGE_SIZE,
  });

  const rendered = await context.renderAsync();
  const manipulated = await rendered.saveAsync({
    format: SaveFormat.JPEG,
    compress: 1.0,
    base64: true,
  });

  if (!manipulated.base64) {
    throw new Error('Failed to obtain base64 from image manipulation');
  }

  // 3. Decode base64 to binary buffer
  const rawBytes = toByteArray(manipulated.base64);

  // Decode JPEG pixels using jpeg-js
  const decoded = jpeg.decode(rawBytes, { useTArray: true, formatAsRGBA: true });

  if (decoded.width !== MODEL_IMAGE_SIZE || decoded.height !== MODEL_IMAGE_SIZE) {
    throw new Error(
      `Decoded dimensions mismatch: expected ${MODEL_IMAGE_SIZE}x${MODEL_IMAGE_SIZE}, got ${decoded.width}x${decoded.height}`
    );
  }

  // 4. Convert RGBA to flat Float32Array (RGB order, raw 0..255)
  const rgba = decoded.data;
  const input = new Float32Array(EXPECTED_INPUT_SIZE);

  let j = 0;
  for (let i = 0; i < rgba.length; i += 4) {
    input[j++] = rgba[i];     // R
    input[j++] = rgba[i + 1]; // G
    input[j++] = rgba[i + 2]; // B
    // drop alpha rgba[i + 3]
  }

  if (j !== EXPECTED_INPUT_SIZE) {
    throw new Error(`Generated tensor size mismatch: expected ${EXPECTED_INPUT_SIZE}, got ${j}`);
  }

  const preprocessTimeMs = Date.now() - startTime;

  return {
    inputTensor: input,
    preprocessTimeMs,
    width: decoded.width,
    height: decoded.height,
  };
}
