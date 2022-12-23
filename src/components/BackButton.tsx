import React from 'react';
import {Colors} from '../theme/theme';
import {Button} from './Button';

interface Props {
  navigation: any;
}

export function BackButton({navigation}: Props) {
  return (
    <Button
      transparent
      textColor={Colors.lightGrey}
      text="Back"
      onPress={() => navigation.navigate('Home')}
    />
  );
}
