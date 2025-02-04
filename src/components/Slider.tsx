import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Slider as SliderComponent} from '@miblanchard/react-native-slider';

interface Props {
  onChange: (value: number) => void;
  value: number;
  maxValue: number;
  minValue: number;
}

export function Slider({onChange, value = 0, maxValue, minValue}: Props) {
  return (
    <SliderComponent
      maximumValue={maxValue}
      minimumValue={minValue}
      value={value}
      containerStyle={styles.container}
      minimumTrackTintColor={'rgba(255,255,255,0.5)'}
      renderThumbComponent={() => <View style={styles.thumb} />}
      trackClickable
      trackStyle={styles.track}
      onValueChange={(v: number[]) => onChange(Math.round(v[0]))}
      thumbTouchSize={{width: 40, height: 40}}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    display: 'flex',

    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumb: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: 'white',
  },
  track: {
    backgroundColor: 'black',
    height: 5,
    borderRadius: 2,
    width: '100%',
  },
});
