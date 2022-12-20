import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../theme/theme';

interface Props {
  value: string | number;
  rotate?: '90deg' | '180deg' | '270deg';
  flip?: boolean;
}

export function CoordIndicator({value, rotate, flip}: Props) {
  return (
    <View style={[styles.wrapper, !!rotate && {transform: [{rotate}]}]}>
      <Text style={[styles.text, flip && {transform: [{rotate: '180deg'}]}]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    color: Colors.white,
    fontSize: 13,
    paddingVertical: 2,
    paddingHorizontal: 5,
    fontVariant: ['tabular-nums'],
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
