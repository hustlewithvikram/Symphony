import React, {useState, useCallback, useMemo} from 'react';
import {
  Dimensions,
  FlatList,
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {LoadingComponent} from '../global/Loading';
import {EachPlaylistCard} from '../global/EachPlaylistCard';
import {PlainText} from '../global/PlainText';
import {SmallText} from '../global/SmallText';
import {getSearchPlaylistData} from '../../api/playlist';
import {useAppTheme} from '../../theme';
import {Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function PlaylistDisplay({data, limit, Searchtext}) {
  const theme = useAppTheme();
  const [playlistData, setPlaylistData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {width} = Dimensions.get('window');
  const numColumns = 2;
  const cardGap = 12;
  const cardWidth = (width - 40 - cardGap) / numColumns; // 40 = 20px padding on each side

  const totalPages = useMemo(
    () => Math.ceil((playlistData?.data?.total ?? 1) / limit),
    [playlistData?.data?.total, limit],
  );

  const fetchMorePlaylists = useCallback(
    async (text, page) => {
      if (!hasMore || !text || page > totalPages) return;

      try {
        setLoading(true);
        const newData = await getSearchPlaylistData(text, page, limit);

        if (newData?.data?.results?.length > 0) {
          setPlaylistData(prev => ({
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
        console.log('Error fetching more playlists:', error);
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

      const freshData = await getSearchPlaylistData(Searchtext, 1, limit);
      setPlaylistData(freshData);

      if (freshData?.data?.results?.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.log('Error refreshing playlists:', error);
    } finally {
      setRefreshing(false);
    }
  }, [Searchtext, limit]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMorePlaylists(Searchtext, nextPage);
    }
  }, [loading, hasMore, currentPage, Searchtext, fetchMorePlaylists]);

  const renderPlaylistItem = useCallback(
    ({item, index}) => {
      if (item.LoadingComponent) {
        return (
          <View
            style={[
              styles.loadingContainer,
              {
                width: cardWidth,
                marginLeft: index % numColumns === 0 ? 0 : cardGap,
              },
            ]}>
            <LoadingComponent loading={true} height={100} />
          </View>
        );
      }

      return (
        <View
          style={[
            styles.playlistCardContainer,
            {
              width: cardWidth,
              marginLeft: index % numColumns === 0 ? 0 : cardGap,
            },
          ]}>
          <EachPlaylistCard
            name={item.name}
            follower={`${item.songCount} Songs`}
            image={item.image?.[2]?.link}
            id={item.id}
            MainContainerStyle={styles.playlistCard}
            ImageStyle={styles.playlistImage}
          />
        </View>
      );
    },
    [cardWidth, cardGap],
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="playlist-play"
        size={64}
        color={theme.colors.onSurfaceVariant}
        style={styles.emptyIcon}
      />
      <Text
        variant="headlineSmall"
        style={[styles.emptyTitle, {color: theme.colors.onSurface}]}>
        No Playlists Found
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptySubtitle, {color: theme.colors.onSurfaceVariant}]}>
        Try searching with different keywords
      </Text>
    </View>
  );

  const ListFooter = () => {
    if (!hasMore && playlistData?.data?.results?.length > 0) {
      return (
        <View style={styles.endContainer}>
          <Text
            style={[styles.endText, {color: theme.colors.onSurfaceVariant}]}>
            All playlists loaded
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
          Search for playlists to see results
        </Text>
      </View>
    );
  }

  if (!playlistData?.data?.results?.length && !loading) {
    return <EmptyState />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        keyExtractor={(item, index) =>
          item.LoadingComponent ? 'loading' : `playlist-${item.id}-${index}`
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.flatListContent}
        data={[
          ...(playlistData?.data?.results || []),
          ...(hasMore && playlistData?.data?.results?.length > 0
            ? [{LoadingComponent: true}]
            : []),
        ]}
        renderItem={renderPlaylistItem}
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
    // paddingHorizontal: 20,
    paddingBottom: 120,
    paddingTop: 8,
  },
  playlistCardContainer: {
    marginBottom: 12,
  },
  playlistCard: {
    width: '100%',
    height: 200,
  },
  playlistImage: {
    height: '70%',
  },
  loadingContainer: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
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
    flex: 1,
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
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  endText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
