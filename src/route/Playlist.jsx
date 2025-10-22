import React, {useEffect, useState} from 'react';
import {Dimensions, View, StyleSheet, StatusBar} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';
import {MainWrapper} from '../layout/MainWrapper';
import {EachSongCard} from '../components/global/EachSongCard';
import {LoadingComponent} from '../components/global/Loading';
import {PlainText} from '../components/global/PlainText';
import {SmallText} from '../components/global/SmallText';
import {getPlaylistData} from '../api/playlist';
import {useAppTheme} from '../theme';
import FormatArtist from '../utils/FormatArtists';
import {Appbar, Chip, Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');
const HEADER_HEIGHT = 280;
const HEADER_MAX_HEIGHT = 320;
const HEADER_MIN_HEIGHT = 100;

export const Playlist = ({route, navigation}) => {
  const theme = useAppTheme();
  const {id, image, name, follower} = route.params;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    fetchPlaylistData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPlaylistData() {
    try {
      setLoading(true);
      const playlistData = await getPlaylistData(id);
      setData(playlistData);
    } catch (e) {
      console.log('Error fetching playlist:', e);
    } finally {
      setLoading(false);
    }
  }

  // Header image animation
  const headerImageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [1.2, 1, 0.8],
      Extrapolate.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT / 2],
      Extrapolate.CLAMP,
    );

    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.7],
      [1, 0.3],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{scale}, {translateY}],
      opacity,
    };
  });

  // Header content animation
  const headerContentStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.5],
      [0, -80],
      Extrapolate.CLAMP,
    );

    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.3],
      [1, 0],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{translateY}],
      opacity,
    };
  });

  // App bar animation
  const appBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 100, HEADER_HEIGHT - 50],
      [0, 1],
      Extrapolate.CLAMP,
    );

    return {
      opacity,
    };
  });

  const PlaylistInfo = () => (
    <Animated.View style={[styles.headerContent, headerContentStyle]}>
      <View style={styles.playlistInfo}>
        <Text
          variant="headlineMedium"
          style={[styles.playlistName, {color: theme.colors.onSurface}]}>
          {name}
        </Text>
        <View style={styles.metaContainer}>
          <Chip
            mode="outlined"
            style={[styles.metaChip, {borderColor: theme.colors.primary}]}
            textStyle={{color: theme.colors.primary}}>
            {follower || '0'} Followers
          </Chip>
          {data?.data?.releaseDate && (
            <Chip
              mode="outlined"
              style={[styles.metaChip, {borderColor: theme.colors.outline}]}
              textStyle={{color: theme.colors.onSurfaceVariant}}>
              {data.data.releaseDate}
            </Chip>
          )}
        </View>
        {data?.data?.songCount && (
          <Text
            variant="bodyMedium"
            style={[styles.songCount, {color: theme.colors.onSurfaceVariant}]}>
            {data.data.songCount} songs
          </Text>
        )}
      </View>
    </Animated.View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="queue-music"
        size={80}
        color={theme.colors.onSurfaceVariant}
        style={styles.emptyIcon}
      />
      <Text
        variant="headlineSmall"
        style={[styles.emptyTitle, {color: theme.colors.onSurface}]}>
        No Songs Available
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptySubtitle, {color: theme.colors.onSurfaceVariant}]}>
        This playlist doesn't contain any songs yet
      </Text>
    </View>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar backgroundColor="transparent" translucent />

      {/* Animated App Bar */}
      <Animated.View style={[styles.appBar, appBarStyle]}>
        <Appbar.Header
          style={[
            styles.appbarHeader,
            {backgroundColor: theme.colors.surface},
          ]}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            title={
              <Text
                variant="titleMedium"
                style={[styles.appbarTitle, {color: theme.colors.onSurface}]}
                numberOfLines={1}>
                {name}
              </Text>
            }
          />
        </Appbar.Header>
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header Image */}
        <Animated.View style={[styles.headerImageContainer, headerImageStyle]}>
          <Animated.Image
            source={{uri: image}}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View
            style={[
              styles.headerOverlay,
              {backgroundColor: theme.colors.background + '80'},
            ]}
          />
        </Animated.View>

        {/* Playlist Info */}
        <PlaylistInfo />

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <LoadingComponent loading={true} height={200} />
          </View>
        )}

        {/* Song List */}
        {!loading && data?.data?.songs?.length > 0 && (
          <View style={styles.songsContainer}>
            <View style={styles.songsHeader}>
              <Text
                variant="titleLarge"
                style={[styles.songsTitle, {color: theme.colors.onSurface}]}>
                Songs
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.songsCount,
                  {color: theme.colors.onSurfaceVariant},
                ]}>
                {data.data.songs.length} tracks
              </Text>
            </View>

            <View style={styles.songsList}>
              {data.data.songs.map((song, index) => (
                <EachSongCard
                  key={`${song.id}-${index}`}
                  Data={data}
                  isFromPlaylist={true}
                  index={index}
                  artist={FormatArtist(song.artists?.primary)}
                  language={song.language}
                  playlist
                  artistID={song.primary_artists_id}
                  duration={song.duration}
                  image={song.image?.[2]?.url}
                  id={song.id}
                  width="100%"
                  title={song.name}
                />
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {!loading && (!data?.data?.songs || data.data.songs.length === 0) && (
          <EmptyState />
        )}

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  appbarHeader: {
    elevation: 0,
    backgroundColor: 'transparent',
  },
  appbarTitle: {
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerImageContainer: {
    width: width,
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    zIndex: 10,
  },
  playlistInfo: {
    gap: 12,
  },
  playlistName: {
    fontWeight: '700',
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaChip: {
    backgroundColor: 'transparent',
  },
  songCount: {
    fontWeight: '500',
  },
  loadingContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  songsContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  songsHeader: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  songsTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  songsCount: {
    fontWeight: '500',
  },
  songsList: {
    gap: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyIcon: {
    opacity: 0.7,
    marginBottom: 20,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  bottomPadding: {
    height: 40,
  },
});
