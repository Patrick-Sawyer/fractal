import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  NativeModules,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from '../components/Button';
import {CoordIndicator} from '../components/CoordIndicator';
// import {Fractal} from '../components/Fractal';
import {Slider} from '../components/Slider';
import {Colors} from '../theme/theme';
import {Complex, getCoord, Range} from '../utils/fractalUtils';

const {FractalModule} = NativeModules;

const range = {
  x: {
    upper: 0.2342345,
    lower: 1.234346456745,
  },
  y: {
    upper: 0.246735637,
    lower: 1.56756735683,
  },
};

const juliaSetValue = {
  real: -1.24534363456,
  imaginary: 0.135432643656,
};

const blahblah = async () => {
  const result = await FractalModule.getFractal(
    3333,
    JSON.stringify(range),
    JSON.stringify(juliaSetValue),
    100,
  );
  console.log(result);
};

blahblah();

const MIN_SENSITIVITY = 10;
const MAX_SENSITIVITY = 250;
const SENSITIVITY_INIT_VALUE = 75;

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
  const size = useWindowDimensions().width;
  const [, setRenderFractal] = useState(false);
  const [complex, setComplex] = useState<Complex>({real: 0, imaginary: 0});
  const [fractalSettings, setFractalSettings] = useState<FractalSettings>({
    range: INIT_RANGE,
    juliaSetValue: null,
    sensitivity: SENSITIVITY_INIT_VALUE,
  });
  const [loading, setLoading] = useState(true);
  const toFixedValue = calcToFixedValue(fractalSettings);
  const [sensitivity, setSensitivity] = useState(SENSITIVITY_INIT_VALUE);

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

    setFractalSettings(settings);
  };

  const handleSlider = (input: number) => {
    const adjusted = 1 - Math.pow(1 - input, 0.5);
    const value =
      adjusted * (MAX_SENSITIVITY - MIN_SENSITIVITY) + MIN_SENSITIVITY;
    setSensitivity(Math.round(value));
  };

  useEffect(() => {
    setTimeout(() => {
      setRenderFractal(true);
    }, 500);
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View
        onTouchStart={onPressFractal}
        style={[styles.fractal, {height: size, width: size}]}>
        {/* {renderFractal && (
          <Fractal setLoading={setLoading} size={size} {...fractalSettings} />
        )} */}
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
      <View style={styles.section}>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.large]}>{'Coordinate'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.light]}>{'Real:'}</Text>
          <Text style={styles.text}>{complex.real.toFixed(10)}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.light]}>{'Imaginary:'}</Text>
          <Text style={styles.text}>{complex.imaginary.toFixed(10)}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.large]}>{'Iterations'}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={[styles.text, styles.light]}>
            {'Maximum iterations:'}
          </Text>
          <Text style={styles.text}>{sensitivity}</Text>
        </View>
        <Slider onChange={handleSlider} initValue={SENSITIVITY_INIT_VALUE} />
      </View>
      <View style={styles.section}>
        <Button
          text={'Re render'}
          disabled={loading}
          onPress={() => {
            const {range, juliaSetValue} = fractalSettings;

            setFractalSettings({
              range,
              juliaSetValue,
              sensitivity,
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
              });
            } else {
              setFractalSettings({
                range: INIT_JULIA_SET_RANGE,
                juliaSetValue: complex,
                sensitivity,
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    padding: 10,
  },
  fractal: {
    backgroundColor: 'black',
    height: Dimensions.get('window').width,
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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scroll: {
    paddingTop: 10,
  },
  large: {
    fontSize: 19,
    fontWeight: '400',
    marginTop: 10,
  },
});
