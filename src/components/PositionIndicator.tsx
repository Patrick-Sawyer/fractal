import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {Colors} from '../theme/theme';

interface Props {
  right: number;
  bottom: number;
}

const WIDTH = 20;

export function PositionIndicator({right, bottom}: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  }, [anim, right, bottom]);

  return (
    <Animated.View
      style={[
        styles.indicator,
        {
          right: right + WIDTH / 2,
          bottom: bottom - WIDTH / 2,
          transform: [{scale: anim}],
          opacity: anim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  indicator: {
    height: WIDTH,
    width: WIDTH,
    borderRadius: WIDTH / 2,
    backgroundColor: Colors.white,
    position: 'absolute',
    elevation: 5,
  },
});
