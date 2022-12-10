import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../theme/theme';
import {ScreenWrapper} from './components/ScreenWrapper';

interface Props {
  navigation: any;
}

export function ExplainerScreen({navigation}: Props) {
  return (
    <ScreenWrapper navigation={navigation}>
      <>
        <View style={styles.section}>
          <Text style={styles.bigText}>{'Julia sets'}</Text>
          <Text style={styles.text}>
            {
              'Explainerdsj fhksjfh sdkjfh skdjfh sdkjhsdjf hsdkjfh sdkjfhsdkjfh sdkjfhsdkjfhsdkjfh kjd SCREEN'
            }
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bigText}>{'Mandelbrot set'}</Text>
          <Text style={styles.text}>
            {
              'Explainerdsj fhksjfh sdkjfh skdjfh sdkjhsdjf hsdkjfh sdkjfhsdkjfh sdkjfhsdkjfhsdkjfh kjd SCREEN'
            }
          </Text>
        </View>
      </>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
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
