import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, ButtonWrapper} from '../components/Button';
import {Colors} from '../theme/theme';

interface Props {
  navigation: any;
}

export function HomeScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{'HOME SCREEN'}</Text>
      <ButtonWrapper>
        <>
          <Button color={Colors.maroon} text={'Hello'} />
          <Button
            onPress={() => {
              navigation.navigate('Explainer');
            }}
            color={Colors.red}
            text={"What the chuffin' heck is a fractal"}
          />
          <Button text={'Shut up and show me pretty things'} />
        </>
      </ButtonWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
  },
  container: {
    height: '100%',
    justifyContent: 'space-around',
  },
});
