import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  useWindowDimensions,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from '../components/Button';
import {CoordIndicator} from '../components/CoordIndicator';
import {Fractal} from '../components/Fractal';
import {Color, RGBSelector} from '../components/RGBSelector';
import {Slider} from '../components/Slider';
import {Touch} from '../components/Touch';
import {Colors} from '../theme/theme';
import {Complex, getCoord, Range} from '../utils/fractalUtils';

const MIN_SENSITIVITY = 10;
const MAX_SENSITIVITY = 500;
const SENSITIVITY_INIT_VALUE = 500;
const BLUE: Color = {red: 10, green: 0, blue: 156};
const WHITE: Color = {red: 255, green: 255, blue: 255};
const YELLOW: Color = {
  red: 255,
  green: 187,
  blue: 0,
};

const MAROON: Color = {
  red: 144,
  green: 12,
  blue: 63,
};

export const INIT_COLORS: Color[] = [BLUE, WHITE, YELLOW, MAROON];

const convertColors = (colors: Color[], repetition = 1): string[] => {
  const colorMap = colors.map(
    ({red, green, blue}) => `${red},${green},${blue}`,
  );

  let fullColorMap: string[] = [];

  for (let i = 0; i < repetition; i++) {
    fullColorMap = fullColorMap.concat(colorMap);
  }
  return fullColorMap;
};

interface Props {
  navigation: any;
}

const INIT_RANGE: Range = {
  x: {
    upper: 0.7,
    lower: -1.7,
  },
  y: {
    upper: 1.2,
    lower: -1.2,
  },
};

const INIT_JULIA_SET_RANGE = {
  x: {
    upper: 1.7,
    lower: -1.7,
  },
  y: {
    upper: 1.7,
    lower: -1.7,
  },
};

interface FractalSettings {
  juliaSetValue: Complex | null;
  range: Range;
  sensitivity: number;
  colors: string[];
}

const calcToFixedValue = ({range}: FractalSettings): number => {
  const {upper, lower} = range.x;
  const diff = upper - lower;
  let blah = diff * 1000;
  let result = 4;

  while (blah < 1 && result < 15) {
    blah = blah * 10;
    result++;
  }

  return result;
};

interface Touch {
  x: number;
  y: number;
}

const DEFAULT_SETTINGS = {
  range: INIT_RANGE,
  juliaSetValue: null,
  sensitivity: SENSITIVITY_INIT_VALUE,
  colors: convertColors(INIT_COLORS, 1),
};

export function HomeScreen({navigation}: Props) {
  const size = useWindowDimensions().width - 16;
  const [renderFractal, setRenderFractal] = useState(false);
  const [complex, setComplex] = useState<Complex>({real: 0, imaginary: 0});
  const [colors, setColors] = useState<Color[]>(INIT_COLORS);
  const [touch, setTouch] = useState<Touch | null>(null);
  const [colourMapRepetition, setColourMapRepetition] = useState(1);
  const textColorAnimation = useRef(new Animated.Value(0)).current;
  const [fractalSettings, setFractalSettings] =
    useState<FractalSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const toFixedValue = calcToFixedValue(fractalSettings);
  const [sensitivity, setSensitivity] = useState(SENSITIVITY_INIT_VALUE);

  const textColor = textColorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(255, 255, 255)', 'rgb(0, 30, 255)'],
  });

  const onPressFractal = (e: GestureResponderEvent) => {
    Animated.timing(textColorAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(textColorAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    });
    const {locationX, locationY} = e.nativeEvent;
    const newCoord = getCoord(size, fractalSettings.range, {
      x: locationX,
      y: locationY,
    });
    setComplex(newCoord);
    setTouch({x: locationX, y: locationY});
  };

  const zoom = () => {
    const settings = {...fractalSettings};
    const {upper, lower} = settings.range.x;
    const currentZoom = upper - lower;
    const newZoom = currentZoom / 20;

    settings.range = {
      x: {
        upper: complex.real + newZoom,
        lower: complex.real - newZoom,
      },
      y: {
        upper: complex.imaginary + newZoom,
        lower: complex.imaginary - newZoom,
      },
    };

    settings.sensitivity = sensitivity;
    settings.colors = convertColors(colors, colourMapRepetition);

    setFractalSettings(settings);
  };

  useEffect(() => {
    setTouch(null);
  }, [fractalSettings]);

  useEffect(() => {
    setTimeout(() => {
      setRenderFractal(true);
    }, 500);
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{overflow: 'visible'}}>
        <View style={[styles.fractal, {height: size, width: size}]}>
          {renderFractal && (
            <Fractal setLoading={setLoading} size={size} {...fractalSettings} />
          )}
          <TouchableNativeFeedback onPress={onPressFractal}>
            <View style={styles.ranges}>
              <CoordIndicator
                value={
                  fractalSettings.range.y.upper.toFixed(toFixedValue) + 'i'
                }
              />
              <CoordIndicator
                value={fractalSettings.range.x.upper.toFixed(toFixedValue)}
                rotate="90deg"
              />
              <CoordIndicator
                value={fractalSettings.range.x.lower.toFixed(toFixedValue)}
                rotate="270deg"
              />
              <CoordIndicator
                value={
                  fractalSettings.range.y.lower.toFixed(toFixedValue) + 'i'
                }
                rotate="180deg"
                flip
              />
              {loading && (
                <View style={styles.loading} pointerEvents="none">
                  <ActivityIndicator
                    animating
                    color={Colors.white}
                    size={'large'}
                  />
                </View>
              )}
            </View>
          </TouchableNativeFeedback>
        </View>
        {!loading && <Touch position={touch} />}
      </View>
      <View style={[styles.section, styles.board]}>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.large]}>{'Coordinate'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.light]}>{'Real:'}</Text>
          <Animated.Text
            style={[
              styles.text,
              {
                color: textColor,
              },
            ]}>
            {complex.real.toFixed(15)}
          </Animated.Text>
        </View>
        <View style={[styles.textRow, {marginBottom: 15}]}>
          <Text style={[styles.text, styles.light]}>{'Imaginary:'}</Text>
          <Animated.Text
            style={[
              styles.text,
              {
                color: textColor,
              },
            ]}>
            {complex.imaginary.toFixed(15)}
          </Animated.Text>
        </View>
        <Button
          text={'Zoom into this coord'}
          onPress={zoom}
          color={Colors.orange}
          disabled={loading}
        />
        <Button
          text={'Reset zoom'}
          onPress={() => {
            const settings = {...fractalSettings};
            settings.range = settings.juliaSetValue
              ? INIT_JULIA_SET_RANGE
              : INIT_RANGE;
            setFractalSettings(settings);
          }}
          color={Colors.red}
          disabled={loading}
        />
        <Button
          color={Colors.maroon}
          disabled={loading}
          onPress={() => {
            const {juliaSetValue} = fractalSettings;
            if (juliaSetValue) {
              setFractalSettings({
                range: INIT_RANGE,
                juliaSetValue: null,
                sensitivity,
                colors: convertColors(colors, colourMapRepetition),
              });
            } else {
              setFractalSettings({
                range: INIT_JULIA_SET_RANGE,
                juliaSetValue: complex,
                sensitivity,
                colors: convertColors(colors, colourMapRepetition),
              });
            }
            setComplex({real: 0, imaginary: 0});
          }}
          text={
            fractalSettings.juliaSetValue
              ? 'Back to mandelbrot set'
              : 'Show Julia set for these values'
          }
        />
        <Button
          text={'What is a fractal?'}
          disabled={loading}
          transparent
          onPress={() => {
            navigation.navigate('Explainer');
          }}
        />
      </View>
      <View
        style={[styles.section, styles.board, {marginTop: 8, paddingTop: 10}]}>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.large, {marginTop: 0}]}>
            {'Settings'}
          </Text>
        </View>
        <Text style={[styles.text, styles.info, {marginBottom: 10}]}>
          {
            'Change these settings as you wish. Each setting will have an optimum level depending on the fractal being generated. If you find the image is too noisy, sometimes lowering the maximum iterations or changing the colour settings will help'
          }
        </Text>
        <View style={{marginVertical: 10}}>
          <Button
            text={'Re-render with these settings'}
            disabled={loading}
            onPress={() => {
              const {range, juliaSetValue} = fractalSettings;

              setFractalSettings({
                range,
                juliaSetValue,
                sensitivity,
                colors: convertColors(colors, colourMapRepetition),
              });
            }}
            color={'rgba(0,0,0,0.3)'}
          />
        </View>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.light]}>
            {'Maximum iterations per pixel:'}
          </Text>
          <Text style={styles.text}>{sensitivity}</Text>
        </View>
        <Text style={[styles.text, styles.info]}>
          {
            'Decrease for quicker render times, increase for more accurate fractal rendering.'
          }
        </Text>
        <Slider
          onChange={setSensitivity}
          maxValue={MAX_SENSITIVITY}
          minValue={MIN_SENSITIVITY}
          value={sensitivity}
        />
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.light]}>
            {'Colour map repetition:'}
          </Text>
          <Text style={styles.text}>{colourMapRepetition}</Text>
        </View>
        <Text style={[styles.text, styles.info]}>
          {'Increase if the gradient is too subtle.'}
        </Text>
        <Slider
          onChange={setColourMapRepetition}
          maxValue={5}
          minValue={1}
          value={colourMapRepetition}
        />
        <View style={styles.textRow}>
          <View style={[styles.subHeader, {marginBottom: 5}]}>
            <Text style={styles.text}>{'Colour map:'}</Text>
          </View>
        </View>
        <Text style={[styles.text, styles.info]}>
          {'The colours used in the image. Hold one to remove it.'}
        </Text>
        <RGBSelector colors={colors} setColors={setColors} />
        <TouchableOpacity
          onPress={() => {
            setColors(INIT_COLORS);
            setColourMapRepetition(1);
            setSensitivity(SENSITIVITY_INIT_VALUE);
          }}>
          <Text style={[styles.text, styles.button]}>
            {'Restore default settings'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.trippy, {color: Colors.blue}]}>{'N'}</Text>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.title}>
        {'FRACTAL GENERATOR'}
      </Text>
      <Text style={[styles.text, styles.footer]}>
        {'Patrick Sawyer - 2022'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  footer: {
    opacity: 0.5,
    width: '100%',
    textAlign: 'center',
    color: 'black',
    paddingBottom: 20,
    fontSize: 10,
  },
  opacity: {
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 10,
  },
  subHeader: {
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
    opacity: 0.5,
  },
  text: {
    color: Colors.white,
    fontWeight: '400',
    fontSize: 15,
    fontVariant: ['tabular-nums'],
    opacity: 0.9,
  },
  light: {
    marginBottom: 5,
    opacity: 0.5,
  },
  textRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  section: {
    padding: 8,
  },
  fractal: {
    backgroundColor: 'black',
    height: Dimensions.get('window').width,
    borderRadius: 5,
    overflow: 'hidden',
    margin: 8,
    elevation: 4,
  },
  ranges: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scroll: {
    paddingTop: 10,
  },
  large: {
    fontSize: 19,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  title: {
    color: '#ff008c',
    width: '100%',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'fontEight',
    fontSize: 30,
    marginBottom: 20,
  },
  trippy: {
    fontSize: 100,
    fontFamily: 'fontSeven',
    textAlign: 'center',
    width: '100%',
    padding: 8,
    marginVertical: 40,
  },
  board: {
    paddingTop: 0,
    backgroundColor: Colors.board,
    marginHorizontal: 8,
    borderRadius: 5,
    elevation: 4,
  },
  info: {opacity: 0.25, marginLeft: 0, fontSize: 12},
  button: {
    color: 'white',
    padding: 10,
    paddingBottom: 15,
    textAlign: 'center',
  },
});
