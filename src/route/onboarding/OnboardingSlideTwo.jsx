import {MainWrapper} from '../../layout/MainWrapper';
import FastImage from 'react-native-fast-image';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import {useState} from 'react';
import {SetLanguageValue} from '../../localstorage/Languages';
import {DefaultTheme, useTheme} from '@react-navigation/native';
import {
  Text,
  Button,
  useTheme as usePaperTheme,
  Portal,
  Dialog,
  Paragraph,
  PaperProvider,
  Checkbox,
  List,
} from 'react-native-paper';
import {useAppTheme} from '../../theme';

const {height, width} = Dimensions.get('window');

export const OnboardingSlideTwo = ({navigation}) => {
  const [languages, setLanguages] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [languageDialogVisible, setLanguageDialogVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useAppTheme();

  const onNextPress = async () => {
    if (languages.length < 2) {
      setDialogVisible(true);
    } else {
      const itemsString = languages.join(',');
      await SetLanguageValue(itemsString);
      navigation.replace('OnboardingSlideThree');
    }
  };

  const toggleLanguage = language => {
    setLanguages(prev => {
      if (prev.includes(language)) {
        return prev.filter(lang => lang !== language);
      } else {
        return [...prev, language];
      }
    });
  };

  const languageOptions = [
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
    'Konkani',
  ];

  // eslint-disable-next-line react/no-unstable-nested-components
  const SelectedTags = () => (
    <View style={styles.selectedContainer}>
      <Text
        variant="labelMedium"
        style={[styles.selectedTitle, {color: theme.colors.onSurface}]}>
        Selected Languages ({languages.length})
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.selectedScroll}>
        <View style={styles.selectedItems}>
          {languages.map(language => (
            <View
              key={language}
              style={[
                styles.tag,
                {backgroundColor: theme.colors.primaryContainer},
              ]}>
              <Text
                style={[
                  styles.tagText,
                  {color: theme.colors.onPrimaryContainer},
                ]}>
                {language}
              </Text>
            </View>
          ))}
          {languages.length === 0 && (
            <Text
              style={[
                styles.placeholderText,
                {color: theme.colors.onSurfaceVariant},
              ]}>
              No languages selected
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <PaperProvider>
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
                uri: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
              }}
              style={styles.heroImage}
              resizeMode={FastImage.resizeMode.cover}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
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
                  MUSIC TASTE
                </Text>
                <Text
                  variant="displaySmall"
                  style={[
                    styles.title,
                    {
                      color: theme.colors.onSurface,
                      textAlign: 'center',
                    },
                  ]}>
                  Choose Languages
                </Text>
                <Text
                  variant="bodyLarge"
                  style={[
                    styles.subtitle,
                    {
                      color: theme.colors.onSurfaceVariant,
                      textAlign: 'center',
                    },
                  ]}>
                  Select languages for your music preferences
                </Text>
              </View>

              {/* Selected Tags */}
              <SelectedTags />

              {/* Add Languages Button */}
              <View style={styles.addLanguageContainer}>
                <Button
                  mode="contained"
                  onPress={() => setLanguageDialogVisible(true)}
                  style={[
                    styles.addLanguageButton,
                    {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  contentStyle={styles.addLanguageContent}
                  labelStyle={[
                    styles.addLanguageLabel,
                    {
                      color: theme.colors.onPrimary,
                    },
                  ]}
                  icon="plus">
                  Select Languages
                </Button>
              </View>

              {/* Progress Indicator */}
              <View style={styles.progressContainer}>
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
              </View>
            </View>
          </View>

          {/* Bottom Navigation */}
          <View
            style={[
              styles.navigationContainer,
              {
                backgroundColor: theme.colors.surface,
              },
            ]}>
            <Button
              mode="outlined"
              onPress={() => navigation.replace('OnboardingSlideOne')}
              style={[
                styles.previousButton,
                {
                  borderColor: theme.colors.primary,
                },
              ]}
              contentStyle={styles.navButtonContent}
              labelStyle={[
                styles.navButtonLabel,
                {
                  color: theme.colors.primary,
                },
              ]}
              icon="arrow-left">
              Back
            </Button>

            <Button
              mode="contained"
              onPress={onNextPress}
              disabled={languages.length < 2}
              style={[
                styles.nextButton,
                {
                  backgroundColor:
                    languages.length < 2
                      ? theme.colors.surfaceDisabled
                      : theme.colors.primary,
                },
              ]}
              contentStyle={styles.navButtonContent}
              labelStyle={[
                styles.navButtonLabel,
                {
                  color:
                    languages.length < 2
                      ? theme.colors.onSurfaceDisabled
                      : theme.colors.onPrimary,
                },
              ]}
              icon="arrow-right">
              Continue
            </Button>
          </View>
        </View>

        {/* Language Requirement Dialog */}
        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
            style={styles.dialog}>
            <Dialog.Icon icon="alert" size={32} color={theme.colors.primary} />
            <Dialog.Title
              style={[
                styles.dialogTitle,
                {color: theme.colors.onSurface, textAlign: 'center'},
              ]}>
              Select Languages
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph
                style={[
                  styles.dialogText,
                  {
                    color: theme.colors.onSurfaceVariant,
                    textAlign: 'center',
                  },
                ]}>
                Please select at least 2 languages to personalize your music
                experience.
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button
                onPress={() => setDialogVisible(false)}
                mode="contained"
                style={[
                  styles.dialogButton,
                  {backgroundColor: theme.colors.primary},
                ]}
                labelStyle={{color: theme.colors.onPrimary}}>
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Language Selection Dialog */}
        <Portal>
          <Dialog
            visible={languageDialogVisible}
            onDismiss={() => setLanguageDialogVisible(false)}
            style={[
              styles.languageDialog,
              {backgroundColor: theme.colors.surface},
            ]}>
            <Dialog.Title
              style={[
                styles.languageDialogTitle,
                {color: theme.colors.onSurface, textAlign: 'center'},
              ]}>
              Select Languages
            </Dialog.Title>
            <Dialog.ScrollArea style={styles.languageScrollArea}>
              <ScrollView>
                {languageOptions.map(language => (
                  <List.Item
                    key={language}
                    title={language}
                    titleStyle={{color: theme.colors.onSurface}}
                    onPress={() => toggleLanguage(language)}
                    left={props => (
                      <Checkbox.Android
                        status={
                          languages.includes(language) ? 'checked' : 'unchecked'
                        }
                        onPress={() => toggleLanguage(language)}
                        color={theme.colors.primary}
                      />
                    )}
                    style={styles.languageItem}
                  />
                ))}
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions style={styles.dialogActions}>
              <Button
                onPress={() => setLanguageDialogVisible(false)}
                mode="outlined"
                style={[
                  styles.languageDialogButton,
                  {
                    borderColor: theme.colors.primary,
                  },
                ]}
                labelStyle={{color: theme.colors.primary}}>
                Cancel
              </Button>
              <Button
                onPress={() => setLanguageDialogVisible(false)}
                mode="contained"
                style={[
                  styles.languageDialogButton,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                labelStyle={{color: theme.colors.onPrimary}}>
                Confirm
              </Button>
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
    backgroundColor: '#000',
  },
  heroContainer: {
    height: height * 0.45,
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
    paddingBottom: 16,
  },
  decorativeLine: {
    width: 32,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  pretitle: {
    fontWeight: '700',
    letterSpacing: 1.2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
  },
  title: {
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    lineHeight: 22,
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  selectedContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  selectedTitle: {
    fontWeight: '600',
    marginBottom: 12,
    opacity: 0.8,
    textAlign: 'center',
  },
  selectedScroll: {
    maxHeight: 30,
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  placeholderText: {
    opacity: 0.6,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  addLanguageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  addLanguageButton: {
    borderRadius: 16,
  },
  addLanguageContent: {
    paddingVertical: 6,
  },
  addLanguageLabel: {
    fontWeight: '600',
    fontSize: 15,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  previousButton: {
    borderRadius: 12,
    minWidth: width * 0.35,
    borderWidth: 1.5,
  },
  nextButton: {
    borderRadius: 12,
    minWidth: width * 0.35,
  },
  navButtonContent: {
    paddingVertical: 6,
  },
  navButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  dialog: {
    borderRadius: 20,
    margin: 20,
  },
  dialogTitle: {
    fontWeight: '700',
    marginTop: 8,
  },
  dialogText: {
    lineHeight: 22,
    opacity: 0.8,
  },
  dialogActions: {
    justifyContent: 'center',
  },
  dialogButton: {
    borderRadius: 12,
  },
  languageDialog: {
    borderRadius: 20,
    margin: 16,
    maxHeight: height * 0.7,
  },
  languageDialogTitle: {
    fontWeight: '700',
  },
  languageScrollArea: {
    paddingHorizontal: 0,
    maxHeight: height * 0.5,
  },
  languageItem: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  languageDialogButton: {
    borderRadius: 8,
    marginHorizontal: 4,
    flex: 1,
  },
});
