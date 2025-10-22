import {Pressable, View, StyleSheet} from 'react-native';
import {PlainText} from './PlainText';
import {SmallText} from './SmallText';
import FastImage from 'react-native-fast-image';
import {
  AddPlaylist,
  getIndexQuality,
  PlayOneSong,
} from '../../../MusicPlayerFunctions';
import {memo, useContext, useCallback, useMemo} from 'react';
import Context from '../../context/Context';
import {useActiveTrack, usePlaybackState} from 'react-native-track-player';
import FormatTitleAndArtist from '../../utils/FormatTitleAndArtist';
import FormatArtist from '../../utils/FormatArtists';
import {EachSongMenuButton} from '../musicplayer/EachSongMenuButton';
import {useAppTheme} from '../../theme';
import Animated from 'react-native-reanimated';

// Constants
const IMAGE_SIZE = 50;
const IMAGE_BORDER_RADIUS = 10;
const VERTICAL_PADDING = 6;
const HORIZONTAL_GAP = 10;

// Helper function to format song data
const formatSongData = (song, quality) => ({
  url: song?.downloadUrl?.[quality]?.url,
  title: FormatTitleAndArtist(song?.name || song?.title),
  artist: FormatTitleAndArtist(
    FormatArtist(song?.artists?.primary) || song?.artist,
  ),
  artwork: song?.image?.[2]?.url || song?.artwork,
  duration: song?.duration,
  id: song?.id,
  language: song?.language,
  artistID: song?.primary_artists_id || song?.artistID,
  image: song?.image?.[2]?.url || song?.image,
  downloadUrl: song?.downloadUrl,
});

export const EachSongCard = memo(function EachSongCard({
  title,
  artist,
  image,
  id,
  url,
  duration,
  language,
  artistID,
  isLibraryLiked,
  isFromPlaylist,
  Data,
  index,
  style,
}) {
  const {updateTrack, setVisible} = useContext(Context);
  const currentPlaying = useActiveTrack();
  const playerState = usePlaybackState();
  const theme = useAppTheme();

  // Memoized formatted text
  const formattedTitle = useMemo(() => FormatTitleAndArtist(title), [title]);

  const formattedArtist = useMemo(() => FormatTitleAndArtist(artist), [artist]);

  // Memoized playback state
  const {isPlaying, isPaused} = useMemo(
    () => ({
      isPlaying: currentPlaying?.id === id && playerState.state === 'playing',
      isPaused: currentPlaying?.id === id && playerState.state !== 'playing',
    }),
    [currentPlaying?.id, id, playerState.state],
  );

  // Memoized image source
  const imageSource = useMemo(() => {
    if (isPlaying) {
      return require('../../images/playing.gif');
    }
    if (isPaused) {
      return require('../../images/songPaused.gif');
    }
    return {uri: image};
  }, [isPlaying, isPaused, image]);

  // Handle adding song to player
  const AddSongToPlayer = useCallback(async () => {
    try {
      if (isFromPlaylist && Data?.data?.songs) {
        const quality = await getIndexQuality();
        const ForMusicPlayer = Data.data.songs
          .slice(index)
          .map(song => formatSongData(song, quality));
        await AddPlaylist(ForMusicPlayer);
      } else if (isLibraryLiked && Data) {
        const Final = Data.slice(index).map(song => formatSongData(song));
        await AddPlaylist(Final);
      } else {
        const quality = await getIndexQuality();
        const song = formatSongData(
          {
            downloadUrl: url,
            name: title,
            artists: {primary: artist},
            image: [{url: image}],
            duration,
            id,
            language,
            primary_artists_id: artistID,
          },
          quality,
        );
        PlayOneSong(song);
      }
      updateTrack();
    } catch (error) {
      console.error('Error adding song to player:', error);
    }
  }, [
    Data,
    index,
    isFromPlaylist,
    isLibraryLiked,
    title,
    artist,
    image,
    id,
    url,
    duration,
    language,
    artistID,
    updateTrack,
  ]);

  // Handle menu button press
  const handleMenuPress = useCallback(() => {
    setVisible({
      visible: true,
      title,
      artist,
      image,
      id,
      url,
      duration,
      language,
    });
  }, [setVisible, title, artist, image, id, url, duration, language]);

  return (
    <Animated.View style={[styles.container, style]}>
      <Pressable
        onPress={AddSongToPlayer}
        style={styles.pressable}
        android_ripple={{
          color: theme.colors.surface,
          borderless: false,
        }}>
        <FastImage
          source={imageSource}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.textContainer}>
          <PlainText
            text={formattedTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.title, {color: theme.colors.onSurface}]}
          />
          <SmallText
            text={formattedArtist}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.artist, {color: theme.colors.onSurfaceVariant}]}
          />
        </View>
      </Pressable>

      <EachSongMenuButton Onpress={handleMenuPress} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    width: '100%', // Take full available width
  },
  pressable: {
    flexDirection: 'row',
    gap: HORIZONTAL_GAP,
    alignItems: 'center',
    flex: 1, // Take all available space
    paddingVertical: VERTICAL_PADDING,
    borderRadius: 8,
    paddingHorizontal: 8, // Add horizontal padding for better touch area
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_BORDER_RADIUS,
  },
  textContainer: {
    flex: 1, // Take remaining space
    flexShrink: 1, // Allow shrinking if needed
    marginRight: 8, // Space between text and menu button
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  artist: {
    fontSize: 13,
    opacity: 0.8,
  },
});
