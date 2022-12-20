import React, {useState} from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Button} from '../components/Button';
import {CoordIndicator} from '../components/CoordIndicator';
import {Fractal} from '../components/Fractal';
import {Colors} from '../theme/theme';
import {Complex, getCoord, Range} from '../utils/fractalUtils';

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
}

const calcToFixedValue = ({range}: FractalSettings): number => {
  const {upper, lower} = range.x;
  const diff = upper - lower;
  let blah = diff * 10000;
  let result = 4;

  while (blah < 1 && result < 10) {
    blah = blah * 10;
    result++;
  }

  return result;
};

export function HomeScreen({navigation}: Props) {
  const size = useWindowDimensions().width;
  const [complex, setComplex] = useState<Complex>({real: 0, imaginary: 0});
  const [fractalSettings, setFractalSettings] = useState<FractalSettings>({
    range: INIT_RANGE,
    juliaSetValue: null,
  });
  const [loading, setLoading] = useState(true);
  const toFixedValue = calcToFixedValue(fractalSettings);

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

    setFractalSettings(settings);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.section}>
        <View style={styles.textRow}>
          <Text style={styles.text}>{'Real:'}</Text>
          <Text style={styles.text}>{complex.real.toFixed(6)}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.text}>{'Imaginary:'}</Text>
          <Text style={styles.text}>{complex.imaginary.toFixed(6)}</Text>
        </View>
      </View>
      <View
        onTouchStart={onPressFractal}
        onTouchEnd={onPressFractal}
        onTouchMove={onPressFractal}
        style={[styles.fractal, {height: size, width: size}]}>
        <Fractal setLoading={setLoading} size={size} {...fractalSettings} />
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
        <Button
          text={'Zoom into this coord'}
          onPress={zoom}
          color={Colors.orange}
        />
        <Button
          color={Colors.maroon}
          onPress={() => {
            if (fractalSettings.juliaSetValue) {
              setFractalSettings({
                range: INIT_RANGE,
                juliaSetValue: null,
              });
            } else {
              setFractalSettings({
                range: INIT_JULIA_SET_RANGE,
                juliaSetValue: complex,
              });
            }
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
          color={Colors.purple}
          text={'What is a fractal?'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 10,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  text: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontVariant: ['tabular-nums'],
  },
  textRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  section: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  fractal: {
    backgroundColor: Colors.blackish,
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
  },
});
