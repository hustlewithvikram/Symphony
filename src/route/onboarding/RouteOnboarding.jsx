import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OnboardingSlideOne} from './OnboardingSlideOne';
import {OnboardingSlideTwo} from './OnboardingSlideTwo';
import {OnboardingSlideThree} from './OnboardingSlideThree';

const Stack = createNativeStackNavigator();
export const RouteOnboarding = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animation: 'fade_from_bottom'}}>
      <Stack.Screen name="OnboardingSlideOne" component={OnboardingSlideOne} />
      <Stack.Screen name="OnboardingSlideTwo" component={OnboardingSlideTwo} />
      <Stack.Screen
        name="OnboardingSlideThree"
        component={OnboardingSlideThree}
      />
      {/*<Stack.Screen  name="Slide4" component={Slide4} />*/}
    </Stack.Navigator>
  );
};
