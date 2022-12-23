import React, {useRef} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  GestureResponderEvent,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
} from 'react-native';
import {Colors} from '../theme/theme';

const SLIDER_WIDTH = 16;

interface Props {
  onChange: (value: number) => void;
  initValue?: number;
  maxValue: number;
  minValue: number;
}

export function Slider({onChange, initValue = 0, maxValue, minValue}: Props) {
  const anim = useRef<Animated.Value | null>(null);
  const width = useRef<number>();
  const lastUpdate = useRef<number>(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const totalWidth = e.nativeEvent.layout.width;
    width.current = totalWidth;
    anim.current = new Animated.Value(
      ((totalWidth - SLIDER_WIDTH) * initValue) / (maxValue - minValue),
    );
  };

  const debounced = (value: number) => {
    const now = Date.now();

    if (now - lastUpdate.current > 250) {
      onChange(value);
      lastUpdate.current = now;
    }
  };

  const onSlide = (e: GestureResponderEvent, useReal = false) => {
    e.stopPropagation();

    if (width.current) {
      const position = e.nativeEvent.locationX;
      const fraction = limit(position / width.current);
      const animValue = fraction * width.current - SLIDER_WIDTH / 2;
      anim.current?.setValue(animValue);
      const nextValue = Math.round(fraction * (maxValue - minValue)) + minValue;
      useReal ? onChange(nextValue) : debounced(nextValue);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View
        onLayout={onLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onMoveShouldSetResponderCapture={() => true}
        onStartShouldSetResponderCapture={() => true}
        onResponderTerminationRequest={() => false}
        onResponderStart={e => onSlide(e, true)}
        onResponderMove={e => onSlide(e)}
        onResponderEnd={e => onSlide(e, true)}
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
    marginBottom: 20,
    marginTop: 10,
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
