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
import {SetUserNameValue} from '../../localstorage/StoreUserName';
import {DefaultTheme, useTheme} from '@react-navigation/native';
import {
  Text,
  Button,
  useTheme as usePaperTheme,
  Portal,
  Dialog,
  Paragraph,
  PaperProvider,
  TextInput,
} from 'react-native-paper';
import {useAppTheme} from '../../theme';

const {height, width} = Dimensions.get('window');

export const OnboardingSlideThree = ({navigation}) => {
  const [name, setName] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [nameDialogVisible, setNameDialogVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useAppTheme();

  const handleNextPress = async () => {
    if (!name.trim()) {
      setShowDialog(true);
      return;
    }
    await SetUserNameValue(name.trim());
    navigation.replace('MainRoute');
  };

  const handleNameSubmit = () => {
    if (name.trim()) {
      setNameDialogVisible(false);
      // Don't navigate here, just close dialog and enable Let's Go button
    }
  };

  const openNameDialog = () => {
    setNameDialogVisible(true);
  };

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
                uri: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
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
                  ALMOST THERE
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
                  What's Your{'\n'}Name?
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
                  Let's personalize your music experience
                </Text>
              </View>

              {/* Name Display */}
              <View style={styles.nameContainer}>
                {name ? (
                  <View style={styles.nameDisplay}>
                    <Text
                      variant="titleLarge"
                      style={[styles.nameText, {color: theme.colors.primary}]}>
                      Hello, {name}!
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={[
                        styles.nameSubtext,
                        {color: theme.colors.onSurfaceVariant},
                      ]}>
                      Ready to explore Symphony?
                    </Text>
                  </View>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text
                      variant="bodyLarge"
                      style={[
                        styles.placeholderText,
                        {color: theme.colors.onSurfaceVariant},
                      ]}>
                      Your name will appear here
                    </Text>
                  </View>
                )}
              </View>

              {/* Enter/Edit Name Button */}
              <View style={styles.enterNameContainer}>
                <Button
                  mode="contained"
                  onPress={openNameDialog}
                  style={[
                    styles.enterNameButton,
                    {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  contentStyle={styles.enterNameContent}
                  labelStyle={[
                    styles.enterNameLabel,
                    {
                      color: theme.colors.onPrimary,
                    },
                  ]}>
                  {name ? 'Edit Name' : 'Enter Your Name'}
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
              onPress={() => navigation.replace('OnboardingSlideTwo')}
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
              onPress={handleNextPress}
              disabled={!name.trim()}
              style={[
                styles.nextButton,
                {
                  backgroundColor: !name.trim()
                    ? theme.colors.surfaceDisabled
                    : theme.colors.primary,
                },
              ]}
              contentStyle={styles.navButtonContent}
              labelStyle={[
                styles.navButtonLabel,
                {
                  color: !name.trim()
                    ? theme.colors.onSurfaceDisabled
                    : theme.colors.onPrimary,
                },
              ]}
              icon="rocket-launch">
              Let's Go!
            </Button>
          </View>
        </View>

        {/* Name Requirement Dialog */}
        <Portal>
          <Dialog
            visible={showDialog}
            onDismiss={() => setShowDialog(false)}
            style={[styles.dialog, {backgroundColor: theme.colors.surface}]}>
            <Dialog.Icon
              icon="account-alert"
              size={40}
              color={theme.colors.primary}
            />
            <Dialog.Title
              style={[styles.dialogTitle, {color: theme.colors.onSurface}]}>
              Name Required
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph
                style={[
                  styles.dialogText,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                Please enter your name to personalize your music experience.
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setShowDialog(false);
                  openNameDialog();
                }}
                mode="contained"
                style={[
                  styles.dialogButton,
                  {backgroundColor: theme.colors.primary},
                ]}
                labelStyle={styles.dialogButtonLabel}
                icon="account-edit">
                Enter Name
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Name Input Dialog */}
        <Portal>
          <Dialog
            visible={nameDialogVisible}
            onDismiss={() => setNameDialogVisible(false)}
            style={[
              styles.nameDialog,
              {backgroundColor: theme.colors.surface},
            ]}>
            {/* Dialog Header */}
            <View style={styles.dialogHeader}>
              <Text
                variant="titleLarge"
                style={[
                  styles.nameDialogTitle,
                  {color: theme.colors.onSurface},
                ]}>
                {name ? 'Edit Your Name' : "What's Your Name?"}
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.dialogSubtitle,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                This will help personalize your experience
              </Text>
            </View>

            <Dialog.Content style={styles.nameInputContainer}>
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={[
                  styles.nameInput,
                  {
                    backgroundColor: theme.colors.surface,
                  },
                ]}
                contentStyle={{color: theme.colors.onSurface}}
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                autoFocus={true}
                onSubmitEditing={handleNameSubmit}
                maxLength={30}
                right={
                  name.length > 0 ? (
                    <TextInput.Icon
                      icon="close"
                      onPress={() => setName('')}
                      color={theme.colors.onSurfaceVariant}
                    />
                  ) : null
                }
              />
              <Text
                variant="bodySmall"
                style={[
                  styles.inputHint,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                This will be used to personalize your music recommendations
              </Text>
            </Dialog.Content>

            {/* Dialog Actions */}
            <Dialog.Actions style={styles.dialogActions}>
              <Button
                onPress={() => setNameDialogVisible(false)}
                mode="outlined"
                style={[
                  styles.nameDialogButton,
                  {
                    borderColor: theme.colors.outline,
                  },
                ]}
                labelStyle={{color: theme.colors.onSurface}}
                icon="close">
                Cancel
              </Button>
              <Button
                onPress={handleNameSubmit}
                mode="contained"
                style={[
                  styles.nameDialogButton,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                labelStyle={{color: theme.colors.onPrimary}}
                icon="check"
                disabled={!name.trim()}>
                Save
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
    marginBottom: 32,
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
  nameContainer: {
    alignItems: 'center',
    marginBottom: 32,
    minHeight: 40,
    justifyContent: 'center',
  },
  nameDisplay: {
    alignItems: 'center',
    gap: 8,
  },
  nameText: {
    fontWeight: '700',
    fontSize: 26,
  },
  nameSubtext: {
    opacity: 0.8,
    textAlign: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    opacity: 0.6,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  enterNameContainer: {
    alignItems: 'center',
    marginBottom: 10,
    // backgroundColor: 'red',
  },
  enterNameButton: {
    borderRadius: 16,
  },
  enterNameContent: {
    paddingVertical: 6,
  },
  enterNameLabel: {
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
  // Dialog Styles
  dialog: {
    borderRadius: 24,
    margin: 20,
  },
  dialogTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 20,
  },
  dialogText: {
    lineHeight: 22,
    opacity: 0.8,
    textAlign: 'center',
    fontSize: 15,
  },
  dialogButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  dialogButtonLabel: {
    fontWeight: '600',
  },
  nameDialog: {
    borderRadius: 24,
    margin: 20,
  },
  dialogHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  nameDialogTitle: {
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 4,
  },
  dialogSubtitle: {
    opacity: 0.8,
    textAlign: 'center',
  },
  nameInputContainer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  nameInput: {
    fontSize: 16,
    borderRadius: 12,
  },
  inputHint: {
    marginTop: 8,
    opacity: 0.7,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dialogActions: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  nameDialogButton: {
    borderRadius: 12,
    flex: 1,
  },
});
