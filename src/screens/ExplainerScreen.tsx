import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BackButton} from '../components/BackButton';
import {Button, ButtonWrapper} from '../components/Button';
import {Colors} from '../theme/theme';

interface Props {
  navigation: any;
}

export function ExplainerScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.block}>
          <Text style={styles.bigText}>{'Julia sets'}</Text>
          <Text style={styles.text}>
            {
              'Explainerdsj fhksjfh sdkjfh skdjfh sdkjhsdjf hsdkjfh sdkjfhsdkjfh sdkjfhsdkjfhsdkjfh kjd SCREEN'
            }
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.bigText}>{'Mandelbrot set'}</Text>
          <Text style={styles.text}>
            {
              'Explainerdsj fhksjfh sdkjfh skdjfh sdkjhsdjf hsdkjfh sdkjfhsdkjfh sdkjfhsdkjfhsdkjfh kjd SCREEN'
            }
          </Text>
        </View>
      </View>
      <BackButton navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    height: '100%',
    alignItems: 'center',
    width: '100%',
  },
  main: {
    flexGrow: 1,
    justifyContent: 'space-around',
    width: '100%',
  },
  block: {
    alignItems: 'center',
    padding: 15,
  },
  text: {
    color: Colors.white,
    fontSize: 15,
    width: '100%',
  },
  bigText: {
    color: Colors.orange,
    fontWeight: 'bold',
    letterSpacing: 0.6,
    fontSize: 22,
    padding: 10,
  },
});
