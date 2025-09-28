import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useEffect} from 'react';
import {GetLanguageValue} from '../localstorage/Languages';
import {MainWrapper} from '../layout/MainWrapper';

export const InitialScreen = ({navigation}) => {
  const theme = useTheme();

  // Initial navigation logic
  const navigateNext = async () => {
    const lang = await GetLanguageValue();
    navigation.replace(lang ? 'MainRoute' : 'Onboarding');
  };

  // Run once on mount
  useEffect(() => {
    const timer = setTimeout(navigateNext, 800); // slightly longer delay for smoother splash
    return () => clearTimeout(timer); // cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainWrapper>
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Animated.Text
          entering={FadeIn.duration(400).delay(150)}
          exiting={FadeOut.duration(200)}
          style={[styles.title, {color: theme.colors.text}]}>
          Melody
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.duration(400).delay(400)}
          exiting={FadeOut.duration(200)}
          style={[styles.subtitle, {color: theme.colors.primary}]}>
          Music for free
        </Animated.Text>
      </View>
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
});
