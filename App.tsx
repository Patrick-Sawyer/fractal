import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Colors} from './src/theme/theme';

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.blackish} />
      <View style={styles.main}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.blackish,
    border: '1px solid red',
  },
  main: {
    height: '100%',
    backgroundColor: Colors.darkGrey,
  },
});

export default App;
