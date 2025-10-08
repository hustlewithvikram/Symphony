import {DefaultTheme, useTheme} from '@react-navigation/native';
import {useState} from 'react';
import {
  Dimensions,
  TextInput,
  View,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Heading} from '../../components/global/Heading';
import {BottomNextAndPrevious} from '../../components/routeonboarding/BottomNextAndPrevious';
import {MainWrapper} from '../../layout/MainWrapper';
import {SetUserNameValue} from '../../localstorage/StoreUserName';
import {
  Portal,
  Dialog,
  Button,
  Paragraph,
  PaperProvider,
} from 'react-native-paper';

export const OnboardingSlideThree = ({navigation}) => {
  const width = Dimensions.get('window').width;
  const theme = useTheme();
  const [name, setName] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const NextPress = async value => {
    if (!value.trim()) {
      setShowDialog(true);
      return;
    }
    await SetUserNameValue(value.trim());
    navigation.replace('MainRoute');
  };

  return (
    <PaperProvider>
      <MainWrapper>
        <View
          style={[
            styles.container,
            {
              paddingTop:
                Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 40,
            },
          ]}>
          <FastImage
            source={require('../../images/GiveName.gif')}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Heading
            text="What should I call you?"
            nospace
            style={styles.heading}
          />

          <TextInput
            placeholder="Enter your name"
            placeholderTextColor={DefaultTheme.colors.text + '999'}
            value={name}
            onChangeText={setName}
            style={[styles.input, {color: DefaultTheme.colors.text}]}
          />
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: DefaultTheme.colors.background,
          }}>
          <BottomNextAndPrevious
            showPrevious
            nextText="Let's Go"
            onPreviousPress={() => navigation.replace('OnboardingSlideTwo')}
            onNextPress={() => NextPress(name)}
            style={{marginTop: 30}}
          />
        </View>

        {/* Dialog */}
        <Portal>
          <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
            <Dialog.Title>Oops!</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Please enter your name!</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowDialog(false)}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </MainWrapper>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: DefaultTheme.colors.background,
  },
  image: {
    height: 220,
    width: 220,
    borderRadius: 120,
    marginBottom: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: DefaultTheme.colors.text,
  },
  input: {
    width: '80%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#777',
    backgroundColor: '#eee',
    fontSize: 18,
    color: '#000',
  },
});
