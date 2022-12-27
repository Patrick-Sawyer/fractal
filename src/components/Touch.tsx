import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';

interface Props {
  position: null | {
    x: number;
    y: number;
  };
}

const SIZE = 16;

export function Touch({position}: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (position) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [anim, position]);

  if (position) {
    return (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.marker,
          {
            left: position.x - SIZE / 2 + 7,
            top: position.y - SIZE / 2 + 7,

            transform: [
              {
                scale: anim,
              },
            ],
          },
        ]}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  marker: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: 'white',
    position: 'absolute',
    elevation: 10,
  },
});
