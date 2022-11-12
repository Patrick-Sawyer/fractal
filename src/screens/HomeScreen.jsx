import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export function HomeScreen() {
  return (
    <View>
      <Text style={styles.text}>{'HOME SCREEN'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#ff0000',
  },
});
