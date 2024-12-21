const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');


/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

// First merge the default config
const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

// Then apply NativeWind and export once
module.exports = withNativeWind(mergedConfig, { input: './global.css' });