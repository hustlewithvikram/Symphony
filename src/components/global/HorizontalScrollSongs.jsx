import {EachSongCard} from './EachSongCard';
import {Dimensions, ScrollView, View, StyleSheet} from 'react-native';
import {useEffect, useState, useCallback, memo} from 'react';
import {getPlaylistData} from '../../api/playlist';
import {LoadingComponent} from './Loading';
import {Heading} from './Heading';
import FormatArtist from '../../utils/FormatArtists';
import {Spacer} from './Spacer';

// Constants
const COLUMN_SIZE = 3;
const COLUMN_WIDTH = 340; // Fixed width for each column to ensure proper spacing

// Memoized song column component to prevent unnecessary re-renders
const SongColumn = memo(({songs, columnIndex, data}) => (
  <View style={styles.column}>
    {songs.map((song, rowIndex) => (
      <EachSongCard
        key={`${song.id}-${columnIndex}-${rowIndex}`}
        index={columnIndex * COLUMN_SIZE + rowIndex}
        Data={data}
        isFromPlaylist
        artist={FormatArtist(song?.artists?.primary)}
        language={song?.language}
        playlist
        artistID={song?.primary_artists_id}
        duration={song?.duration}
        image={song?.image[2]?.url}
        id={song?.id}
        title={song?.name}
        url={song?.downloadUrl}
        style={styles.songCard}
      />
    ))}
  </View>
));

export const HorizontalScrollSongs = ({id}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchPlaylistData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getPlaylistData(id);
      setData(response);
    } catch (err) {
      console.error('Error fetching playlist data:', err);
      setError('Failed to load playlist');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlaylistData();
  }, [fetchPlaylistData]);

  // Don't render anything if no ID is provided
  if (!id) {
    return null;
  }

  const songs = data?.data?.songs || [];
  const playlistName = data?.data?.name || 'Playlist';

  // Split songs into columns of 3 for vertical stacking
  const chunkedSongs = [];
  for (let i = 0; i < songs.length; i += COLUMN_SIZE) {
    chunkedSongs.push(songs.slice(i, i + COLUMN_SIZE));
  }

  // Show error state
  if (error && !loading) {
    return (
      <>
        <Spacer height={30} />
        <Heading text="Error" nospace />
        <Spacer />
        <View style={styles.errorContainer}>
          <Heading text={error} size="sm" />
        </View>
      </>
    );
  }

  return (
    <>
      <Spacer height={30} />
      <Heading text={loading ? 'Loading...' : playlistName} nospace />
      <Spacer />

      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingComponent loading={loading} />
        </View>
      ) : chunkedSongs.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.columnsContainer}>
            {chunkedSongs.map((columnSongs, columnIndex) => (
              <SongColumn
                key={`column-${columnIndex}`}
                songs={columnSongs}
                columnIndex={columnIndex}
                data={data}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Heading text="No songs available" size="sm" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    // paddingHorizontal: 16,
    paddingVertical: 8,
  },
  columnsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    width: COLUMN_WIDTH,
    flexDirection: 'column',
    gap: 12,
  },
  songCard: {
    width: '100%', // Each song card takes full column width
    marginBottom: 0, // Gap is handled by the column gap
  },
  loadingContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
