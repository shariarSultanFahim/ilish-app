export const en = {
  appTitle: 'Ilish Checker',
  appSubtitle: 'Offline Mobile Fish Classifier',
  language: 'English',
  languageToggle: 'বাংলা',
  
  // Home Screen
  takePhotoButton: 'Take Photo',
  chooseGalleryButton: 'Choose from Gallery',
  tipsCardTitle: 'Tips for a good photo',
  tip1: 'Keep the whole fish clearly in frame',
  tip2: 'Use a clear side-profile view of the body',
  tip3: 'Place against a plain, contrasting background',
  tip4: 'Ensure good natural lighting without glare',
  tip5: 'Keep hands or nets away from covering the fish',
  aboutLink: 'About this App',
  historyLink: 'History',
  historyEmpty: 'No classified photos in history yet.',
  
  // Permissions
  cameraPermissionTitle: 'Camera Permission Needed',
  cameraPermissionMessage: 'The app needs access to your camera to take photos of fish for on-device identification.',
  galleryPermissionTitle: 'Gallery Permission Needed',
  galleryPermissionMessage: 'The app needs permission to access your photo library to classify fish images.',
  openSettings: 'Open Settings',
  permissionDismiss: 'Cancel',

  // Result Screen
  verdictTitle: 'Identification Result',
  verdictIlish: 'Ilish',
  verdictIlishSub: 'Confirmed species: Tenualosa ilisha',
  verdictNotIlish: 'Not Ilish',
  verdictNotIlishSub: 'Best guess: %{species}',
  verdictUnsure: 'Not sure',
  verdictUnsureSub: 'Try a clearer photo in good lighting',
  confidenceLabel: 'Confidence',
  topPredictionsTitle: 'Top Predictions',
  inferenceTime: 'Inference time: %{total}ms (Preprocess: %{prep}ms, Model: %{model}ms)',
  checkAnotherButton: 'Check another photo',
  saveButton: 'Save to History',
  savedToast: 'Result saved to history',
  alreadySaved: 'Already saved',
  disclaimerText: 'This is an AI estimate based on 9 freshwater fish species. It cannot detect fake fish, juvenile Ilish (Jatka), or fish outside these species. Do not use it as a legal or commercial verdict.',
  analyzingImage: 'Analyzing fish photo on-device...',
  processingError: 'Failed to analyze photo. Please try again.',
  retryButton: 'Retry',

  // Species Bengali to English mappings
  species: {
    boal: 'Boal',
    ilish: 'Ilish',
    kalibaush: 'Kalibaush',
    katla: 'Katla',
    koi: 'Koi',
    mrigel: 'Mrigel',
    pabda: 'Pabda',
    rui: 'Rui',
    telapia: 'Telapia',
  },

  // About Screen
  aboutTitle: 'About Ilish Checker',
  aboutPurposeHeading: 'Purpose & University Project',
  aboutPurposeText: 'Ilish Checker is a 100% offline mobile app created for a university final year computer science and engineering project. It uses an on-device TensorFlow Lite neural network to determine whether a fish photo is Ilish (Tenualosa ilisha) or another common freshwater species.',
  offlineNoteHeading: '100% Offline Guarantee',
  offlineNoteText: 'All image processing and deep learning inference occur directly on your mobile device CPU. No internet connection, cloud server, or remote analytics are used. The app functions completely in Airplane Mode.',
  supportedSpeciesHeading: 'Supported Species (9 Classes)',
  modelDetailsHeading: 'Model Architecture',
  modelDetailsText: 'Architecture: MobileNetV2\nInput size: 224x224 RGB raw tensor\nOutput: 9 softmax class probabilities\nEngine: react-native-fast-tflite (C++ low-level core)',
  datasetCreditHeading: 'Dataset & Citation Credit',
  datasetCreditText: 'Dataset: SylFishBD\nCitation: Scientific Data 2026, DOI 10.1038/s41597-026-07552-1',
  limitationsHeading: 'Scope & Limitations',
  limitationsText: '• Out of scope: Jatka (juvenile Ilish) detection, fake/counterfeit detection, size/length measurement.\n• Only trained on 9 freshwater fish species.\n• Not intended for commercial or legal enforcement.',
  appVersionHeading: 'App Version',
  appVersionText: 'Version 1.0.0 (Final Year Project Edition)',

  // Debug Screen
  debugTitle: 'Hidden Diagnostics & Model Info',
  debugSubtitle: 'Tapped 5 times to reveal model tensor shapes and timings',
  modelStatus: 'Model Status',
  modelLoaded: 'Loaded successfully',
  modelFailed: 'Failed to load',
  inputShapeLabel: 'Input Tensor Shape',
  outputShapeLabel: 'Output Tensor Shape',
  modelLoadTimeLabel: 'Model Load Time',
  lastInferenceHeading: 'Last Image Inference Breakdown',
  noInferenceYet: 'No image classified in this session yet.',
  probabilitiesHeading: 'All 9 Class Softmax Probabilities',
  backButton: 'Back',

  // History Screen
  clearHistoryButton: 'Clear History',
  clearHistoryConfirm: 'Are you sure you want to clear all saved classification history?',
  cancelButton: 'Cancel',
  confirmButton: 'Clear',
};

export type TranslationKeys = typeof en;
