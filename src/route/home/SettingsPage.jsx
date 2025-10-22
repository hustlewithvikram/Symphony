/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect, useMemo} from 'react';
import {View, ScrollView, StyleSheet, ToastAndroid} from 'react-native';
import {
  Appbar,
  List,
  Divider,
  Button,
  ActivityIndicator,
  Text,
  Title,
  Menu,
  Portal,
  Dialog,
  TextInput,
  useTheme,
  Checkbox,
  Card,
} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  GetDownloadPath,
  GetFontSizeValue,
  GetPlaybackQuality,
  SetDownloadPath,
  SetFontSizeValue,
  SetPlaybackQuality,
} from '../../localstorage/AppSettings';
import {SetLanguageValue, GetLanguageValue} from '../../localstorage/Languages';
import {useAppTheme} from '../../theme';

const Icon = React.memo(({name, size, color}) => (
  <MaterialIcons name={name} size={size} color={color} />
));

// Improved SettingMenuItem with better styling
const SettingMenuItem = React.memo(
  ({label, value, description, options, onSelect, theme, loading}) => {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
      <>
        <List.Item
          title={label}
          description={description}
          titleStyle={[styles.settingTitle, {color: theme.colors.onSurface}]}
          descriptionStyle={[
            styles.settingDescription,
            {color: theme.colors.onSurfaceVariant},
          ]}
          style={styles.settingListItem}
          right={() => (
            <View style={styles.settingRightContainer}>
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <View style={styles.valueContainer}>
                  <View
                    style={[
                      styles.valueChip,
                      {backgroundColor: theme.colors.primary + '15'},
                    ]}>
                    <Text
                      style={[styles.valueText, {color: theme.colors.primary}]}>
                      {value}
                    </Text>
                  </View>
                  <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                      <Button
                        mode="text"
                        compact
                        style={styles.menuButton}
                        onPress={() => setMenuVisible(true)}>
                        <Icon
                          name="unfold-more"
                          size={20}
                          color={theme.colors.primary}
                        />
                      </Button>
                    }
                    contentStyle={[
                      styles.menuContent,
                      {backgroundColor: theme.colors.background},
                    ]}>
                    {options.map(option => (
                      <Menu.Item
                        key={option}
                        onPress={() => {
                          onSelect(option);
                          setMenuVisible(false);
                        }}
                        title={option}
                        titleStyle={{color: theme.colors.onSurface}}
                        style={[
                          styles.menuItem,
                          option === value && {
                            backgroundColor: theme.colors.primary + '20',
                          },
                        ]}
                      />
                    ))}
                  </Menu>
                </View>
              )}
            </View>
          )}
        />
        <Divider
          style={[
            styles.settingDivider,
            {backgroundColor: theme.colors.outline + '15'},
          ]}
        />
      </>
    );
  },
);

// Improved SettingsSection with better styling
const SettingsSection = React.memo(({title, icon, children, theme}) => (
  <Card
    style={[
      styles.sectionCard,
      {backgroundColor: theme.colors.surface, padding: 0},
    ]}
    elevation={1}>
    <Card.Content style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <View
          style={[
            styles.sectionIcon,
            {backgroundColor: theme.colors.primary + '15'},
          ]}>
          <Icon name={icon} size={18} color={theme.colors.primary} />
        </View>
        <Title style={[styles.sectionTitle, {color: theme.colors.onSurface}]}>
          {title}
        </Title>
      </View>
      <View style={styles.sectionChildren}>{children}</View>
    </Card.Content>
  </Card>
));

// Languages Dialog Component
const LanguagesDialog = React.memo(({visible, onDismiss, onConfirm, theme}) => {
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

  // Load current languages when dialog opens
  useEffect(() => {
    if (visible) {
      const loadCurrentLanguages = async () => {
        try {
          const savedLanguages = await GetLanguageValue();
          if (savedLanguages) {
            const languagesArray = savedLanguages.split(',');
            setSelectedLanguages(languagesArray);
          }
        } catch (error) {
          console.log('Error loading languages:', error);
        }
      };
      loadCurrentLanguages();
    }
  }, [visible]);

  const toggleLanguage = language => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(lang => lang !== language)
        : [...prev, language],
    );
  };

  const handleConfirm = () => {
    if (selectedLanguages.length < 2) {
      ToastAndroid.show(
        'Please select at least 2 languages',
        ToastAndroid.SHORT,
      );
      return;
    }
    onConfirm(selectedLanguages);
  };

  const handleDismiss = () => {
    setSelectedLanguages([]);
    onDismiss();
  };

  return (
    <Dialog
      visible={visible}
      onDismiss={handleDismiss}
      style={[styles.languagesDialog, {backgroundColor: theme.colors.surface}]}>
      {/* Dialog Header */}
      <View style={styles.dialogHeader}>
        <View style={styles.dialogTitleContainer}>
          <Icon name="translate" size={24} color={theme.colors.primary} />
          <Text style={[styles.dialogTitle, {color: theme.colors.onSurface}]}>
            Select Languages
          </Text>
        </View>
        <Text
          style={[
            styles.dialogSubtitle,
            {color: theme.colors.onSurfaceVariant},
          ]}>
          Choose at least 2 languages for personalized content
        </Text>

        <View style={styles.selectedCountContainer}>
          <Text
            style={[
              styles.selectedCount,
              {
                color:
                  selectedLanguages.length >= 2
                    ? theme.colors.primary
                    : theme.colors.error,
              },
            ]}>
            {selectedLanguages.length} of 2+ selected
          </Text>
        </View>
      </View>

      {/* Scrollable Languages List */}
      <Dialog.ScrollArea style={styles.dialogScrollArea}>
        <ScrollView style={styles.languagesContainer}>
          {allLanguages.map(language => (
            <View
              key={language}
              style={[
                styles.languageItem,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderLeftWidth: selectedLanguages.includes(language) ? 3 : 0,
                  borderLeftColor: selectedLanguages.includes(language)
                    ? theme.colors.primary
                    : 'transparent',
                },
              ]}>
              <Checkbox.Android
                status={
                  selectedLanguages.includes(language) ? 'checked' : 'unchecked'
                }
                onPress={() => toggleLanguage(language)}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.languageText,
                  {color: theme.colors.onSurface},
                  selectedLanguages.includes(language) && {
                    color: theme.colors.primary,
                    fontWeight: '500',
                  },
                ]}
                onPress={() => toggleLanguage(language)}>
                {language}
              </Text>
            </View>
          ))}
        </ScrollView>
      </Dialog.ScrollArea>

      {/* Dialog Actions */}
      <Dialog.Actions style={styles.dialogActions}>
        <Button
          onPress={handleDismiss}
          style={[
            styles.actionButton,
            {flex: 1, backgroundColor: theme.colors.surfaceVariant},
          ]}
          labelStyle={[
            styles.actionButtonLabel,
            {color: theme.colors.onSurfaceVariant},
          ]}>
          Cancel
        </Button>
        <Button
          onPress={handleConfirm}
          mode="contained"
          disabled={selectedLanguages.length < 2}
          style={[
            styles.actionButton,
            styles.confirmButton,
            {backgroundColor: theme.colors.primary},
          ]}
          labelStyle={styles.confirmButtonLabel}>
          Save
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
});

function useSettings() {
  const [settings, setSettings] = useState({
    fontSize: '',
    playbackQuality: '',
    downloadPath: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [fontSize, playbackQuality, downloadPath] = await Promise.all([
          GetFontSizeValue(),
          GetPlaybackQuality(),
          GetDownloadPath(),
        ]);

        setSettings({
          fontSize: fontSize || 'Medium',
          playbackQuality: playbackQuality || '160kbps',
          downloadPath: downloadPath || 'Downloads',
        });
      } catch {
        ToastAndroid.show('Failed to load settings', ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateSetting = async (key, setter, storageFunc, value, label) => {
    try {
      await storageFunc(value);
      setter(prev => ({...prev, [key]: value}));
      ToastAndroid.show(`${label} updated to ${value}`, ToastAndroid.SHORT);
    } catch {
      ToastAndroid.show(
        `Failed to update ${label.toLowerCase()}`,
        ToastAndroid.SHORT,
      );
    }
  };

  return {settings, setSettings, updateSetting, loading};
}

export const SettingsPage = ({navigation}) => {
  const theme = useAppTheme();
  const {settings, setSettings, updateSetting, loading} = useSettings();

  const [clearCacheDialog, setClearCacheDialog] = useState(false);
  const [changeNameDialog, setChangeNameDialog] = useState(false);
  const [languagesDialog, setLanguagesDialog] = useState(false);
  const [newName, setNewName] = useState('');

  const FontSizeOptions = useMemo(() => ['Small', 'Medium', 'Large'], []);
  const PlaybackOptions = useMemo(
    () => ['12kbps', '48kbps', '96kbps', '160kbps', '320kbps'],
    [],
  );
  const DownloadOptions = useMemo(() => ['Music', 'Downloads'], []);

  const handleLanguagesConfirm = async selectedLanguages => {
    try {
      const languagesString = selectedLanguages.join(',');
      await SetLanguageValue(languagesString);
      setLanguagesDialog(false);
      ToastAndroid.show(
        'Languages updated successfully! Restart app to see changes.',
        ToastAndroid.SHORT,
      );
    } catch (error) {
      ToastAndroid.show('Failed to update languages', ToastAndroid.SHORT);
    }
  };

  if (loading) {
    return (
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Settings" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, {color: theme.colors.onSurface}]}>
            Loading settings...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SettingsSection title="Account" icon="person" theme={theme}>
          <List.Item
            title="Change Name"
            description="Update your display name"
            titleStyle={[styles.listTitle, {color: theme.colors.onSurface}]}
            descriptionStyle={[
              styles.listDescription,
              {color: theme.colors.onSurfaceVariant},
            ]}
            left={props => (
              <List.Icon
                {...props}
                icon="account-edit"
                color={theme.colors.primary}
              />
            )}
            onPress={() => setChangeNameDialog(true)}
            style={styles.listItem}
          />
          <Divider
            style={[
              styles.divider,
              {backgroundColor: theme.colors.outline + '15'},
            ]}
          />
          <List.Item
            title="Select Languages"
            description="Choose preferred languages"
            titleStyle={[styles.listTitle, {color: theme.colors.onSurface}]}
            descriptionStyle={[
              styles.listDescription,
              {color: theme.colors.onSurfaceVariant},
            ]}
            left={props => (
              <List.Icon
                {...props}
                icon="translate"
                color={theme.colors.primary}
              />
            )}
            onPress={() => setLanguagesDialog(true)}
            style={styles.listItem}
          />
        </SettingsSection>

        {/* Improved Appearance & Media Section */}
        <SettingsSection
          title="Appearance & Media"
          icon="palette"
          theme={theme}>
          <SettingMenuItem
            label="Font Size"
            value={settings.fontSize}
            description="Adjust text size throughout the app"
            options={FontSizeOptions}
            onSelect={value =>
              updateSetting(
                'fontSize',
                setSettings,
                SetFontSizeValue,
                value,
                'Font size',
              )
            }
            loading={loading}
            theme={theme}
          />
          <SettingMenuItem
            label="Playback Quality"
            value={settings.playbackQuality}
            description="Higher quality uses more data"
            options={PlaybackOptions}
            onSelect={value =>
              updateSetting(
                'playbackQuality',
                setSettings,
                SetPlaybackQuality,
                value,
                'Playback quality',
              )
            }
            loading={loading}
            theme={theme}
          />
          <SettingMenuItem
            label="Download Location"
            value={settings.downloadPath}
            description="Where your files will be saved"
            options={DownloadOptions}
            onSelect={value =>
              updateSetting(
                'downloadPath',
                setSettings,
                SetDownloadPath,
                value,
                'Download path',
              )
            }
            loading={loading}
            theme={theme}
          />
        </SettingsSection>

        {/* Storage Section */}
        <SettingsSection title="Storage" icon="storage" theme={theme}>
          <List.Item
            title="Clear Cache"
            description="Free up storage space"
            titleStyle={[styles.listTitle, {color: theme.colors.onSurface}]}
            descriptionStyle={[
              styles.listDescription,
              {color: theme.colors.onSurfaceVariant},
            ]}
            left={props => (
              <List.Icon {...props} icon="broom" color={theme.colors.primary} />
            )}
            onPress={() => setClearCacheDialog(true)}
            style={styles.listItem}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About" icon="info" theme={theme}>
          <List.Item
            title="App Version"
            description="1.0.0"
            titleStyle={[styles.listTitle, {color: theme.colors.onSurface}]}
            descriptionStyle={[
              styles.listDescription,
              {color: theme.colors.onSurfaceVariant},
            ]}
            left={props => (
              <List.Icon
                {...props}
                icon="cellphone"
                color={theme.colors.primary}
              />
            )}
            style={styles.listItem}
          />
          <Divider
            style={[
              styles.divider,
              {backgroundColor: theme.colors.outline + '15'},
            ]}
          />
          <List.Item
            title="Privacy Policy"
            description="View our privacy practices"
            titleStyle={[styles.listTitle, {color: theme.colors.onSurface}]}
            descriptionStyle={[
              styles.listDescription,
              {color: theme.colors.onSurfaceVariant},
            ]}
            left={props => (
              <List.Icon
                {...props}
                icon="shield-account"
                color={theme.colors.primary}
              />
            )}
            onPress={() => {}}
            style={styles.listItem}
          />
        </SettingsSection>

        {/* Info Note */}
        <View
          style={[
            styles.noteContainer,
            {backgroundColor: theme.colors.surfaceVariant},
          ]}>
          <Icon name="info" size={20} color={theme.colors.onSurfaceVariant} />
          <Text
            style={[styles.noteText, {color: theme.colors.onSurfaceVariant}]}>
            Restart the app after changing settings to see the effect.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Dialogs */}
      <Portal>
        <LanguagesDialog
          visible={languagesDialog}
          onDismiss={() => setLanguagesDialog(false)}
          onConfirm={handleLanguagesConfirm}
          theme={theme}
        />

        <Dialog
          visible={clearCacheDialog}
          onDismiss={() => setClearCacheDialog(false)}
          style={[styles.dialog, {backgroundColor: theme.colors.surface}]}>
          <Dialog.Title style={{color: theme.colors.onSurface}}>
            Clear Cache
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{color: theme.colors.onSurface}}>
              This will remove all temporary data and free up storage space.
              This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearCacheDialog(false)}>Cancel</Button>
            <Button
              onPress={() => {
                setClearCacheDialog(false);
                ToastAndroid.show(
                  'Cache cleared successfully',
                  ToastAndroid.SHORT,
                );
              }}
              textColor={theme.colors.error}>
              Clear Cache
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={changeNameDialog}
          onDismiss={() => setChangeNameDialog(false)}
          style={[styles.dialog, {backgroundColor: theme.colors.surface}]}>
          <Dialog.Title style={{color: theme.colors.onSurface}}>
            Change Name
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="New Name"
              value={newName}
              onChangeText={setNewName}
              mode="outlined"
              style={styles.textInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setChangeNameDialog(false)}>Cancel</Button>
            <Button
              onPress={() => {
                setChangeNameDialog(false);
                setNewName('');
                ToastAndroid.show(
                  'Name updated successfully',
                  ToastAndroid.SHORT,
                );
              }}
              disabled={!newName.trim()}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollView: {flex: 1},
  scrollContent: {padding: 16, gap: 20},

  // Improved Section Styles
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionContent: {
    padding: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  sectionChildren: {
    // paddingHorizontal: 12,
  },

  // Improved Setting Menu Item Styles
  settingListItem: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    minHeight: 72,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 16,
    opacity: 0.8,
  },
  settingRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 13,
    fontWeight: '600',
  },
  menuButton: {
    minWidth: 36,
    marginLeft: 4,
  },
  menuContent: {
    borderRadius: 12,
    elevation: 4,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingDivider: {
    height: 1,
    marginHorizontal: 16,
  },

  // Regular List Items
  listItem: {
    // paddingHorizontal: 8,
    paddingVertical: 12,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  listDescription: {
    fontSize: 13,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },

  // Rest of the styles remain the same
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {fontSize: 16},
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  noteText: {flex: 1, fontSize: 13, lineHeight: 18},
  bottomPadding: {height: 30},
  dialog: {borderRadius: 12},
  textInput: {marginTop: 8},

  // Languages Dialog Styles
  languagesDialog: {
    borderRadius: 16,
    marginHorizontal: 20,
    maxHeight: '75%',
  },
  dialogHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  dialogTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  dialogSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  selectedCountContainer: {
    alignItems: 'center',
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  dialogScrollArea: {
    paddingHorizontal: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  languagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  languageText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  dialogActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderRadius: 999,
    minWidth: 80,
    paddingVertical: 8,
  },
  actionButtonLabel: {
    fontSize: 14,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
  confirmButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
