import React, {useEffect} from 'react';
import {ToastAndroid, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CodePush from 'react-native-code-push';
import ContextState from './src/context/ContextState';
import {RouteOnboarding} from './src/route/onboarding/RouteOnboarding';
import {RootRoute} from './src/route/RootRoute';
import {SplashScreen} from './src/route/SplashScreen';
import {Provider} from 'react-native-paper';

const Stack = createStackNavigator();
const codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_START};

const App = () => {
  // const width = Dimensions.get('window').width;

  useEffect(() => {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('dark-content');

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
    <Provider>
      <GestureHandlerRootView style={{flex: 1, backgroundColor: 'transparent'}}>
        <ContextState>
          <BottomSheetModalProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="Onboarding" component={RouteOnboarding} />
                <Stack.Screen name="MainRoute" component={RootRoute} />
              </Stack.Navigator>
            </NavigationContainer>
          </BottomSheetModalProvider>
        </ContextState>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default CodePush(codePushOptions)(App);
