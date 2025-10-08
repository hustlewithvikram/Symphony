import Animated, {FadeIn, FadeOut, ZoomIn} from 'react-native-reanimated';
import {View, Image, StyleSheet, Dimensions, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useEffect} from 'react';
import {GetLanguageValue} from '../localstorage/Languages';
import {MainWrapper} from '../layout/MainWrapper';

const {width, height} = Dimensions.get('window');

export const SplashScreen = ({navigation}) => {
  const theme = useTheme();

  // Initial navigation logic
  const navigateNext = async () => {
    const lang = await GetLanguageValue();
    navigation.replace(lang ? 'MainRoute' : 'Onboarding');
  };

  // Run once on mount
  useEffect(() => {
    const timer = setTimeout(navigateNext, 1500); // Increased delay to show the full animation
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainWrapper>
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {/* Logo/Brand Image */}
        <Animated.View
          entering={ZoomIn.duration(600).springify()}
          exiting={FadeOut.duration(300)}
          style={styles.logoContainer}>
          <Image
            source={require('../assets/images/symphony.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          <Animated.Text
            entering={FadeIn.duration(500).delay(200)}
            exiting={FadeOut.duration(250)}
            style={[styles.title, {color: theme.colors.text}]}>
            Symphony
          </Animated.Text>

          <Animated.Text
            entering={FadeIn.duration(500).delay(400)}
            exiting={FadeOut.duration(250)}
            style={[styles.subtitle, {color: theme.colors.primary}]}>
            Music for free
          </Animated.Text>

          {/* Loading indicator */}
          <Animated.View
            entering={FadeIn.duration(400).delay(600)}
            exiting={FadeOut.duration(200)}
            style={styles.loadingContainer}>
            <View
              style={[
                styles.loadingDotsContainer,
                {backgroundColor: theme.colors.border},
              ]}>
              <Animated.View
                style={[
                  styles.loadingDot,
                  {backgroundColor: theme.colors.primary},
                ]}
              />
            </View>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View
          entering={FadeIn.duration(400).delay(800)}
          exiting={FadeOut.duration(200)}
          style={styles.footer}>
          <Text style={[styles.footerText, {color: theme.colors.text}]}>
            Your musical journey begins here
          </Text>
        </Animated.View>
      </View>
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.1,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingDotsContainer: {
    width: 80,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingDot: {
    height: '100%',
    width: '30%',
    borderRadius: 2,
  },
  footer: {
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});
