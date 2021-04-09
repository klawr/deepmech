import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/Redux/store';
import Mec2 from './src/Components/Mec2/Mec2';

export default function App() {
  return <View style={styles.container}>
    <Provider store={store}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Mec2 />
    </Provider>
    <StatusBar style="auto" />
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
