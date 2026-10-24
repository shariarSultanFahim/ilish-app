const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add tflite to assetExts so Metro bundles .tflite files
if (!config.resolver.assetExts.includes('tflite')) {
  config.resolver.assetExts.push('tflite');
}

module.exports = config;
