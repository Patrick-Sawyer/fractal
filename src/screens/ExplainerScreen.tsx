import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../theme/theme';
import {ScreenWrapper} from './components/ScreenWrapper';

interface Props {
  navigation: any;
}

export function ExplainerScreen({navigation}: Props) {
  return (
    <ScreenWrapper navigation={navigation}>
      <View style={styles.wrapper}>
        <Text style={[styles.text, styles.large]}>{'Introduction'}</Text>
        <Text style={styles.text}>
          {
            'This is a short explainer about fractals. Fractals are quite mathsy, but it is not as crazy as some might believe. A fairly basic understanding of algebra and graphs is enough. The main complication is due to extreme repetition. Simple calculations are repeated millions of times to generate these images.'
          }
        </Text>
        <Text style={[styles.text, styles.large]}>{'Imaginary numbers'}</Text>
        <Text style={styles.text}>
          {
            'The first thing to get your head around is imaginary numbers. This all begins with a simple concept, which is the square root of minus one. This number cannot exist, and therefore is imaginary. This number is known as "i" and all imaginary numbers are a real number multiplied by i, for example, "5i" is 5 times the square root of minus one.'
          }
        </Text>
        <Text style={[styles.text, styles.example]}>{'a = 5i'}</Text>
        <Text style={[styles.text, styles.large]}>{'Complex Numbers'}</Text>
        <Text style={styles.text}>
          {
            'Complex numbers are numbers containing both real and imaginary numbers. They are written as below.'
          }
        </Text>
        <Text style={[styles.text, styles.example]}>{'a = 7 + 4i'}</Text>
        <Text style={[styles.text, styles.large]}>{'Complex Maths'}</Text>
        <Text style={styles.text}>
          {
            'For fractals, we are only interested in addition and multiplication. '
          }
        </Text>
        <Text style={styles.text}>
          {
            'To add 2 complex numbers, you simply add the real parts and imaginary parts of each complex number.'
          }
        </Text>
        <Text style={[styles.text, styles.example]}>{'a = 1 + 2i'}</Text>
        <Text style={[styles.text, styles.example]}>{'b = 2 - 3i'}</Text>
        <Text style={[styles.text, styles.example]}>
          {'a + b = 1 + 2 + 2i - 3i'}
        </Text>
        <Text style={[styles.text, styles.example]}>{'a + b = 3 - i'}</Text>
        <Text style={styles.text}>
          {
            'Multiplication is the same as multiplying numbers in algebra, but you need to bear in mind that i squared is minus one.'
          }
        </Text>
        <Text style={[styles.text, styles.example]}>{'a = 2 + i'}</Text>
        <Text style={[styles.text, styles.example]}>{'b = 3 + 2i'}</Text>
        <Text style={[styles.text, styles.example]}>
          {'a x b = (2 x 3) + (2 x 2i) + (3 x i) + (i x 2i)'}
        </Text>
        <Text style={[styles.text, styles.example]}>
          {'a x b = 6 + 4i + 3i + -2'}
        </Text>
        <Text style={[styles.text, styles.example]}>{'a x b = 4 + 7i'}</Text>
        <Text style={[styles.text, styles.large]}>{'The Complex Plane'}</Text>
        <Text style={styles.text}>
          {
            'The complex plane is just a normal graph, but where each point is a complex number. The x axis represents the real part, and the y axis represents the imaginary part. For example, if the x coordinate is 3 and the y coordinate is -2 then the number it represents is as below.'
          }
        </Text>
        <Text style={[styles.text, styles.example]}>{'3 - 2i'}</Text>
        <Text style={[styles.text, styles.large]}>{'Fractals'}</Text>
        <Text style={styles.text}>
          {
            "Fractals are generated by applying simple functions to the value of each coordinate repeatedly, and applying a colour to that coordinate's position on the complex plane. For each coordinate, the function is repeated over and over, until it is clear if the value is approaching infinity in either the real value or the imaginary value. The simplest fractals will show black for coordinates that do not ever approach infinity, and white for coordinates that do."
          }
        </Text>
        <Text style={[styles.text, styles.large]}>{'Mandelbrot Set'}</Text>
        <Text style={styles.text}>
          {'The function that is used in the mandelbrot set is as follows.'}
        </Text>
        <View style={styles.equation}>
          <Text style={[styles.text, styles.example, styles.noPadding]}>
            {'z'}
          </Text>
          <Text
            style={[
              styles.text,
              styles.example,
              styles.noPadding,
              styles.small,
              styles.bottomText,
            ]}>
            {'n+1'}
          </Text>
          <Text style={[styles.text, styles.example, styles.noPadding]}>
            {' = z'}
          </Text>
          <Text
            style={[
              styles.text,
              styles.example,
              styles.noPadding,
              styles.small,
              styles.bottomText,
            ]}>
            {'n'}
          </Text>
          <Text
            style={[
              styles.text,
              styles.example,
              styles.noPadding,
              styles.small,
            ]}>
            {'2'}
          </Text>
          <Text style={[styles.text, styles.example, styles.noPadding]}>
            {' + c'}
          </Text>
        </View>
        <Text style={styles.text}>
          {
            'All that means is for each coordinate, you get the complex number of that coordinate, square it and add the original complex number (which is called "c") and repeat. If it approaches infinity, you mark that point as white, if it does not you mark it black. Do this for every point on the complex plane and you get the Mandelbrot set.'
          }
        </Text>
        <Text style={[styles.text, styles.large]}>{'Julia Sets'}</Text>
        <Text style={styles.text}>
          {
            'Julia sets are the same, although this time the value of "c" is different. There are many many Julia sets, all with a different complex number for the value of "c".'
          }
        </Text>
        <Text style={[styles.text, styles.large]}>{'Gradients'}</Text>
        <Text style={styles.text}>
          {
            "The only other factor here involves the speed at which these iterations reach infinity. Coordinates that don't ever reach infinity are marked as black. The ones that reach infinity quicker you apply a different colour to. In this app, coordinates that reach infinity quickest are marked as yellow. The darker the colour, the slower it gets to infinity."
          }
        </Text>
        <Text style={[styles.text, styles.large]}>{'Other Info'}</Text>
        <Text style={styles.text}>
          {
            'Julia sets where the real and imaginary numbers that comprise c approach zero start looking like a circle. The Julia set where c is 0 + 0i is a perfect circle.'
          }
        </Text>
        <Text style={styles.text}>
          {
            'If you take a coordinate on the Mandelbrot set, you can think of it having a corresponding Julia set, where c is the value of that coordinate. In fact the value of that coordinate is the same as the coordinate 0, 0 on the corresponding Julia set.'
          }
        </Text>
        <Text style={styles.text}>
          {
            'If a fractal is 1000 pixels wide, and 1000 pixels high, then there are a million pixels. If you then run the iteration 250 times, that is up to 250 million iterations run to generate the image.'
          }
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  bottomText: {
    position: 'relative',
    top: 6,
  },
  noPadding: {
    paddingHorizontal: 0,
  },
  equation: {
    flexDirection: 'row',
    width: '100%',
    height: 20,
    justifyContent: 'center',
    paddingLeft: 10,
    marginBottom: 10,
  },
  small: {
    fontSize: 12,
  },
  text: {
    color: Colors.white,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontVariant: ['tabular-nums'],
    opacity: 0.9,
    letterSpacing: 0.2,
  },
  large: {
    marginTop: 10,
    color: Colors.orange,
    fontWeight: 'bold',
    letterSpacing: 0.6,
    fontSize: 17,
  },
  example: {
    fontStyle: 'italic',
    color: Colors.lightGrey,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
});
