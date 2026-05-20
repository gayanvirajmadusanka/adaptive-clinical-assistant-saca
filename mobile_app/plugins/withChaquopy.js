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

// Packages exactly as listed in backend_release_android/requirements_android.txt
const PIP_PACKAGES = [
  'fastapi==0.115.0',
  'uvicorn==0.34.0',
  'scikit-learn==1.5.2',
  'xgboost==2.1.1',
  'imbalanced-learn==0.12.4',
  'numpy==1.26.4',
  'scipy==1.13.1',
  'spacy==3.7.4',
  // spaCy model bundled as a wheel URL
  'https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl',
  'rapidfuzz==3.14.5',
  'faster-whisper',
  'python_speech_features',
  'pydantic==2.9.2',
  'soundfile',
  'webrtcvad-wheels==2.0.14',
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
