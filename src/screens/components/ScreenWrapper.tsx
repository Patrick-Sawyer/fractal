import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BackButton} from '../../components/BackButton';

interface Props {
  navigation: any;
  children: React.ReactNode;
}

export function ScreenWrapper({navigation, children}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.main}>{children}</View>
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
    justifyContent: 'center',
    width: '100%',
  },
});
