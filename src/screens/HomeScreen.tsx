import React, {useEffect, useState} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Button} from '../components/Button';
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

export function HomeScreen({navigation}: Props) {
  const [range, setRange] = useState<Range>(INIT_RANGE);
  const size = useWindowDimensions().width;
  const [complex, setComplex] = useState<Complex>({real: 0, imaginary: 0});
  const [juliaSetValue, setJuliaSetValue] = useState<Complex | null>(null);
  const [loading, setLoading] = useState(true);

  const onPressFractal = (e: GestureResponderEvent) => {
    const {locationX, locationY} = e.nativeEvent;
    const newCoord = getCoord(size, range, {
      x: locationX,
      y: locationY,
    });
    setComplex(newCoord);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  const zoom = () => {
    const {upper, lower} = range.x;
    const currentZoom = upper - lower;
    const newZoom = currentZoom / 20;

    setRange({
      x: {
        upper: complex.real + newZoom,
        lower: complex.real - newZoom,
      },
      y: {
        upper: complex.imaginary + newZoom,
        lower: complex.imaginary - newZoom,
      },
    });
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
        style={{
          height: size,
          width: size,
          backgroundColor: Colors.blackish,
        }}>
        {!loading && (
          <Fractal size={size} range={range} juliaSetValue={juliaSetValue} />
        )}
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
            if (juliaSetValue) {
              setJuliaSetValue(null);
              setRange(INIT_RANGE);
            } else {
              setJuliaSetValue(complex);
              setRange(INIT_JULIA_SET_RANGE);
            }
          }}
          text={
            juliaSetValue
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
});
