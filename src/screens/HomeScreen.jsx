import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../theme/theme';

export function HomeScreen() {
  return (
    <View>
      <Text style={styles.text}>{'HOME SCREEN'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
  },
});
