import {MainWrapper} from '../../layout/MainWrapper';
import FastImage from 'react-native-fast-image';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import {useState} from 'react';
import {DefaultTheme} from '@react-navigation/native';
import {Text, Button, useTheme} from 'react-native-paper';
import {useAppTheme} from '../../theme';

const {height, width} = Dimensions.get('window');

export const OnboardingSlideOne = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const theme = useAppTheme();

  const handleNextPress = () => {
    navigation.push('OnboardingSlideTwo');
  };

  return (
    <MainWrapper>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.container}>
        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}
          <FastImage
            source={{
              uri: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80',
            }}
            style={styles.heroImage}
            resizeMode={FastImage.resizeMode.cover}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          {/* Gradient Overlay */}
          <View
            style={[
              styles.gradientOverlay,
              {
                backgroundColor: theme.colors.surface,
              },
            ]}
          />
        </View>

        {/* Bottom Content Section */}
        <View
          style={[
            styles.contentSection,
            {
              backgroundColor: theme.colors.surface,
            },
          ]}>
          <View style={styles.contentContainer}>
            {/* Decorative Element */}
            <View
              style={[
                styles.decorativeLine,
                {
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />

            {/* Text Content */}
            <View style={styles.textContent}>
              <Text
                variant="labelLarge"
                style={[
                  styles.pretitle,
                  {
                    color: theme.colors.primary,
                    backgroundColor: theme.colors.primaryContainer + '20',
                  },
                ]}>
                GET STARTED
              </Text>
              <Text
                variant="displaySmall"
                style={[
                  styles.title,
                  {
                    color: theme.colors.onSurface,
                  },
                ]}>
                Welcome to{'\n'}Symphony
              </Text>
              <Text
                variant="bodyLarge"
                style={[
                  styles.subtitle,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}>
                Experience music in a whole new way with personalized streaming
                and curated playlists
              </Text>
            </View>

            {/* Action Button */}
            <View style={styles.actionContainer}>
              <Button
                mode="elevated"
                onPress={handleNextPress}
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                contentStyle={styles.buttonContent}
                labelStyle={(styles.buttonLabel, {color: theme.colors.text})}
                icon="arrow-right">
                Continue
              </Button>

              {/* Progress Indicator */}
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: theme.colors.outline,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: theme.colors.outline,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  heroContainer: {
    height: height * 0.55,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  contentSection: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    paddingTop: 32,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  decorativeLine: {
    width: 32,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 32,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 48,
    gap: 16,
  },
  pretitle: {
    fontWeight: '700',
    letterSpacing: 1.2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
    opacity: 0.9,
    paddingHorizontal: 8,
  },
  actionContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: 32,
  },
  button: {
    borderRadius: 20,
    minWidth: width * 0.6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
