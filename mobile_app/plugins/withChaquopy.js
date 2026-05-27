/**
 * Expo config plugin that wires up Chaquopy Python-in-Android.
 * Applied automatically when 'expo prebuild --platform android' runs.
 *
 * What it does:
 *   1. Adds Chaquopy classpath to the root build.gradle
 *   2. Applies the Chaquopy plugin in app/build.gradle
 *   3. Adds NDK ABI filters (arm64-v8a, x86_64)
 *   4. Adds all required pip installs inside a python {} block
 */

const { withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins');

const CHAQUOPY_VERSION = '15.0.1';

// Pinned to versions with pre-built Android wheels in Chaquopy's pypi-13.1 mirror.
// Python 3.10 is used because it supports modern type hints (str | None) and has
// pre-built wheels for all required native packages. xgboost removed - not used.
const PIP_PACKAGES = [
  'flask==3.1.0',
  'fastapi==0.115.0',
  'uvicorn==0.33.0',
  'scikit-learn==1.3.2',
  'numpy',
  'scipy',
  'rapidfuzz',
  'python_speech_features',
  'pydantic==1.10.21',
  'soundfile',
];

function withChaquopyRootBuild(config) {
  return withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (contents.includes('com.chaquo.python')) {
      return config; // already applied
    }

    // Insert Chaquopy classpath after the last existing classpath line
    contents = contents.replace(
      /(classpath\([^)]+\)\s*\n)(\s*\})/,
      `$1        classpath("com.chaquo.python:gradle:${CHAQUOPY_VERSION}")\n$2`
    );

    config.modResults.contents = contents;
    return config;
  });
}

function withChaquopyAppBuild(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (contents.includes('com.chaquo.python')) {
      return config; // already applied
    }

    // Apply Chaquopy plugin after the React Native plugin
    contents = contents.replace(
      'apply plugin: "com.facebook.react"',
      'apply plugin: "com.facebook.react"\napply plugin: "com.chaquo.python"'
    );

    // Build the python {} config block
    const pipLines = PIP_PACKAGES.map(p => `            install "${p}"`).join('\n');
    const pythonBlock = `
        ndk {
            abiFilters "arm64-v8a", "x86_64"
        }
        python {
            version "3.10"
            pip {
${pipLines}
            }
        }`;

    // Inject into defaultConfig { ... }
    contents = contents.replace(
      /defaultConfig\s*\{/,
      `defaultConfig {${pythonBlock}`
    );

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = function withChaquopy(config) {
  config = withChaquopyRootBuild(config);
  config = withChaquopyAppBuild(config);
  return config;
};
