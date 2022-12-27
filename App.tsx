import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Colors} from './src/theme/theme';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from './src/screens/HomeScreen';
import {ExplainerScreen} from './src/screens/ExplainerScreen';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.nav} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Explainer" component={ExplainerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.nav,
    height: '100%',
  },
});

export default App;
