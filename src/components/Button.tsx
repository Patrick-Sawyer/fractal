import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

import {Colors} from '../theme/theme';

interface Props {
  text: string;
  onPress?: () => void;
  transparent?: boolean;
  color?: string;
}

export function Button({
  text,
  onPress,
  transparent = false,
  color = Colors.orange,
}: Props) {
  const [pressed, setPressed] = useState(false);

  const onPressIn = () => {
    setPressed(true);
  };

  const onPressOut = () => {
    setPressed(false);
    setTimeout(() => {
      onPress && onPress();
    }, 200);
  };

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(Colors.white, false)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <View
          style={[
            styles.inner,
            !transparent && {
              backgroundColor: color,
            },
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.text, pressed && styles.pressedText]}>
            {text}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.6,
  },
  container: {
    width: '100%',
    height: 67,
    padding: 10,
  },
  inner: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 1,
  },
  pressed: {
    backgroundColor: Colors.grey,
    opacity: Platform.OS === 'ios' ? 0.5 : 0.2,
  },
  pressedText: {
    opacity: Platform.OS === 'ios' ? 0.3 : 1,
  },
});
