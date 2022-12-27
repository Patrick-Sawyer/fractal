import React from 'react';
import {Colors} from '../theme/theme';
import {Button} from './Button';

interface Props {
  navigation: any;
}

export function BackButton({navigation}: Props) {
  return (
    <Button
      color={Colors.blue}
      text="Back"
      onPress={() => navigation.navigate('Home')}
    />
  );
}
