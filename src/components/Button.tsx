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
  disabled?: boolean;
}

export function Button({
  text,
  onPress,
  transparent = false,
  color = Colors.orange,
  disabled = false,
}: Props) {
  const [pressed, setPressed] = useState(false);

  const onPressIn = () => {
    if (disabled) {
      return;
    }
    onPress && onPress();
    setPressed(true);
  };

  const onPressOut = () => {
    setTimeout(() => {
      setPressed(false);
    }, 300);
  };

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(
          'rgba(255,255,255,0.1)',
          false,
        )}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <View
          style={[
            styles.inner,
            !transparent &&
              styles.shadow && {
                backgroundColor: color,
              },
            pressed &&
              (Platform.OS === 'ios' || !transparent) && {
                backgroundColor: 'rgba(0,0,0,0.1)',
              },
          ]}>
          <Text
            numberOfLines={1}
            style={[styles.text, pressed && styles.translucent]}>
            {text}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

interface ButtonWrapperProps {
  children: JSX.Element;
}

export const ButtonWrapper = ({children}: ButtonWrapperProps) => {
  return <View style={styles.buttonWrapper}>{children}</View>;
};

const styles = StyleSheet.create({
  text: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  container: {
    width: '100%',
    height: 45,
    paddingBottom: 10,
  },
  inner: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  translucent: {
    color: 'rgba(0,0,0,0.4)',
  },
  buttonWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 15,
    width: '100%',
  },
  shadow: {
    elevation: 4,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowBlur: 20,
  },
});
