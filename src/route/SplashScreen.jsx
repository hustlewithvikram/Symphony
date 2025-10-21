import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  SlideInDown,
  SlideOutDown,
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {View, Image, StyleSheet, Dimensions, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useEffect} from 'react';
import {GetLanguageValue} from '../localstorage/Languages';
import {MainWrapper} from '../layout/MainWrapper';
import {useAppTheme} from '../theme';

const {width, height} = Dimensions.get('window');

export const SplashScreen = ({navigation}) => {
  const theme = useAppTheme();
  const dotPosition = useSharedValue(0);

  // Animated dot movement
  useEffect(() => {
    dotPosition.value = withRepeat(
      withSequence(
        withTiming(0, {duration: 600}),
        withTiming(70, {duration: 600}), // 80px container width - 30% dot width = 56px movement
      ),
      -1, // infinite repeats
      true, // reverse
    );
  }, [dotPosition]);

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [{translateX: dotPosition.value}],
  }));

  // Initial navigation logic
  const navigateNext = async () => {
    try {
      const lang = await GetLanguageValue();
      navigation.replace(lang ? 'MainRoute' : 'Onboarding');
    } catch (error) {
      console.error('Navigation error:', error);
      navigation.replace('Onboarding'); // Fallback
    }
  };

  // Run once on mount
  useEffect(() => {
    const timer = setTimeout(navigateNext, 2500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainWrapper>
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {/* Logo/Brand Image with enhanced animation */}
        <Animated.View
          entering={ZoomIn.duration(800)
            .springify()
            .damping(12)
            .mass(0.8)
            .stiffness(120)}
          exiting={FadeOut.duration(400)}
          style={styles.logoContainer}>
          <Image
            source={require('../assets/images/symphony.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          {/* Glow effect */}
          <View
            style={[
              styles.glowEffect,
              {backgroundColor: theme.colors.primary + '20'},
            ]}
          />
        </Animated.View>

        {/* Content with staggered animations */}
        <View style={styles.content}>
          <Animated.Text
            entering={FadeIn.duration(600).delay(300)}
            exiting={FadeOut.duration(300)}
            style={[styles.title, {color: theme.colors.text}]}>
            Symphony
          </Animated.Text>

          <Animated.Text
            entering={FadeIn.duration(600).delay(500)}
            exiting={FadeOut.duration(300)}
            style={[styles.subtitle, {color: theme.colors.primary}]}>
            Music for free
          </Animated.Text>

          {/* Enhanced loading indicator */}
          <Animated.View
            entering={FadeIn.duration(500).delay(700)}
            exiting={FadeOut.duration(250)}
            style={styles.loadingContainer}>
            <View style={styles.loadingContent}>
              <View
                style={[
                  styles.loadingDotsContainer,
                  {backgroundColor: theme.colors.surfaceVariant},
                ]}>
                <Animated.View
                  style={[
                    styles.loadingDot,
                    {backgroundColor: theme.colors.primary},
                    animatedDotStyle,
                  ]}
                />
              </View>
              <Text style={[styles.loadingText, {color: theme.colors.text}]}>
                Loading your experience...
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Footer with slide animation */}
        <Animated.View
          entering={SlideInDown.duration(600).delay(900)}
          exiting={SlideOutDown.duration(400)}
          style={styles.footer}>
          <Text style={[styles.footerText, {color: theme.colors.text}]}>
            Your musical journey begins here
          </Text>
          <View
            style={[styles.footerLine, {backgroundColor: theme.colors.primary}]}
          />
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
    paddingVertical: height * 0.08,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.12,
    position: 'relative',
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
    zIndex: 2,
  },
  glowEffect: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    opacity: 0.4,
    blurRadius: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 12,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 6,
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.8,
    opacity: 0.95,
    includeFontPadding: false,
  },
  loadingContainer: {
    marginTop: 48,
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 16,
  },
  loadingDotsContainer: {
    width: 80,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    opacity: 0.8,
  },
  loadingDot: {
    height: '100%',
    width: '30%',
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: '500',
    letterSpacing: 0.4,
    includeFontPadding: false,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    fontSize: 15,
    opacity: 0.8,
    fontWeight: '500',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  footerLine: {
    width: 40,
    height: 3,
    borderRadius: 2,
    opacity: 0.7,
  },
});
