import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from '../components/Button';
import {Colors} from '../theme/theme';

export function HomeScreen() {
  return (
    <View>
      <Text style={styles.text}>{'HOME SCREEN'}</Text>
      <Button text={'Hello'} />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
  },
});
