import { TranslationKeys } from './en';

export const bn: TranslationKeys = {
  appTitle: 'ইলিশ চেকার',
  appSubtitle: 'অফলাইন মোবাইল মাছ শনাক্তকারী',
  language: 'বাংলা',
  languageToggle: 'English',

  // Home Screen
  takePhotoButton: 'ছবি তুলুন',
  chooseGalleryButton: 'গ্যালারি থেকে বেছে নিন',
  tipsCardTitle: 'সঠিক ছবির জন্য টিপস',
  tip1: 'পুরো মাছটি ফ্রেমের মধ্যে স্পষ্ট রাখুন',
  tip2: 'মাছের পাশ থেকে পরিষ্কার ছবি তুলুন',
  tip3: 'পরিষ্কার ও স্পষ্ট বিপরীত রঙের পটভূমিতে রাখুন',
  tip4: 'পর্যাপ্ত প্রাকৃতিক আলো নিশ্চিত করুন',
  tip5: 'হাত বা জাল দিয়ে মাছ ঢেকে রাখবেন না',
  aboutLink: 'অ্যাপ সম্পর্কে',
  historyLink: 'ইতিহাস',
  historyEmpty: 'এখনও কোনো মাছের ছবি সংরক্ষণ করা হয়নি।',

  // Permissions
  cameraPermissionTitle: 'ক্যামেরা অনুমতি প্রয়োজন',
  cameraPermissionMessage: 'মাছের ছবি তুলে শনাক্ত করার জন্য ক্যামেরার অনুমতি প্রয়োজন।',
  galleryPermissionTitle: 'গ্যালারির অনুমতি প্রয়োজন',
  galleryPermissionMessage: 'মাছের ছবি বাছাই করতে আপনার ডিভাইসের ছবির লাইব্রেরি ব্যবহারের অনুমতি প্রয়োজন।',
  openSettings: 'সেটিংস খুলুন',
  permissionDismiss: 'বাতিল',

  // Result Screen
  verdictTitle: 'শনাক্তকরণ ফলাফল',
  verdictIlish: 'ইলিশ',
  verdictIlishSub: 'নিশ্চিত প্রজাতি: ইলিশ (Tenualosa ilisha)',
  verdictNotIlish: 'ইলিশ নয়',
  verdictNotIlishSub: 'সম্ভাব্য মাছ: %{species}',
  verdictUnsure: 'নিশ্চিত নয়',
  verdictUnsureSub: 'ভালো আলোতে স্পষ্ট একটি ছবি তোলার চেষ্টা করুন',
  confidenceLabel: 'নির্ভরযোগ্যতা',
  topPredictionsTitle: 'শীর্ষ ফলাফলসমূহ',
  inferenceTime: 'শনাক্তকরণ সময়: %{total}ms (প্রসেস: %{prep}ms, মডেল: %{model}ms)',
  checkAnotherButton: 'অন্য ছবি পরীক্ষা করুন',
  saveButton: 'সংরক্ষণ করুন',
  savedToast: 'ফলাফল সংরক্ষিত হয়েছে',
  alreadySaved: 'ইতিমধ্যে সংরক্ষিত',
  disclaimerText: 'এটি ৯টি স্বাদুপানির মাছের প্রজাতির ওপর প্রশিক্ষিত কৃত্রিম বুদ্ধিমত্তার সম্ভাব্য ফলাফল। এটি নকল মাছ, জাটকা ইলিশ বা অন্য কোনো মাছ শনাক্ত করতে পারে না। এটিকে আইনি বা বাণিজ্যিক রায় হিসেবে ব্যবহার করবেন না।',
  analyzingImage: 'ডিভাইসে ছবি বিশ্লেষণ করা হচ্ছে...',
  processingError: 'ছবি বিশ্লেষণ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
  retryButton: 'আবার চেষ্টা করুন',

  // Species Bengali to English mappings
  species: {
    boal: 'বোয়াল',
    ilish: 'ইলিশ',
    kalibaush: 'কালিবাউশ',
    katla: 'কাতলা',
    koi: 'কই',
    mrigel: 'মৃগেল',
    pabda: 'পাবদা',
    rui: 'রুই',
    telapia: 'তেলাপিয়া',
  },

  // About Screen
  aboutTitle: 'ইলিশ চেকার পরিচিতি',
  aboutPurposeHeading: 'উদ্দেশ্য ও বিশ্ববিদ্যালয় ফাইনাল প্রজেক্ট',
  aboutPurposeText: 'ইলিশ চেকার একটি শতভাগ অফলাইন মোবাইল অ্যাপ্লিকেশন যা বিশ্ববিদ্যালয়ের চূড়ান্ত বর্ষের গবেষণামূলক প্রকল্পের অংশ হিসেবে তৈরি। এটি অন-ডিভাইস টেনসরফ্লো লাইট কৃত্রিম বুদ্ধিমত্তা মডেল ব্যবহার করে মাছটি ইলিশ নাকি অন্য কোনো স্বাদুপানির প্রজাতি তা নির্ভুলভাবে চিহ্নিত করে।',
  offlineNoteHeading: '১০০% সম্পূর্ণ অফলাইন নিশ্চয়তা',
  offlineNoteText: 'সমস্ত ইমেজ প্রসেসিং এবং এআই বিশ্লেষণ সরাসরি আপনার ফোনের সিপিইউতে চলে। কোনো ক্লাউড সার্ভার বা ইন্টারনেটের প্রয়োজন নেই। অ্যাপটি পুরোপুরি ফ্লাইট/বিমান মোডেও সচল থাকে।',
  supportedSpeciesHeading: 'সমর্থিত ৯টি মাছের প্রজাতি',
  modelDetailsHeading: 'মডেল আর্কিটেকচার',
  modelDetailsText: 'আর্কিটেকচার: MobileNetV2\nইনপুট সাইজ: 224x224 আরজিবি টেনসর\nআউটপুট: ৯টি সফটম্যাক্স সম্ভাব্যতার মান\nইঞ্জিন: react-native-fast-tflite (C++ কোর)',
  datasetCreditHeading: 'ডেটাবেস ও সাইটেশন কৃতজ্ঞতা',
  datasetCreditText: 'ডেটাবেস: SylFishBD\nসাইটেশন: Scientific Data 2026, DOI 10.1038/s41597-026-07552-1',
  limitationsHeading: 'সীমাবদ্ধতা ও সতর্কবার্তা',
  limitationsText: '• জাটকা শনাক্তকরণ, নকল ইলিশ যাচাইকরণ অথবা আকার পরিমাপের সুযোগ নেই।\n• শুধুমাত্র ৯টি নির্ধারিত মিঠা পানির মাছের ওপর কার্যকর।\n• বাণিজ্যিক বা আইন প্রয়োগের জন্য গ্রহণযোগ্য নয়।',
  appVersionHeading: 'অ্যাপ সংস্করণ',
  appVersionText: 'সংস্করণ ১.০.০ (ফাইনাল ইয়ার প্রজেক্ট সংস্করণ)',

  // Debug Screen
  debugTitle: 'লুকানো ডায়াগনস্টিক তথ্য',
  debugSubtitle: 'মডেল টেনসর আকার ও সময় জানতে অ্যাপ শিরোনামে ৫ বার স্পর্শ করুন',
  modelStatus: 'মডেলের অবস্থা',
  modelLoaded: 'সফলভাবে লোড হয়েছে',
  modelFailed: 'লোড ব্যর্থ হয়েছে',
  inputShapeLabel: 'ইনপুট টেনসর আকার',
  outputShapeLabel: 'আউটপুট টেনসর আকার',
  modelLoadTimeLabel: 'মডেল লোড সময়',
  lastInferenceHeading: 'সর্বশেষ ছবির পারফরম্যান্স',
  noInferenceYet: 'এই সেশনে এখনও কোনো ছবি বিশ্লেষণ করা হয়নি।',
  probabilitiesHeading: '৯টি ক্লাসের বিস্তারিত সফটম্যাক্স সম্ভাবনা',
  backButton: 'পেছনে যান',

  // History Screen
  clearHistoryButton: 'ইতিহাস মুছুন',
  clearHistoryConfirm: 'আপনি কি নিশ্চিত যে সমস্ত সংরক্ষিত ইতিহাস মুছে ফেলতে চান?',
  cancelButton: 'বাতিল',
  confirmButton: 'মুছুন',
};
