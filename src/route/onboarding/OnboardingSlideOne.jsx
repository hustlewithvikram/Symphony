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
import {Heading} from '../../components/global/Heading';
import {PlainText} from '../../components/global/PlainText';
import {BottomNextAndPrevious} from '../../components/routeonboarding/BottomNextAndPrevious';
import {useState} from 'react';
import {DefaultTheme} from '@react-navigation/native';

const {height} = Dimensions.get('window');

export const OnboardingSlideOne = ({navigation}) => {
  const [loading, setLoading] = useState(true);

  const handleNextPress = () => {
    navigation.push('OnboardingSlideTwo');
  };

  return (
    <MainWrapper>
      {/* Transparent StatusBar */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.container}>
        {/* Top Image */}
        <View style={styles.imageContainer}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          <FastImage
            source={{
              uri: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
            }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomContainer}>
          <View style={styles.textContainer}>
            <Heading
              text="Welcome to Symphony"
              noSpace
              style={styles.heading}
            />
            <PlainText
              text="Experience music like never before - completely free"
              style={styles.subtitle}
            />
          </View>

          {/* Navigation Button */}
          <BottomNextAndPrevious
            delay={0}
            onNextPress={handleNextPress}
            showPrevious={false}
            showNext={true}
          />
        </View>
      </View>
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: DefaultTheme.colors.background,
    height: '100%',
  },
  imageContainer: {
    height: height * 0.65,
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: '#ccc',
    marginHorizontal: 20,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  image: {
    height: '100%',
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    color: DefaultTheme.colors.text,
  },
  heading: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    color: DefaultTheme.colors.text,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.85,
    lineHeight: 22,
    color: DefaultTheme.colors.text,
  },
});
