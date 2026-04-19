const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for finding modules in node_modules even on Windows path glitches
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

config.watchFolders = [__dirname];

module.exports = config;
