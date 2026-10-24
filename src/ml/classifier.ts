import { loadTensorflowModel, TfliteModel, Tensor } from 'react-native-fast-tflite';
import { EXPECTED_LABELS, EXPECTED_CLASSES_COUNT, MODEL_IMAGE_SIZE, EXPECTED_CHANNELS } from '../config';
import { decide, DecisionResult } from './decide';
import { preprocessImage } from './preprocess';

export interface ModelMetadata {
  inputs: Tensor[];
  outputs: Tensor[];
  loadTimeMs: number;
  isLoaded: boolean;
  validationError?: string;
}

export interface InferenceResult {
  decision: DecisionResult;
  preprocessTimeMs: number;
  modelTimeMs: number;
  totalTimeMs: number;
  imageUri: string;
}

// Global cached model instance
let loadedModel: TfliteModel | null = null;
let modelMetadata: ModelMetadata = {
  inputs: [],
  outputs: [],
  loadTimeMs: 0,
  isLoaded: false,
};
let lastInferenceDetails: InferenceResult | null = null;

/**
 * Validate that the model satisfies the contract in AGENTS.md:
 * - Input: [1, 224, 224, 3], dtype float32
 * - Output: [1, 9], dtype float32
 */
function validateContract(inputs: Tensor[], outputs: Tensor[]): string | null {
  if (!inputs || inputs.length !== 1) {
    return `Expected exactly 1 input tensor, but found ${inputs ? inputs.length : 0}`;
  }
  const input = inputs[0];
  const inShape = input.shape;
  const isInputShapeValid =
    (inShape.length === 4 &&
      inShape[0] === 1 &&
      inShape[1] === MODEL_IMAGE_SIZE &&
      inShape[2] === MODEL_IMAGE_SIZE &&
      inShape[3] === EXPECTED_CHANNELS) ||
    // Some runtimes don't include batch dim in shape or represent as [224, 224, 3]
    (inShape.length === 3 &&
      inShape[0] === MODEL_IMAGE_SIZE &&
      inShape[1] === MODEL_IMAGE_SIZE &&
      inShape[2] === EXPECTED_CHANNELS);

  if (!isInputShapeValid) {
    return `Model input shape mismatch: expected [1, 224, 224, 3], got [${inShape.join(', ')}]`;
  }
  if (input.dataType !== 'float32') {
    return `Model input dataType mismatch: expected float32, got ${input.dataType}`;
  }

  if (!outputs || outputs.length !== 1) {
    return `Expected exactly 1 output tensor, but found ${outputs ? outputs.length : 0}`;
  }
  const output = outputs[0];
  const outShape = output.shape;
  const isOutputShapeValid =
    (outShape.length === 2 && outShape[0] === 1 && outShape[1] === EXPECTED_CLASSES_COUNT) ||
    (outShape.length === 1 && outShape[0] === EXPECTED_CLASSES_COUNT);

  if (!isOutputShapeValid) {
    return `Model output shape mismatch: expected [1, 9], got [${outShape.join(', ')}]`;
  }
  if (output.dataType !== 'float32') {
    return `Model output dataType mismatch: expected float32, got ${output.dataType}`;
  }

  return null;
}

/**
 * Loads the TFLite model using default CPU delegate.
 * Logs shapes and validates against the contract in AGENTS.md.
 */
export async function initClassifier(): Promise<ModelMetadata> {
  if (loadedModel && modelMetadata.isLoaded) {
    return modelMetadata;
  }

  const start = Date.now();
  try {
    // Model is bundled via Metro assetExts: require('../../assets/model/ilish_classifier.tflite')
    // Use default CPU delegate (empty array)
    const model = await loadTensorflowModel(
      require('../../assets/model/ilish_classifier.tflite'),
      []
    );

    const loadTimeMs = Date.now() - start;
    const inputs = model.inputs;
    const outputs = model.outputs;

    console.log('[Classifier] Model loaded successfully:');
    console.log('[Classifier] Inputs:', JSON.stringify(inputs));
    console.log('[Classifier] Outputs:', JSON.stringify(outputs));
    console.log(`[Classifier] Load time: ${loadTimeMs}ms`);

    const validationError = validateContract(inputs, outputs);
    if (validationError) {
      console.error('[Classifier] Contract validation failed:', validationError);
      modelMetadata = {
        inputs,
        outputs,
        loadTimeMs,
        isLoaded: false,
        validationError,
      };
      throw new Error(`Model contract violation: ${validationError}`);
    }

    loadedModel = model;
    modelMetadata = {
      inputs,
      outputs,
      loadTimeMs,
      isLoaded: true,
    };
    return modelMetadata;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    modelMetadata = {
      inputs: [],
      outputs: [],
      loadTimeMs: Date.now() - start,
      isLoaded: false,
      validationError: message,
    };
    console.error('[Classifier] Error loading model:', message);
    throw error;
  }
}

/**
 * Get current classifier metadata for debug screens
 */
export function getModelMetadata(): ModelMetadata {
  return modelMetadata;
}

/**
 * Get the last inference details for debug screen
 */
export function getLastInferenceDetails(): InferenceResult | null {
  return lastInferenceDetails;
}

/**
 * Run full inference pipeline on an image URI:
 * 1. Preprocessing (stretch resize 224x224, decode JPEG, flat Float32Array 0..255)
 * 2. Model inference via fast-tflite
 * 3. Pure decision logic via decide()
 */
export async function classifyFish(imageUri: string): Promise<InferenceResult> {
  if (!loadedModel) {
    await initClassifier();
  }
  if (!loadedModel) {
    throw new Error('Model could not be initialized');
  }

  // 1. Preprocess
  const { inputTensor, preprocessTimeMs } = await preprocessImage(imageUri);

  // 2. Run inference
  const modelStart = Date.now();
  // Pass the raw ArrayBuffer slice
  const rawInputBuffer = inputTensor.buffer.slice(
    inputTensor.byteOffset,
    inputTensor.byteOffset + inputTensor.byteLength
  ) as ArrayBuffer;

  const outputs = await loadedModel.run([rawInputBuffer]);
  const modelTimeMs = Date.now() - modelStart;

  if (!outputs || outputs.length === 0) {
    throw new Error('Model produced no output');
  }

  // 3. Interpret output tensor
  const probsOutput = new Float32Array(outputs[0]);
  const probsArray = Array.from(probsOutput);

  // 4. Decision logic
  const decision = decide(probsArray, [...EXPECTED_LABELS]);

  const result: InferenceResult = {
    decision,
    preprocessTimeMs,
    modelTimeMs,
    totalTimeMs: preprocessTimeMs + modelTimeMs,
    imageUri,
  };

  lastInferenceDetails = result;
  return result;
}
