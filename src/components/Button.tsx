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
    onPress && onPress();
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
            pressed && (Platform.OS === 'ios' || !transparent) && styles.grey,
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
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.4,
    paddingHorizontal: 10,
  },
  container: {
    width: '100%',
    height: 60,
    paddingTop: 10,
  },
  inner: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  translucent: {
    color: 'rgba(0,0,0,0.4)',
  },
  grey: {
    backgroundColor: Colors.darkishGrey,
  },
  buttonWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 10,
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
