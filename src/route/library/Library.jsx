import React, {useRef, useState} from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  Animated,
  Pressable,
  StyleSheet,
} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAppTheme} from '../../theme';
import {RouteHeading} from '../../components/home/RouteHeading';
import {EachLibraryCard} from '../../components/library/EachLibraryCard';

const LIBRARY_ITEMS = [
  {
    id: 1,
    text: 'Liked Songs',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    navigate: 'LikedSongs',
    icon: 'favorite',
    color: '#FF6B6B',
    description: 'Your favorite tracks',
    count: '128 songs',
  },
  {
    id: 2,
    text: 'Playlists',
    image:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    navigate: 'LikedPlaylists',
    icon: 'playlist-play',
    color: '#4ECDC4',
    description: 'Curated collections',
    count: '24 playlists',
  },
  {
    id: 3,
    text: 'About Project',
    image:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop',
    navigate: 'AboutProject',
    icon: 'info-outline',
    color: '#00B894',
    description: 'App details and credits',
    count: 'Version 1.0',
  },
];

export const Library = () => {
  const theme = useAppTheme();
  const width = Dimensions.get('window').width;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [stats] = useState({
    totalSongs: 245,
    totalPlaylists: 32,
    listeningTime: '45h',
  });

  const renderLibraryCard = item => {
    const cardWidth = (width - 48) / 2;
    return (
      <Pressable
        key={item.id}
        android_ripple={{
          color: theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        }}
        style={[
          styles.card,
          {
            width: cardWidth,
            backgroundColor: theme.colors.surface,
            shadowColor: theme.colors.shadow,
          },
        ]}>
        <EachLibraryCard
          text={item.text}
          image={{uri: item.image}}
          navigate={item.navigate}
          additionalProps={{
            icon: item.icon,
            color: item.color,
            description: item.description,
            count: item.count,
          }}
        />
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}>
      {/* Header */}
      <Animated.View style={[styles.header]}>
        <RouteHeading bottomText="Your Library" />
      </Animated.View>

      {/* Stats */}
      <View
        style={[
          styles.statsContainer,
          {
            backgroundColor: theme.dark
              ? 'rgba(255,255,255,0.05)'
              : theme.colors.surfaceVariant,
          },
        ]}>
        <Stat
          icon="music-note"
          label="Songs"
          value={stats.totalSongs}
          color={theme.colors.primary}
          textColor={theme.colors.text}
        />
        <Stat
          icon="playlist-play"
          label="Playlists"
          value={stats.totalPlaylists}
          color={theme.colors.primary}
          textColor={theme.colors.text}
        />
        <Stat
          icon="access-time"
          label="Listened"
          value={stats.listeningTime}
          color={theme.colors.primary}
          textColor={theme.colors.text}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}>
        <View style={styles.gridContainer}>
          {LIBRARY_ITEMS.map(renderLibraryCard)}
        </View>

        {/* Recents */}
        <View style={styles.recentContainer}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Recently Played
          </Text>
          <RecentItem
            icon="play-arrow"
            title="Blinding Lights"
            time="2 hours ago"
            theme={theme}
          />
          <RecentItem
            icon="favorite"
            title="Summer Hits Playlist"
            time="Yesterday"
            theme={theme}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const Stat = ({icon, label, value, color, textColor}) => (
  <View style={styles.statItem}>
    <Icon name={icon} size={22} color={color} />
    <View style={styles.statText}>
      <Text style={[styles.statNumber, {color: textColor}]}>{value}</Text>
      <Text style={[styles.statLabel, {color: textColor}]}>{label}</Text>
    </View>
  </View>
);

const RecentItem = ({icon, title, time, theme}) => (
  <View
    style={[
      styles.recentItem,
      {
        backgroundColor: theme.dark
          ? 'rgba(255,255,255,0.05)'
          : theme.colors.surfaceVariant,
      },
    ]}>
    <Icon name={icon} size={20} color={theme.colors.primary} />
    <View style={{flex: 1}}>
      <Text style={[styles.recentTitle, {color: theme.colors.text}]}>
        {title}
      </Text>
      <Text style={[styles.recentTime, {color: theme.colors.onSurfaceVariant}]}>
        {time}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 15,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 1},
  },
  recentContainer: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 10,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentTime: {
    fontSize: 12,
  },
});

export default Library;
