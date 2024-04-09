import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  webview: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? -Constants.statusBarHeight : 0, 
    paddingTop: 0
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
