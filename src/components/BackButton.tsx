import React from 'react';
import {Button} from './Button';

interface Props {
  navigation: any;
}

export function BackButton({navigation}: Props) {
  return (
    <Button
      transparent
      text="Back"
      onPress={() => navigation.navigate('Home')}
    />
  );
}
