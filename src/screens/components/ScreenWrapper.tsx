import React from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {BackButton} from '../../components/BackButton';

interface Props {
  navigation: any;
  children: React.ReactNode;
}

export function ScreenWrapper({navigation, children}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <>
        {children}
        <BackButton navigation={navigation} />
      </>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 10,
  },
});
