/* eslint-disable react-native/no-inline-styles */
import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  UIManager,
  TouchableNativeFeedback,
  PixelRatio,
} from 'react-native';
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
    red: 0,
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
              if (colors.length > 0) {
                const newColors = [...colors];
                newColors.splice(index, 1);
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setColors(newColors);
              }
            }}
            color={color}
          />
        ))}
      </View>
      <View style={styles.subHeader}>
        <Text key={'add-new-color'} style={[styles.text, {paddingBottom: 0}]}>
          {'Add new colour:'}
        </Text>
      </View>
      <Text key={'click-to-add'} style={[styles.text, styles.info]}>
        {
          'Use sliders to add a new colour, then click the colour to add to the colour map.'
        }
      </Text>
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
      <View style={styles.slider}>
        <Text style={[styles.text, styles.rgbText]}>{'R:'}</Text>
        <View style={{flexGrow: 1}}>
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
        </View>
      </View>
      <View style={styles.slider}>
        <Text style={[styles.text, styles.rgbText]}>{'G:'}</Text>
        <View style={{flexGrow: 1}}>
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
        </View>
      </View>
      <View style={styles.slider}>
        <Text style={[styles.text, styles.rgbText]}>{'B:'}</Text>
        <View style={{flexGrow: 1}}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  colorPicker: {width: '100%'},
  colorSlider: {
    margin: 10,
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
    borderWidth: 1 / PixelRatio.get(),
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
  info: {
    opacity: 0.25,
    marginLeft: 0,
    fontSize: 12,
    marginTop: 5,
    paddingTop: 0,
    marginBottom: 5,
  },
  slider: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rgbText: {
    opacity: 0.25,
    paddingBottom: 0,
    minWidth: 20,
    fontSize: 12,
  },
});
