import React from 'react';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <WebView
      source={{ uri: 'http://20.19.89.97:3000/' }}
      style={{ flex: 1 }}
    />
  );
}
