import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from '../components/Button';
import {CoordIndicator} from '../components/CoordIndicator';
import {Fractal} from '../components/Fractal';
import {Color, RGBSelector} from '../components/RGBSelector';
import {Slider} from '../components/Slider';
import {Colors} from '../theme/theme';
import {Complex, getCoord, Range} from '../utils/fractalUtils';

const MIN_SENSITIVITY = 10;
const MAX_SENSITIVITY = 500;
const SENSITIVITY_INIT_VALUE = 500;

const INIT_MAX_OUT_VALUE = 5;
const MIN_MAX_OUT_VALUE = 3;
const MAX_MAX_OUT_VALUE = 15;

const INIT_COLORS: Color[] = [
  {red: 104, green: 48, blue: 255},
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

export function HomeScreen({navigation}: Props) {
  const size = useWindowDimensions().width - 16;
  const [renderFractal, setRenderFractal] = useState(false);
  const [complex, setComplex] = useState<Complex>({real: 0, imaginary: 0});
  const [colors, setColors] = useState<Color[]>(INIT_COLORS);
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

  const onPressFractal = (e: GestureResponderEvent) => {
    const {locationX, locationY} = e.nativeEvent;
    const newCoord = getCoord(size, fractalSettings.range, {
      x: locationX,
      y: locationY,
    });
    setComplex(newCoord);
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
    setTimeout(() => {
      setRenderFractal(true);
    }, 500);
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={[styles.title, styles.titleTop]}>
        {'FRACTAL GENERATOR'}
      </Text>
      <View
        onTouchStart={onPressFractal}
        style={[styles.fractal, {height: size, width: size}]}>
        {renderFractal && (
          <Fractal setLoading={setLoading} size={size} {...fractalSettings} />
        )}
        <View style={styles.ranges} pointerEvents="none">
          <CoordIndicator
            value={fractalSettings.range.y.upper.toFixed(toFixedValue) + 'i'}
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
            value={fractalSettings.range.y.lower.toFixed(toFixedValue) + 'i'}
            rotate="180deg"
            flip
          />
          {loading && (
            <View style={styles.loading}>
              <ActivityIndicator
                animating
                color={Colors.white}
                size={'large'}
              />
            </View>
          )}
        </View>
      </View>
      <View style={[styles.section, {paddingTop: 0}]}>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.large]}>{'Coordinate'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.light]}>{'Real:'}</Text>
          <Text style={styles.text}>{complex.real.toFixed(10)}</Text>
        </View>
        <View style={[styles.textRow, {marginBottom: 15}]}>
          <Text style={[styles.text, styles.light]}>{'Imaginary:'}</Text>
          <Text style={styles.text}>{complex.imaginary.toFixed(10)}</Text>
        </View>
        <Button
          text={'Re-render'}
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
          color={Colors.orange}
        />
        <Button
          text={'Zoom into this coord'}
          onPress={zoom}
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
          onPress={() => {
            navigation.navigate('Explainer');
          }}
          disabled={loading}
          color={Colors.purple}
          text={'What is a fractal?'}
        />
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.large]}>{'Settings'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.light]}>
            {'Maximum iterations per pixel:'}
          </Text>
          <Text style={styles.text}>{sensitivity}</Text>
        </View>
        <Slider
          onChange={setSensitivity}
          initValue={SENSITIVITY_INIT_VALUE}
          maxValue={MAX_SENSITIVITY}
          minValue={MIN_SENSITIVITY}
        />
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.light]}>{'Max-out value:'}</Text>
          <Text style={styles.text}>{maxOutValue}</Text>
        </View>
        <Slider
          onChange={setMaxOutValue}
          initValue={INIT_MAX_OUT_VALUE}
          maxValue={MAX_MAX_OUT_VALUE}
          minValue={MIN_MAX_OUT_VALUE}
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
      </View>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.title}>
        {'FRACTAL GENERATOR'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleTop: {marginBottom: 0, marginTop: 10, paddingBottom: 10},
  opacity: {
    opacity: 0.2,
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
    paddingBottom: 10,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
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
    marginTop: 10,
  },
  title: {
    color: Colors.grey,
    width: '100%',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    fontFamily: 'fontEight',
    fontSize: 30,
    marginBottom: 20,
  },
});
