import React, {useState} from 'react';
import {View, ToastAndroid} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {MainWrapper} from '../../layout/MainWrapper';
import FastImage from 'react-native-fast-image';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {PlainText} from '../../components/global/PlainText';
import {Spacer} from '../../components/global/Spacer';
import {Button, Dialog, Portal, Checkbox, Text} from 'react-native-paper';
import {SetLanguageValue} from '../../localstorage/Languages';

export const SelectLanguages = ({navigation}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const allLanguages = [
    'English',
    'Hindi',
    'Punjabi',
    'Tamil',
    'Telugu',
    'Marathi',
    'Bhojpuri',
    'Bengali',
    'Kannada',
    'Gujarati',
    'Malayalam',
    'Urdu',
    'Rajasthani',
    'Odia',
    'Assamese',
  ];

  const toggleLanguage = lang => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang],
    );
  };

  const handleConfirm = async () => {
    if (selectedLanguages.length < 2) {
      ToastAndroid.show(
        'Please select at least 2 languages',
        ToastAndroid.SHORT,
      );
      return;
    }
    const Lang = selectedLanguages.join(',');
    await SetLanguageValue(Lang);
    setVisible(false);
    navigation.pop();
    ToastAndroid.showWithGravity(
      'Please restart the app',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  return (
    <MainWrapper>
      <View style={{alignItems: 'center', marginTop: 10}}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <FastImage
            source={require('../../images/selectLanguage.gif')}
            style={{
              height: 150,
              width: 150,
              borderRadius: 100,
            }}
          />
        </Animated.View>

        <Spacer />

        <Animated.View entering={FadeInDown.delay(700)}>
          <PlainText text="Select at least 2 languages" />
        </Animated.View>
      </View>

      <Spacer />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          mode="contained"
          onPress={() => setVisible(true)}
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: 10,
            paddingHorizontal: 20,
          }}>
          Choose Languages
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={{
            borderRadius: 20,
            backgroundColor: theme.colors.background,
          }}>
          <Dialog.Title>Select Languages</Dialog.Title>
          <Dialog.ScrollArea style={{maxHeight: 300, paddingHorizontal: 10}}>
            <View>
              {allLanguages.map(lang => (
                <View
                  key={lang}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 4,
                  }}>
                  <Checkbox
                    status={
                      selectedLanguages.includes(lang) ? 'checked' : 'unchecked'
                    }
                    onPress={() => toggleLanguage(lang)}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={{
                      color: theme.colors.onBackground,
                      fontSize: 16,
                    }}>
                    {lang}
                  </Text>
                </View>
              ))}
            </View>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button onPress={handleConfirm}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </MainWrapper>
  );
};
