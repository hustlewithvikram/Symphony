import React, {useState, useCallback, useMemo} from 'react';
import {
  Dimensions,
  FlatList,
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {EachSongCard} from '../global/EachSongCard';
import {getSearchSongData} from '../../api/songs';
import {LoadingComponent} from '../global/Loading';
import {useAppTheme} from '../../theme';
import {Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function SongDisplay({data, limit, Searchtext}) {
  const theme = useAppTheme();
  const [songData, setSongData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const totalPages = useMemo(
    () => Math.ceil((songData?.data?.total ?? 1) / limit),
    [songData?.data?.total, limit],
  );

  const formatArtist = useCallback(artists => {
    if (!artists?.length) return '';
    return artists.map(artist => artist.name).join(', ');
  }, []);

  const fetchMoreSongs = useCallback(
    async (text, page) => {
      if (!hasMore || !text || page > totalPages) return;

      try {
        setLoading(true);
        const newData = await getSearchSongData(text, page, limit);

        if (newData?.data?.results?.length > 0) {
          setSongData(prev => ({
            ...prev,
            data: {
              ...prev.data,
              results: [...(prev.data?.results || []), ...newData.data.results],
            },
          }));

          if (page >= totalPages || newData.data.results.length < limit) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.log('Error fetching more songs:', error);
      } finally {
        setLoading(false);
      }
    },
    [hasMore, totalPages, limit],
  );

  const refreshData = useCallback(async () => {
    if (!Searchtext) return;

    try {
      setRefreshing(true);
      setHasMore(true);
      setCurrentPage(1);

      const freshData = await getSearchSongData(Searchtext, 1, limit);
      setSongData(freshData);

      if (freshData?.data?.results?.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.log('Error refreshing songs:', error);
    } finally {
      setRefreshing(false);
    }
  }, [Searchtext, limit]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMoreSongs(Searchtext, nextPage);
    }
  }, [loading, hasMore, currentPage, Searchtext, fetchMoreSongs]);

  const renderSongItem = useCallback(
    ({item, index}) => {
      if (item.LoadingComponent) {
        return (
          <View style={styles.loadingContainer}>
            <LoadingComponent loading={true} height={60} />
          </View>
        );
      }

      return (
        <EachSongCard
          artistID={item?.primaryArtistsId}
          language={item?.language}
          duration={item?.duration}
          image={item?.image?.[2]?.url ?? ''}
          id={item?.id}
          width={Dimensions.get('window').width * 0.85}
          title={item?.name}
          artist={formatArtist(item?.artists?.primary)}
          url={item?.downloadUrl}
          style={styles.songCard}
        />
      );
    },
    [formatArtist],
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="music-off"
        size={64}
        color={theme.colors.onSurfaceVariant}
        style={styles.emptyIcon}
      />
      <Text
        variant="headlineSmall"
        style={[styles.emptyTitle, {color: theme.colors.onSurface}]}>
        No Songs Found
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptySubtitle, {color: theme.colors.onSurfaceVariant}]}>
        Try searching with different keywords
      </Text>
    </View>
  );

  const ListFooter = () => {
    if (!hasMore && songData?.data?.results?.length > 0) {
      return (
        <View style={styles.endContainer}>
          <Text
            style={[styles.endText, {color: theme.colors.onSurfaceVariant}]}>
            All songs loaded
          </Text>
        </View>
      );
    }
    return null;
  };

  if (!Searchtext) {
    return (
      <View style={styles.initialContainer}>
        <MaterialIcons
          name="search"
          size={64}
          color={theme.colors.onSurfaceVariant}
          style={styles.initialIcon}
        />
        <Text
          variant="bodyLarge"
          style={[styles.initialText, {color: theme.colors.onSurfaceVariant}]}>
          Search for songs to see results
        </Text>
      </View>
    );
  }

  if (!songData?.data?.results?.length && !loading) {
    return <EmptyState />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) =>
          item.LoadingComponent ? 'loading' : `song-${item.id}-${index}`
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.flatListContent}
        data={[
          ...(songData?.data?.results || []),
          ...(hasMore && songData?.data?.results?.length > 0
            ? [{LoadingComponent: true}]
            : []),
        ]}
        renderItem={renderSongItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListFooterComponent={ListFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  flatListContent: {
    paddingBottom: 120,
  },
  songCard: {
    marginBottom: 12,
  },
  loadingContainer: {
    paddingVertical: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    opacity: 0.7,
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  initialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  initialIcon: {
    opacity: 0.7,
    marginBottom: 16,
  },
  initialText: {
    textAlign: 'center',
    opacity: 0.8,
  },
  endContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  endText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
