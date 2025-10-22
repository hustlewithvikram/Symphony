import React, {useEffect, useState} from 'react';
import {View, Dimensions, Image} from 'react-native';
import {Card, Text, ActivityIndicator} from 'react-native-paper';
import Animated, {useAnimatedRef} from 'react-native-reanimated';
import {GetLikedPlaylist} from '../../localstorage/StoreLikedPlaylists';
import {EachPlaylistCard} from '../../components/global/EachPlaylistCard';
import {useTheme} from '@react-navigation/native';

export const LikedPlaylistPage = () => {
  const theme = useTheme();
  const AnimatedRef = useAnimatedRef();
  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width;

  const totalPlaylists = likedPlaylists.filter(Boolean).length;

  async function getAllLikedPlaylists() {
    try {
      setIsLoading(true);
      const Playlists = await GetLikedPlaylist();
      const Temp = [];

      for (const [_, value] of Object.entries(Playlists.playlist)) {
        Temp[value.count] = value;
      }
      setLikedPlaylists(Temp);
    } catch (error) {
      console.error('Error fetching liked playlists:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllLikedPlaylists();
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
          Loading your playlists...
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
          paddingBottom: 80,
        }}>
        {/* Top Image Section */}
        <View style={styles.topSection}>
          <Image
            source={require('../../images/LikedPlaylist.png')}
            style={styles.topImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        {/* Stats Section */}
        <Card style={styles.statsCard} mode="contained">
          <Card.Content>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text
                  variant="headlineSmall"
                  style={{color: theme.colors.text}}>
                  {totalPlaylists}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{color: theme.colors.textSecondary}}>
                  Playlists
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Playlists Section */}
        <View style={styles.playlistsSection}>
          {likedPlaylists.filter(Boolean).length > 0 ? (
            <View style={styles.playlistsGrid}>
              {likedPlaylists.map((playlist, index) => {
                if (!playlist) return null;

                return (
                  <View key={playlist.id || index} style={styles.playlistItem}>
                    <EachPlaylistCard
                      name={playlist.name}
                      image={playlist.image}
                      id={playlist.id}
                      follower={playlist.follower}
                      MainContainerStyle={{
                        width: '100%',
                      }}
                    />
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text
                variant="headlineMedium"
                style={{color: theme.colors.textSecondary, marginBottom: 8}}>
                🎵
              </Text>
              <Text
                variant="titleMedium"
                style={{color: theme.colors.text, marginBottom: 8}}>
                No Playlists Yet
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.textSecondary,
                  textAlign: 'center',
                }}>
                Playlists you like will appear here
              </Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  statsCard: {
    margin: 16,
    marginTop: -40,
    elevation: 4,
  },
  statsContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  playlistsSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  playlistsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  playlistItem: {
    width: '48%',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
};
