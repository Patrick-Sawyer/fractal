import React, {useRef} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';
import {Colors} from '../theme/theme';

const SLIDER_WIDTH = 16;

interface Props {
  onChange?: (value: number) => void;
  initValue?: number;
  maxValue: number;
}

export function Slider({onChange, initValue = 0, maxValue}: Props) {
  const anim = useRef<Animated.Value | null>(null);
  const width = useRef<number>();

  const onLayout = (e: LayoutChangeEvent) => {
    const totalWidth = e.nativeEvent.layout.width;
    width.current = totalWidth;
    anim.current = new Animated.Value((totalWidth * initValue) / maxValue);
  };

  const onSlide = (e: GestureResponderEvent) => {
    if (width.current) {
      const position = e.nativeEvent.locationX;
      const fraction = limit(position / width.current);
      const value = fraction * width.current - SLIDER_WIDTH / 2;
      anim.current?.setValue(value);
      onChange && onChange(fraction);
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
        {anim.current && (
          <Animated.View
            pointerEvents="none"
            style={[styles.slider, {left: anim.current}]}
          />
        )}
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
    height: 40,
    paddingHorizontal: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  responder: {
    height: 40,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    height: 6,
    backgroundColor: 'black',
    borderRadius: 3,
  },
  slider: {
    backgroundColor: Colors.white,
    height: SLIDER_WIDTH,
    width: SLIDER_WIDTH,
    borderRadius: SLIDER_WIDTH / 2,
    position: 'absolute',
    top: 12,
  },
});
