import React, {useEffect} from 'react';
import {Dimensions, ToastAndroid, StatusBar, View} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CodePush from 'react-native-code-push';
import ContextState from './src/context/ContextState';
import {InitialScreen} from './src/route/InitialScreen';
import {RouteOnboarding} from './src/route/onboardingscreen/RouteOnboarding';
import {RootRoute} from './src/route/RootRoute';


const Stack = createStackNavigator();
const codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_START};

const App = () => {
  const width = Dimensions.get('window').width;

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#fb8500',
      primaryLight: '#ffb347',
      primaryDark: '#c15800',

      secondary: '#219ebc',
      secondaryLight: '#8ecae6',
      secondaryDark: '#126782',

      tertiary: '#023047',
      tertiaryLight: '#3a506b',
      tertiaryDark: '#011a26',

      text: '#F4F5FC',
      textSecondary: '#CCCCCC',
      white: 'white',
      spacing: 10,
      headingSize: width * 0.085,
      fontSize: width * 0.045,
      disabled: 'rgb(131,131,131)',
      background: 'transparent',
    },
  };

  useEffect(() => {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('light-content');

    // @ts-ignore
    CodePush.notifyAppReady();
    CodePush.checkForUpdate().then(update => {
      if (update) {
        ToastAndroid.showWithGravity(
          'App update available and will be applied automatically',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        CodePush.sync({installMode: CodePush.InstallMode.IMMEDIATE});
      }
    });
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'transparent'}}>
      <ContextState>
        <BottomSheetModalProvider>
          <NavigationContainer theme={MyTheme}>
            <View style={{flex: 1, backgroundColor: 'transparent'}}>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Initial" component={InitialScreen} />
                <Stack.Screen name="Onboarding" component={RouteOnboarding} />
                <Stack.Screen name="MainRoute" component={RootRoute} />
              </Stack.Navigator>
            </View>
          </NavigationContainer>
        </BottomSheetModalProvider>
      </ContextState>
    </GestureHandlerRootView>
  );
};

export default CodePush(codePushOptions)(App);
