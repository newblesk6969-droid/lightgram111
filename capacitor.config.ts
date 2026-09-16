import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lightgram.app',
  appName: 'LightGram',
  webDir: 'dist',
  android: {
    backgroundColor: '#000000',
    allowMixedContent: false,
  captureInput: true,
    webContentsDebuggingEnabled: false,
  initialLogLevel: 'ERROR',
  keepRunning: true,
  backgroundColorHex: '#000000',
  disableScrolling: false,
    hideLogs: true,
  defaultZoom: 1.0,
  minimumZoom: 1.0,
    maximumZoom: 1.0,
  viewport: {
      initialScale: 1.0,
      minimumScale: 1.0,
      maximumScale: 1.0,
      userScalable: false,
      widthToViewport: 'device-width',
    },
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
