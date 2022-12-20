import React, {useRef} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';
import {Colors} from '../theme/theme';

const SLIDER_WIDTH = 20;

interface Props {
  onChange?: (value: number) => void;
  initValue?: number;
}

export function Slider({onChange, initValue = 0}: Props) {
  const anim = useRef(new Animated.Value(initValue)).current;
  const width = useRef<number>();

  const onLayout = (e: LayoutChangeEvent) => {
    width.current = e.nativeEvent.layout.width;
  };

  const onSlide = (e: GestureResponderEvent) => {
    if (width.current) {
      const position = e.nativeEvent.locationX;
      const fraction = limit(position / width.current);
      onChange && onChange(fraction);
      const value = fraction * width.current - SLIDER_WIDTH / 2;
      anim.setValue(value);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View
        onLayout={onLayout}
        onStartShouldSetResponder={() => true}
        onResponderStart={onSlide}
        onResponderMove={onSlide}
        onResponderEnd={onSlide}
        style={styles.responder}>
        <View pointerEvents="none" style={styles.track} />
        <Animated.View
          pointerEvents="none"
          style={[styles.slider, {left: anim}]}
        />
      </View>
    </View>
  );
}

const limit = (value: number) => {
  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return value;
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 20,
    paddingHorizontal: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  responder: {
    height: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.blackish,
    borderRadius: 3,
  },
  slider: {
    backgroundColor: Colors.red,
    height: SLIDER_WIDTH,
    width: SLIDER_WIDTH,
    borderRadius: SLIDER_WIDTH / 2,
    position: 'absolute',
    top: 0,
    borderWidth: 2,
    borderColor: Colors.yellow,
    shadowColor: Colors.yellow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 2.62,
  },
});
