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

const INIT_MAX_OUT_VALUE = 5;
const MIN_MAX_OUT_VALUE = 3;
const MAX_MAX_OUT_VALUE = 50;

export const INIT_COLORS: Color[] = [
  {red: 83, green: 52, blue: 255},
  {red: 255, green: 255, blue: 255},
  {red: 255, green: 195, blue: 15},
  {red: 255, green: 88, blue: 51},
  {red: 199, green: 0, blue: 57},
  {red: 144, green: 12, blue: 63},
  {red: 88, green: 24, blue: 69},
];

const convertColors = (colors: Color[]): string[] => {
  return colors.map(({red, green, blue}) => `${red},${green},${blue}`);
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
  maxOutValue: number;
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

export function HomeScreen({navigation}: Props) {
  const size = useWindowDimensions().width - 16;
  const [renderFractal, setRenderFractal] = useState(false);
  const [complex, setComplex] = useState<Complex>({real: 0, imaginary: 0});
  const [colors, setColors] = useState<Color[]>(INIT_COLORS);
  const [touch, setTouch] = useState<Touch | null>(null);
  const textColorAnimation = useRef(new Animated.Value(0)).current;
  const [fractalSettings, setFractalSettings] = useState<FractalSettings>({
    range: INIT_RANGE,
    juliaSetValue: null,
    sensitivity: SENSITIVITY_INIT_VALUE,
    colors: convertColors(INIT_COLORS),
    maxOutValue: INIT_MAX_OUT_VALUE,
  });
  const [loading, setLoading] = useState(true);
  const toFixedValue = calcToFixedValue(fractalSettings);
  const [sensitivity, setSensitivity] = useState(SENSITIVITY_INIT_VALUE);
  const [maxOutValue, setMaxOutValue] = useState(INIT_MAX_OUT_VALUE);

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
    settings.maxOutValue = maxOutValue;
    settings.colors = convertColors(colors);

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
                maxOutValue,
                colors: convertColors(colors),
              });
            } else {
              setFractalSettings({
                range: INIT_JULIA_SET_RANGE,
                juliaSetValue: complex,
                sensitivity,
                maxOutValue,
                colors: convertColors(colors),
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
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.large, {marginTop: 0}]}>
            {'Settings'}
          </Text>
        </View>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.light]}>
            {'Maximum iterations per pixel:'}
          </Text>
          <Text style={styles.text}>{sensitivity}</Text>
        </View>
        <Slider
          onChange={setSensitivity}
          maxValue={MAX_SENSITIVITY}
          minValue={MIN_SENSITIVITY}
          value={sensitivity}
        />
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.light]}>{'Max-out value:'}</Text>
          <Text style={styles.text}>{maxOutValue}</Text>
        </View>
        <Slider
          onChange={setMaxOutValue}
          maxValue={MAX_MAX_OUT_VALUE}
          minValue={MIN_MAX_OUT_VALUE}
          value={maxOutValue}
        />
        <View style={styles.textRow}>
          <View style={styles.subHeader}>
            <Text style={styles.text}>{'Colour map:'}</Text>
            <Text style={[styles.text, styles.opacity]}>
              {'Hold to remove'}
            </Text>
          </View>
        </View>
        <RGBSelector colors={colors} setColors={setColors} />
        <View style={{height: 10}} />
        <Button
          text={'Re-render with these settings'}
          disabled={loading}
          onPress={() => {
            const {range, juliaSetValue} = fractalSettings;

            setFractalSettings({
              range,
              juliaSetValue,
              sensitivity,
              maxOutValue,
              colors: convertColors(colors),
            });
          }}
          color={'rgba(0,0,0,0.3)'}
        />
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
});
