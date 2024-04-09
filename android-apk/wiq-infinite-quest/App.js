import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'http://20.19.89.97:3000/' }}
        style={styles.webview}
      />
  </View>
  );
}
