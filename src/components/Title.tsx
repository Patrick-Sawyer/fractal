import React from 'react';
import {View, Text} from 'react-native';

interface Props {
  text: string;
}

export function Title({text}: Props) {
  return (
    <View>
      <Text>{text}</Text>
    </View>
  );
}
