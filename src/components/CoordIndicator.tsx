import {StyleSheet, Text, ViewStyle} from 'react-native';
import React from 'react';
import {Colors} from '../theme/theme';

interface Props {
  value: string;
  position: ViewStyle;
}

export function CoordIndicator({value, position}: Props) {
  return <Text style={[styles.text, position]}>{value}</Text>;
}

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    color: Colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    paddingVertical: 2,
    paddingHorizontal: 5,
    fontVariant: ['tabular-nums'],
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
