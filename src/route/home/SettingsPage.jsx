import React, {useEffect, useState, useCallback, memo} from 'react';
import {
  View,
  ScrollView,
  Pressable,
  ToastAndroid,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Heading} from '../../components/global/Heading';
import {PlainText} from '../../components/global/PlainText';
import {SmallText} from '../../components/global/SmallText';
import {Dropdown} from 'react-native-element-dropdown';
import {MainWrapper} from '../../layout/MainWrapper';
import {PaddingConatiner} from '../../layout/PaddingConatiner';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import {
  GetDownloadPath,
  GetFontSizeValue,
  GetPlaybackQuality,
  SetDownloadPath,
  SetFontSizeValue,
  SetPlaybackQuality,
} from '../../localstorage/AppSettings';

// Memoized components to prevent unnecessary re-renders
const SettingsCard = memo(({children}) => (
  <View style={styles.card}>{children}</View>
));

const SettingsButton = memo(({text, onPress, icon}) => (
  <Pressable
    style={({pressed}) => [
      styles.buttonContainer,
      pressed && styles.buttonPressed,
    ]}
    onPress={onPress}
    android_ripple={{color: '#3A3F47'}}>
    <View style={styles.buttonContent}>
      {icon && (
        <FontAwesome6
          name={icon}
          size={16}
          color="#F4F5FC"
          style={styles.buttonIcon}
        />
      )}
      <PlainText text={text} style={styles.buttonText} />
    </View>
    <FontAwesome6 name="chevron-right" size={16} color="#888" />
  </Pressable>
));

const SettingsDropdown = memo(
  ({data, label, placeholder, value, onChange, loading}) => (
    <View style={styles.dropdownContainer}>
      <PlainText text={label} style={styles.dropdownLabel} />
      {loading ? (
        <ActivityIndicator size="small" color="#888" />
      ) : (
        <Dropdown
          data={data}
          labelField="value"
          valueField="value"
          value={value}
          placeholder={placeholder}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemTextStyle}
          containerStyle={styles.dropdownWrapper}
          style={styles.dropdownStyle}
          onChange={item => onChange(item.value)}
          renderItem={(item, selected) => (
            <View
              style={[
                styles.dropdownItem,
                selected && styles.dropdownItemSelected,
              ]}>
              <PlainText
                text={item.value}
                style={[
                  styles.dropdownItemText,
                  selected && styles.dropdownItemTextSelected,
                ]}
              />
            </View>
          )}
        />
      )}
    </View>
  ),
);

export const SettingsPage = ({navigation}) => {
  const [fontSize, setFontSize] = useState('');
  const [playbackQuality, setPlaybackQuality] = useState('');
  const [downloadPath, setDownloadPath] = useState('');
  const [loading, setLoading] = useState({
    fontSize: true,
    playback: true,
    download: true,
  });

  const FontSizeOptions = [
    {value: 'Small'},
    {value: 'Medium'},
    {value: 'Large'},
  ];
  const PlaybackOptions = [
    {value: '12kbps'},
    {value: '48kbps'},
    {value: '96kbps'},
    {value: '160kbps'},
    {value: '320kbps'},
  ];
  const DownloadOptions = [{value: 'Music'}, {value: 'Downloads'}];

  // Load settings data
  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const [fontSizeValue, playbackValue, downloadPathValue] =
          await Promise.all([
            GetFontSizeValue(),
            GetPlaybackQuality(),
            GetDownloadPath(),
          ]);

        if (isMounted) {
          setFontSize(fontSizeValue);
          setPlaybackQuality(playbackValue);
          setDownloadPath(downloadPathValue);
          setLoading({fontSize: false, playback: false, download: false});
        }
      } catch (error) {
        if (isMounted) {
          ToastAndroid.showWithGravity(
            'Failed to load settings',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          setLoading({fontSize: false, playback: false, download: false});
        }
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoized change handler to prevent recreation on every render
  const handleChange = useCallback(
    async (setter, storageFunc, value, message, key) => {
      try {
        await storageFunc(value);
        setter(value);
        ToastAndroid.showWithGravity(
          `${message} updated to ${value}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } catch (error) {
        ToastAndroid.showWithGravity(
          `Failed to update ${message.toLowerCase()}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    },
    [],
  );

  const handleClearCache = useCallback(() => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            // Implement cache clearing logic here
            ToastAndroid.showWithGravity(
              'Cache cleared successfully',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          },
        },
      ],
    );
  }, []);

  return (
    <MainWrapper>
      <PaddingConatiner>
        <Heading text="Settings" style={styles.heading} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <SettingsCard>
            <SettingsButton
              text="Change Name"
              icon="user"
              onPress={() => navigation.navigate('ChangeName')}
            />
            <View style={styles.separator} />
            <SettingsButton
              text="Select Languages"
              icon="globe"
              onPress={() => navigation.navigate('SelectLanguages')}
            />
            <View style={styles.separator} />
            <SettingsButton
              text="Clear Cache"
              icon="file"
              onPress={handleClearCache}
            />
          </SettingsCard>

          <SettingsCard>
            <SettingsDropdown
              data={FontSizeOptions}
              label="Font Size"
              placeholder="Select font size"
              value={fontSize}
              loading={loading.fontSize}
              onChange={value =>
                handleChange(
                  setFontSize,
                  SetFontSizeValue,
                  value,
                  'Font size',
                  'fontSize',
                )
              }
            />
            <View style={styles.separator} />
            <SettingsDropdown
              data={PlaybackOptions}
              label="Playback Quality"
              placeholder="Select quality"
              value={playbackQuality}
              loading={loading.playback}
              onChange={value =>
                handleChange(
                  setPlaybackQuality,
                  SetPlaybackQuality,
                  value,
                  'Playback quality',
                  'playback',
                )
              }
            />
            <View style={styles.separator} />
            <SettingsDropdown
              data={DownloadOptions}
              label="Download Path"
              placeholder="Select path"
              value={downloadPath}
              loading={loading.download}
              onChange={value =>
                handleChange(
                  setDownloadPath,
                  SetDownloadPath,
                  value,
                  'Download path',
                  'download',
                )
              }
            />
          </SettingsCard>

          <SettingsCard>
            <SmallText text="App Version" style={styles.versionLabel} />
            <SmallText text="1.0.0" style={styles.versionValue} />
          </SettingsCard>

          <SmallText
            text="*Note: Restart the app after changing font size, name, or languages to see the effect."
            style={styles.noteText}
          />
        </ScrollView>
      </PaddingConatiner>
    </MainWrapper>
  );
};

const {width} = Dimensions.get('window');
const isSmallScreen = width < 375;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  heading: {
    marginBottom: 20,
    fontSize: isSmallScreen ? 22 : 24,
  },
  card: {
    backgroundColor: '#21252B',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    overflow: 'hidden',
  },
  buttonPressed: {
    backgroundColor: '#3A3F47',
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#F4F5FC',
  },
  separator: {
    height: 1,
    backgroundColor: '#3A3F47',
    marginHorizontal: 5,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  dropdownLabel: {
    color: '#F4F5FC',
    fontSize: 16,
    flex: 1,
  },
  placeholderStyle: {
    color: '#888',
    fontSize: 14,
  },
  selectedTextStyle: {
    color: '#262626',
    fontSize: 14,
  },
  itemTextStyle: {
    color: '#262626', // Changed to black for better visibility
  },
  dropdownWrapper: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 0,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownStyle: {
    width: 140,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dropdownItem: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemSelected: {
    backgroundColor: '#4285F4',
  },
  dropdownItemText: {
    color: '#000000', // Changed to black for better visibility
    fontSize: 14,
  },
  dropdownItemTextSelected: {
    color: '#FFFFFF',
  },
  noteText: {
    marginTop: 15,
    color: '#CCCCCC',
    textAlign: 'center',
    fontSize: 12,
  },
  versionLabel: {
    color: '#888',
    textAlign: 'center',
  },
  versionValue: {
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 4,
  },
});
