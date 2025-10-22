import React, {useEffect, useState} from 'react';
import {Dimensions, View, ScrollView, Image} from 'react-native';
import {
  Card,
  Text,
  Divider,
  IconButton,
  FAB,
  ActivityIndicator,
} from 'react-native-paper';
import Animated, {useAnimatedRef} from 'react-native-reanimated';
import {LikedPagesTopHeader} from '../../components/library/TopHeaderLikedPages';
import {GetLikedSongs} from '../../localstorage/StoreLikedSongs';
import {EachSongCard} from '../../components/global/EachSongCard';
import {useAppTheme} from '../../theme';

export const LikedSongPage = () => {
  const AnimatedRef = useAnimatedRef();
  const [likedSongs, setLikedSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const width = Dimensions.get('window').width;
  const theme = useAppTheme();

  const totalDuration = likedSongs.reduce(
    (total, song) => total + (song.duration || 0),
    0,
  );
  const totalSongs = likedSongs.length;

  const formatTotalDuration = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  async function getAllLikedSongs() {
    try {
      setIsLoading(true);
      const Songs = await GetLikedSongs();
      const Temp = [];

      for (const [_, value] of Object.entries(Songs.songs)) {
        Temp[value.count] = value;
      }

      const Final = [];
      Temp?.forEach(e => {
        if (e) {
          Final.push({
            url: e.url,
            title: e?.title,
            artist: e?.artist,
            artwork: e?.image,
            duration: e?.duration,
            id: e?.id,
            language: e?.language,
            artistID: e?.primary_artists_id,
          });
        }
      });

      setLikedSongs(Final);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllLikedSongs();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{marginTop: 16, color: theme.colors.text}}>
          Loading your songs...
        </Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        ref={AnimatedRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}>
        {/* Top Image Section */}
        <View style={styles.topSection}>
          <Image
            source={require('../../images/LikedSong.png')}
            style={styles.topImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        {/* Stats Section */}
        <Card style={styles.statsCard} mode="contained">
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <IconButton
                  icon="music-note"
                  size={24}
                  iconColor={theme.colors.primary}
                />
                <View style={styles.statText}>
                  <Text
                    variant="headlineSmall"
                    style={{color: theme.colors.text}}>
                    {totalSongs}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{color: theme.colors.textSecondary}}>
                    Songs
                  </Text>
                </View>
              </View>

              <View style={styles.statItem}>
                <IconButton
                  icon="clock-outline"
                  size={24}
                  iconColor={theme.colors.primary}
                />
                <View style={styles.statText}>
                  <Text
                    variant="headlineSmall"
                    style={{color: theme.colors.text}}>
                    {formatTotalDuration(totalDuration)}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{color: theme.colors.textSecondary}}>
                    Total Time
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            {likedSongs.length > 0 && (
              <View style={styles.actionsRow}>
                <IconButton
                  icon="play-circle"
                  size={32}
                  iconColor={theme.colors.primary}
                  onPress={() => console.log('Play All')}
                />
                <IconButton
                  icon="shuffle"
                  size={32}
                  iconColor={theme.colors.primary}
                  onPress={() => console.log('Shuffle')}
                />
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Songs List */}
        <View style={styles.songsSection}>
          {likedSongs.length > 0 ? (
            likedSongs.map((song, index) => (
              <View key={song.id || index}>
                <EachSongCard
                  width={width - 32}
                  Data={likedSongs}
                  index={index}
                  url={song?.url}
                  id={song?.id}
                  title={song?.title}
                  artist={song?.artist}
                  image={song?.artwork}
                  language={song?.language}
                  duration={song?.duration}
                  artistID={song?.artistID}
                  theme={theme}
                />
                {index < likedSongs.length - 1 && (
                  <Divider style={{marginHorizontal: 16}} />
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <IconButton
                icon="music-off"
                size={48}
                iconColor={theme.colors.textSecondary}
              />
              <Text
                variant="titleMedium"
                style={{color: theme.colors.text, marginTop: 8}}>
                No Liked Songs
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.textSecondary,
                  textAlign: 'center',
                }}>
                Songs you like will appear here
              </Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Floating Action Button */}
      {likedSongs.length > 0 && (
        <FAB
          icon="play"
          onPress={() => console.log('Play All')}
          style={[styles.fab, {backgroundColor: theme.colors.primary}]}
          color="#FFF"
        />
      )}
    </View>
  );
};

const styles = {
  topSection: {
    height: 200,
    position: 'relative',
  },
  topImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  statsCard: {
    margin: 16,
    marginTop: -40,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    alignItems: 'center',
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  songsSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
};
