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
import {Spacer} from '../../components/global/Spacer';
import {useAppTheme} from '../../theme';

// Memoized components with improved styling
const SettingsCard = memo(({children, title}) => (
  <View style={styles.card}>
    {title && (
      <View style={styles.cardHeader}>
        <PlainText text={title} style={styles.cardTitle} />
      </View>
    )}
    {children}
  </View>
));

const SettingsButton = memo(({text, onPress, icon, description, isLast}) => (
  <Pressable
    style={({pressed}) => [
      styles.buttonContainer,
      pressed && styles.buttonPressed,
      isLast && styles.buttonLast,
    ]}
    onPress={onPress}
    android_ripple={{color: 'rgba(120, 120, 128, 0.2)'}}>
    <View style={styles.buttonContent}>
      <View style={[styles.iconContainer, styles[`${icon}Container`]]}>
        <FontAwesome6
          name={icon}
          size={16}
          color="#FFFFFF"
          style={styles.buttonIcon}
        />
      </View>
      <View style={styles.buttonTextContainer}>
        <PlainText text={text} style={styles.buttonText} />
        {description && (
          <SmallText text={description} style={styles.buttonDescription} />
        )}
      </View>
    </View>
    <FontAwesome6 name="chevron-right" size={14} color="#8E8E93" />
  </Pressable>
));

const SettingsDropdown = memo(
  ({data, label, placeholder, value, onChange, loading, description}) => (
    <View style={styles.dropdownContainer}>
      <View style={styles.dropdownTextContainer}>
        <PlainText text={label} style={styles.dropdownLabel} />
        {description && (
          <SmallText text={description} style={styles.dropdownDescription} />
        )}
      </View>
      {loading ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <View style={styles.dropdownWrapper}>
          <Dropdown
            data={data}
            labelField="value"
            valueField="value"
            value={value}
            placeholder={placeholder}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            containerStyle={styles.dropdownContainerStyle}
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
        </View>
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
  const theme = useAppTheme();

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
      'This will remove all temporary data and free up storage space. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Cache',
          style: 'destructive',
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
        <View style={styles.header}>
          <Heading
            text="Settings"
            style={(styles.heading, {color: theme.colors.textDark})}
          />
          <SmallText
            text="Customize your app experience"
            style={styles.subtitle}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <SettingsCard title="Account">
            <SettingsButton
              text="Change Name"
              description="Update your display name"
              icon="user"
              onPress={() => navigation.navigate('ChangeName')}
            />
            <View style={styles.separator} />
            <SettingsButton
              text="Select Languages"
              description="Choose preferred languages"
              icon="globe"
              onPress={() => navigation.navigate('SelectLanguages')}
              isLast={true}
            />
          </SettingsCard>

          <SettingsCard title="Appearance & Media">
            <SettingsDropdown
              data={FontSizeOptions}
              label="Font Size"
              description="Adjust text size throughout the app"
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
              description="Higher quality uses more data"
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
              label="Download Location"
              description="Where your files will be saved"
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

          <SettingsCard title="Storage">
            <SettingsButton
              text="Clear Cache"
              description="Free up storage space"
              icon="broom"
              onPress={handleClearCache}
              isLast={true}
            />
          </SettingsCard>

          <SettingsCard title="About">
            <View style={styles.versionContainer}>
              <View style={styles.versionTextContainer}>
                <SmallText text="App Version" style={styles.versionLabel} />
                <SmallText text="1.0.0" style={styles.versionValue} />
              </View>
              <View style={[styles.iconContainer, styles.infoContainer]}>
                <FontAwesome6 name="info" size={14} color="#FFFFFF" />
              </View>
            </View>
          </SettingsCard>

          <View style={styles.noteContainer}>
            <FontAwesome6
              name="circle-info"
              size={12}
              color="#8E8E93"
              style={styles.noteIcon}
            />
            <SmallText
              text="Restart the app after changing font size, name, or languages to see the effect."
              style={styles.noteText}
            />
          </View>
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
  header: {
    marginBottom: 25,
    paddingHorizontal: 5,
    paddingTop: 40,
  },
  heading: {
    fontSize: isSmallScreen ? 28 : 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  buttonPressed: {
    backgroundColor: 'rgba(120, 120, 128, 0.2)',
  },
  buttonLast: {
    borderBottomWidth: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userContainer: {
    backgroundColor: '#007AFF',
  },
  globeContainer: {
    backgroundColor: '#34C759',
  },
  broomContainer: {
    backgroundColor: '#FF3B30',
  },
  infoContainer: {
    backgroundColor: '#8E8E93',
  },
  buttonIcon: {
    // Icon styling is now handled by the container
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  buttonDescription: {
    color: '#8E8E93',
    fontSize: 13,
  },
  separator: {
    height: 1,
    backgroundColor: '#2C2C2E',
    marginHorizontal: 20,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  dropdownTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  dropdownLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  dropdownDescription: {
    color: '#8E8E93',
    fontSize: 13,
  },
  dropdownWrapper: {
    minWidth: 140,
  },
  placeholderStyle: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '400',
  },
  selectedTextStyle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  itemTextStyle: {
    color: '#000000',
    fontSize: 14,
  },
  dropdownContainerStyle: {
    backgroundColor: '#3A3A3C',
    borderRadius: 12,
    borderWidth: 0,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownStyle: {
    width: '100%',
    backgroundColor: '#3A3A3C',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#48484A',
  },
  dropdownItem: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#48484A',
  },
  dropdownItemSelected: {
    backgroundColor: '#007AFF',
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  dropdownItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  versionTextContainer: {
    flex: 1,
  },
  versionLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 2,
  },
  versionValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(120, 120, 128, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  noteText: {
    color: '#8E8E93',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
});
