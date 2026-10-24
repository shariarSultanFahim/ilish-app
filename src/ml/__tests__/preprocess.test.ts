import jpeg from 'jpeg-js';
import { EXPECTED_INPUT_SIZE, MODEL_IMAGE_SIZE } from '../../config';

describe('preprocess pipeline decoding & tensor conversion', () => {
  test('decodes JPEG and converts 224x224 RGBA to Float32Array of length 150528 in raw 0..255', () => {
    // Generate a synthetic 224x224 RGBA image buffer
    const width = 224;
    const height = 224;
    const frameData = Buffer.alloc(width * height * 4);

    // Fill with known pixel values
    // Pixel 0: R=250, G=120, B=60, A=255
    frameData[0] = 250;
    frameData[1] = 120;
    frameData[2] = 60;
    frameData[3] = 255;

    // Encode to real JPEG
    const rawImageData = {
      data: frameData,
      width,
      height,
    };
    const jpegBuffer = jpeg.encode(rawImageData, 100);

    // Decode back with jpeg-js
    const decoded = jpeg.decode(jpegBuffer.data, { useTArray: true, formatAsRGBA: true });
    expect(decoded.width).toBe(MODEL_IMAGE_SIZE);
    expect(decoded.height).toBe(MODEL_IMAGE_SIZE);

    // Convert RGBA to Float32Array RGB raw 0..255
    const rgba = decoded.data;
    const input = new Float32Array(EXPECTED_INPUT_SIZE);
    let j = 0;
    for (let i = 0; i < rgba.length; i += 4) {
      input[j++] = rgba[i];
      input[j++] = rgba[i + 1];
      input[j++] = rgba[i + 2];
    }

    expect(input.length).toBe(150528);
    // Raw values must be in 0..255 range (NOT normalized to 0..1 or -1..1)
    expect(input[0]).toBeGreaterThan(200);
    expect(input[0]).toBeLessThanOrEqual(255);
  });
});
