import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  UIManager,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import {INIT_COLORS} from '../screens/HomeScreen';
import {Colors} from '../theme/theme';
import {Slider} from './Slider';

UIManager.setLayoutAnimationEnabledExperimental(true);

export interface Color {
  red: number;
  green: number;
  blue: number;
}

interface SelectedColorProps {
  color: Color;
  onPress?: () => void;
  onLongPress?: () => void;
}

const SelectedColor = ({color, onPress, onLongPress}: SelectedColorProps) => {
  return (
    <TouchableNativeFeedback onPress={onPress} onLongPress={onLongPress}>
      <View
        style={[
          styles.block,
          {backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`},
        ]}
      />
    </TouchableNativeFeedback>
  );
};

interface Props {
  colors: Color[];
  setColors: Dispatch<SetStateAction<Color[]>>;
}

export function RGBSelector({colors, setColors}: Props) {
  const lastAction = useRef(0);
  const [newColor, setNewColor] = useState<Color>({
    red: 255,
    green: 0,
    blue: 0,
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.selectedColors}>
        {colors.map((color, index) => (
          <SelectedColor
            key={index}
            onLongPress={() => {
              const newColors = [...colors];
              newColors.splice(index, 1);
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setColors(newColors);
            }}
            color={color}
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={() => {
          setColors(INIT_COLORS);
        }}>
        <Text style={[styles.text, styles.button]}>{'Revert colours'}</Text>
      </TouchableOpacity>
      <View style={styles.subHeader}>
        <Text key={'add-new-color'} style={styles.text}>
          {'Add new colour:'}
        </Text>
        <Text key={'click-to-add'} style={[styles.text, styles.opacity]}>
          {'Click to add'}
        </Text>
      </View>
      <View style={styles.newColor}>
        <SelectedColor
          key={'new-color'}
          onPress={() => {
            const now = Date.now();
            if (now - lastAction.current > 1000) {
              const newColors = [...colors];
              newColors.push(newColor);
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              setColors(newColors);
              lastAction.current = now;
            }
          }}
          color={newColor}
        />
      </View>
      <Text style={styles.text}>{'RGB:'}</Text>
      <Slider
        minValue={0}
        maxValue={255}
        value={newColor.red}
        onChange={value => {
          const color = {...newColor};
          color.red = value;
          setNewColor(color);
        }}
      />

      <Slider
        minValue={0}
        maxValue={255}
        onChange={value => {
          const color = {...newColor};
          color.green = value;
          setNewColor(color);
        }}
        value={newColor.green}
      />

      <Slider
        minValue={0}
        maxValue={255}
        value={newColor.blue}
        onChange={value => {
          const color = {...newColor};
          color.blue = value;
          setNewColor(color);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  colorPicker: {width: '100%'},
  colorSlider: {
    margin: 10,
  },
  rgbText: {
    marginTop: 10,
  },
  opacity: {
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 10,
  },
  subHeader: {
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  newColor: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  text: {
    color: Colors.white,
    fontWeight: '400',
    fontSize: 15,
    paddingBottom: 10,
    fontVariant: ['tabular-nums'],
    opacity: 0.5,
  },
  wrapper: {
    marginVertical: 10,
  },
  block: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 2,
    height: 40,
    width: 65,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    marginHorizontal: 5,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  newColorBlock: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 2,
    height: 40,
    width: 65,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  selectedColors: {
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  button: {
    color: 'white',
    padding: 10,
    paddingBottom: 15,
    textAlign: 'center',
  },
});
