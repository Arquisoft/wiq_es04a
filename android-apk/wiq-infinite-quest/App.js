import React from 'react';
import { StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

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
        source={{ uri: 'http://wikiquest.sytes.net' }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}
