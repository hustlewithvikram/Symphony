import {MainWrapper} from '../../layout/MainWrapper';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import {Heading} from '../../components/global/Heading';
import {PlainText} from '../../components/global/PlainText';
import {BottomNextAndPrevious} from '../../components/routeonboarding/BottomNextAndPrevious';
import {EachCheckBox} from '../../components/routeonboarding/EachCheckBox';
import {useState} from 'react';
import {SetLanguageValue} from '../../localstorage/Languages';
import {DefaultTheme} from '@react-navigation/native';
import {
  Portal,
  Dialog,
  Button,
  Provider as PaperProvider,
} from 'react-native-paper';

const {height} = Dimensions.get('window');

export const OnboardingSlideTwo = ({navigation}) => {
  const [Languages, setLanguages] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);

  const onNextPress = async language => {
    if (language.length < 2) {
      setDialogVisible(true); // show dialog instead of alert
    } else {
      const Lang = language.join(',');
      await SetLanguageValue(Lang);
      navigation.replace('OnboardingSlideThree');
    }
  };

  const languageOptions = [
    ['English', 'Hindi'],
    ['Punjabi', 'Tamil'],
    ['Telugu', 'Marathi'],
    ['Bhojpuri', 'Bengali'],
    ['Kannada', 'Gujarati'],
    ['Malayalam', 'Urdu'],
    ['Rajasthani', 'Odia'],
    ['Assamese', 'Konkani'],
  ];

  return (
    <PaperProvider>
      <MainWrapper>
        <View style={styles.container}>
          {/* Top Section */}
          <View style={styles.topSection}>
            <Image
              source={require('../../images/selectLanguage.gif')}
              style={styles.image}
            />
            <Heading
              text="What's Your Music Taste?"
              nospace
              style={styles.heading}
            />
            <PlainText
              text="Select at least 2 languages"
              style={styles.subtitle}
            />
          </View>

          {/* Scrollable Checkboxes */}
          <ScrollView contentContainerStyle={styles.checkboxContainer}>
            {languageOptions.map(([first, second], index) => (
              <EachCheckBox
                key={index}
                data={Languages}
                checkbox1={first}
                checkbox2={second}
                onCheck1={data => setLanguages(data)}
                onCheck2={data => setLanguages(data)}
              />
            ))}
          </ScrollView>

          {/* Bottom Navigation */}
          <BottomNextAndPrevious
            showPrevious
            onNextPress={() => onNextPress(Languages)}
            onPreviousPress={() => navigation.replace('OnboardingSlideOne')}
          />

          {/* Dialog */}
          <Portal>
            <Dialog
              visible={dialogVisible}
              onDismiss={() => setDialogVisible(false)}>
              <Dialog.Title>Attention</Dialog.Title>
              <Dialog.Content>
                <PlainText text="Please select at least 2 languages" />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDialogVisible(false)}>OK</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </MainWrapper>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 10,
    backgroundColor: DefaultTheme.colors.background,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    height: height * 0.25,
    width: height * 0.4,
    borderRadius: 36,
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  checkboxContainer: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
});
