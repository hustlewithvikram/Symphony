import React, {useContext, memo, useCallback, useState} from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  View,
} from 'react-native';
import {
  Portal,
  Dialog,
  Button,
  IconButton,
  List,
  Chip,
  ProgressBar,
  useTheme,
  Text,
} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';

import Context from '../../context/Context';
import {GetDownloadPath} from '../../localstorage/AppSettings';
import FormatTitleAndArtist from '../../utils/FormatTitleAndArtist';
import {AddSongsToQueue, getIndexQuality} from '../../../MusicPlayerFunctions';
import {useAppTheme} from '../../theme';

const MemoizedFastImage = memo(FastImage);

export const EachSongMenuModal = memo(({Visible, setVisible}) => {
  const theme = useAppTheme();
  const {updateTrack} = useContext(Context);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const closeModal = useCallback(() => {
    setVisible({visible: false});
    setIsDownloading(false);
    setDownloadProgress(0);
  }, [setVisible]);

  const actualDownload = useCallback(async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    let dirs = ReactNativeBlobUtil.fs.dirs;
    const path = await GetDownloadPath();

    ToastAndroid.showWithGravity(
      `Download Started`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );

    ReactNativeBlobUtil.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        path:
          path === 'Downloads'
            ? dirs.LegacyDownloadDir +
              `/Symphony/${FormatTitleAndArtist(Visible.title)}.m4a`
            : dirs.LegacyMusicDir +
              `/Symphony/${FormatTitleAndArtist(Visible.title)}.m4a`,
        notification: true,
        title: `${FormatTitleAndArtist(Visible.title)}`,
      },
      fileCache: true,
    })
      .fetch('GET', Visible.url[4].url, {})
      .progress((received, total) => {
        setDownloadProgress(received / total);
      })
      .then(res => {
        console.log('The file saved to ', res.path());
        ToastAndroid.showWithGravity(
          'Download successfully Completed',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        closeModal();
      })
      .catch(error => {
        console.error('Download failed:', error);
        ToastAndroid.showWithGravity(
          'Download failed',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setIsDownloading(false);
      });
  }, [Visible, closeModal]);

  const getPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      actualDownload();
    } else {
      try {
        let deviceVersion = DeviceInfo.getSystemVersion();
        let granted = PermissionsAndroid.RESULTS.DENIED;
        if (deviceVersion >= 13) {
          granted = PermissionsAndroid.RESULTS.GRANTED;
        } else {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
        }
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          actualDownload();
        } else {
          ToastAndroid.showWithGravity(
            'Storage permission required',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
      } catch (err) {
        console.log('Permission error', err);
        ToastAndroid.showWithGravity(
          'Permission error occurred',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    }
  }, [actualDownload]);

  const addSongToQueue = useCallback(async () => {
    try {
      const quality = await getIndexQuality();
      const song = {
        url: Visible.url[quality].url,
        title: FormatTitleAndArtist(Visible.title),
        artist: FormatTitleAndArtist(Visible.artist),
        artwork: Visible.image,
        duration: Visible.duration,
        id: Visible.id,
        language: Visible.language,
        image: Visible.image,
        downloadUrl: Visible.url,
      };
      await AddSongsToQueue([song]);
      updateTrack();
      closeModal();
      ToastAndroid.showWithGravity(
        `Song Added To Queue`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } catch (error) {
      console.error('Error adding to queue:', error);
      ToastAndroid.showWithGravity(
        'Failed to add to queue',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  }, [Visible, updateTrack, closeModal]);

  const formatDuration = useCallback(duration => {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <Portal>
      <Dialog
        visible={Visible.visible}
        onDismiss={closeModal}
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          margin: 20,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}>
        <Dialog.Content style={{paddingHorizontal: 0}}>
          {/* Header */}
          <View style={{paddingHorizontal: 24, paddingBottom: 16}}>
            <Text
              variant="titleMedium"
              style={{
                color: theme.colors.onSurface,
                fontWeight: 'bold',
                // textAlign: 'center',
              }}>
              Song Options
            </Text>
          </View>

          {/* Song Info with better layout */}
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 24,
              paddingBottom: 20,
              alignItems: 'center',
            }}>
            <MemoizedFastImage
              source={{
                uri:
                  Visible.image ||
                  'https://htmlcolorcodes.com/assets/images/colors/gray-color-solid-background-1920x1080.png',
              }}
              style={{
                height: 70,
                width: 70,
                borderRadius: 12,
              }}
              resizeMode="cover"
            />
            <View style={{flex: 1, marginLeft: 16}}>
              <Text
                variant="bodyLarge"
                numberOfLines={2}
                style={{
                  color: theme.colors.onSurface,
                  fontWeight: 'bold',
                  marginBottom: 4,
                }}>
                {FormatTitleAndArtist(Visible?.title) || 'No music :('}
              </Text>
              <Text
                variant="bodyMedium"
                numberOfLines={1}
                style={{
                  color: theme.colors.onSurfaceVariant,
                  marginBottom: 8,
                }}>
                {FormatTitleAndArtist(Visible?.artist) || 'Explore now!'}
              </Text>

              {/* Metadata Row */}
              <View style={{flexDirection: 'row', gap: 8}}>
                {Visible.language && (
                  <Chip
                    mode="flat"
                    compact
                    style={{backgroundColor: theme.colors.surfaceVariant}}
                    textStyle={{
                      color: theme.colors.onPrimaryContainer,
                      fontSize: 11,
                    }}>
                    {Visible.language}
                  </Chip>
                )}
                {Visible.duration && (
                  <Chip
                    mode="flat"
                    compact
                    style={{backgroundColor: theme.colors.surfaceVariant}}
                    textStyle={{
                      color: theme.colors.onSurfaceVariant,
                      fontSize: 11,
                    }}
                    iconColor={theme.colors.black}
                    icon="clock-outline">
                    {formatDuration(Visible.duration)}
                  </Chip>
                )}
              </View>
            </View>
          </View>

          {/* Download Progress */}
          {isDownloading && (
            <View style={{paddingHorizontal: 24, marginBottom: 16}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}>
                <Text
                  variant="labelSmall"
                  style={{color: theme.colors.onSurface}}>
                  Downloading...
                </Text>
                <Text
                  variant="labelSmall"
                  style={{color: theme.colors.primary, fontWeight: 'bold'}}>
                  {Math.round(downloadProgress * 100)}%
                </Text>
              </View>
              <ProgressBar
                progress={downloadProgress}
                color={theme.colors.primary}
                style={{height: 6, borderRadius: 3}}
              />
            </View>
          )}

          {/* Main Action Buttons */}
          <View style={{gap: 12, paddingHorizontal: 24, marginBottom: 20}}>
            <Button
              mode="contained"
              icon="playlist-music"
              onPress={addSongToQueue}
              disabled={isDownloading}
              contentStyle={{height: 50}}
              labelStyle={{
                color: theme.colors.onPrimary,
                fontWeight: 'bold',
                fontSize: 15,
              }}
              style={{borderRadius: 12}}>
              Add to Queue
            </Button>

            <Button
              mode="outlined"
              icon={isDownloading ? 'progress-download' : 'download'}
              onPress={getPermission}
              disabled={isDownloading}
              contentStyle={{height: 50}}
              labelStyle={{
                color: theme.colors.primary,
                fontWeight: 'bold',
                fontSize: 15,
              }}
              style={{
                borderRadius: 12,
                borderColor: theme.colors.primary,
                borderWidth: 2,
              }}>
              {isDownloading ? 'Downloading...' : 'Download Song'}
            </Button>
          </View>

          {/* Quick Actions */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 24,
              marginBottom: 24,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: theme.colors.outlineVariant,
            }}>
            <View style={{alignItems: 'center'}}>
              <IconButton
                icon="heart-outline"
                size={24}
                mode="contained"
                containerColor={theme.colors.background}
                iconColor={theme.colors.primary}
                onPress={() => {
                  ToastAndroid.showWithGravity(
                    'Added to favorites',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
                }}
              />
              <Text
                variant="labelSmall"
                style={{color: theme.colors.onSurfaceVariant, marginTop: 4}}>
                Favorite
              </Text>
            </View>

            <View style={{alignItems: 'center'}}>
              <IconButton
                icon="playlist-plus"
                size={24}
                mode="contained"
                containerColor={theme.colors.background}
                iconColor={theme.colors.primary}
                onPress={() => {
                  ToastAndroid.showWithGravity(
                    'Add to playlist',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
                }}
              />
              <Text
                variant="labelSmall"
                style={{color: theme.colors.onSurfaceVariant, marginTop: 4}}>
                Playlist
              </Text>
            </View>

            <View style={{alignItems: 'center'}}>
              <IconButton
                icon="share"
                size={24}
                mode="contained"
                containerColor={theme.colors.background}
                iconColor={theme.colors.primary}
                onPress={() => {
                  ToastAndroid.showWithGravity(
                    'Share feature coming soon',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
                }}
              />
              <Text
                variant="labelSmall"
                style={{color: theme.colors.onSurfaceVariant, marginTop: 4}}>
                Share
              </Text>
            </View>
          </View>

          {/* Close Button at Bottom */}
          <View style={{paddingHorizontal: 24}}>
            <Button
              mode="text"
              onPress={closeModal}
              contentStyle={{height: 44}}
              labelStyle={{
                color: theme.colors.textWhite,
                fontSize: 16,
                fontWeight: '600',
              }}
              style={{
                borderRadius: 999,
                paddingHorizontal: 6,
                paddingVertical: 4,
                backgroundColor: theme.colors.primary,
              }}>
              Close
            </Button>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
});
