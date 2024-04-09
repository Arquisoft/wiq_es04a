import React from 'react';
import { View, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
});

export default function App() {
  return (
    <SafeAreaView style={{flex:1}}>
      <WebView
        source={{ uri: 'http://20.19.89.97:3000/' }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}
