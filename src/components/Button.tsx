import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Platform,
  ActivityIndicator,
} from 'react-native';

import {Colors} from '../theme/theme';

interface Props {
  text: string;
  onPress?: () => void;
  transparent?: boolean;
  color?: string;
  disabled?: boolean;
  textColor?: string;
}

export function Button({
  text,
  onPress,
  transparent = false,
  color = Colors.orange,
  disabled = false,
  textColor,
}: Props) {
  const [pressed, setPressed] = useState(false);

  const onClick = () => {
    if (disabled) {
      return;
    }
    onPress && onPress();
    setPressed(true);

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
        onPress={onClick}>
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
          {pressed ? (
            <ActivityIndicator size="small" animating color="white" />
          ) : (
            <Text
              numberOfLines={1}
              style={[styles.text, !!textColor && {color: textColor}]}>
              {text}
            </Text>
          )}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 10,
  },
  container: {
    width: '100%',
    height: 45,
    paddingBottom: 8,
  },
  inner: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
