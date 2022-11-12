import React from 'react';
import {Button, ButtonWrapper} from './Button';

interface Props {
  navigation: any;
}

export function BackButton({navigation}: Props) {
  return (
    <ButtonWrapper>
      <Button
        transparent
        text="Back"
        onPress={() => navigation.navigate('Home')}
      />
    </ButtonWrapper>
  );
}
