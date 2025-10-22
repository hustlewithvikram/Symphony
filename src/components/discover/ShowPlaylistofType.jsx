/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState, useCallback} from 'react';
import {
  Dimensions,
  FlatList,
  View,
  StatusBar,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {LoadingComponent} from '../global/Loading';
import {EachPlaylistCard} from '../global/EachPlaylistCard';
import {getSearchPlaylistData} from '../../api/playlist';
import {Heading} from '../global/Heading';
import {PaddingConatiner} from '../../layout/PaddingConatiner';
import {Spacer} from '../global/Spacer';
import {Text, Appbar, ActivityIndicator, Chip} from 'react-native-paper';
import {useAppTheme} from '../../theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ShowPlaylistofType({route, navigation}) {
  const theme = useAppTheme();
  const {Searchtext} = route.params;
  const limit = 30;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchData = useCallback(
    async (showLoader = true) => {
      if (!Searchtext) return;

      try {
        if (showLoader) setLoading(true);
        setError(null);
        const fetchdata = await getSearchPlaylistData(Searchtext, 1, limit);
        setData(fetchdata);
      } catch (e) {
        console.log('Error fetching playlists:', e);
        setError('Failed to load playlists. Please try again.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [Searchtext],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSearchData(false);
  }, [fetchSearchData]);

  useEffect(() => {
    fetchSearchData();
  }, [fetchSearchData]);

  const width = Dimensions.get('window').width;
  const statusBarHeight = StatusBar.currentHeight || 0;
  const numColumns = 2;
  const cardWidth = (width - 40) / numColumns; // 40 = 20px padding on each side + 10px gap

  const PlaylistCount = () => (
    <View style={styles.countContainer}>
      <Chip
        mode="outlined"
        style={[
          styles.countChip,
          {borderColor: theme.colors.primary, marginBottom: 10},
        ]}
        textStyle={{color: theme.colors.primary}}>
        {data?.data?.results?.length || 0} Playlists
      </Chip>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="playlist-play"
        size={80}
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
        We couldn't find any playlists for "{Searchtext}"
      </Text>
      <Spacer size={20} />
      <Chip
        mode="outlined"
        onPress={onRefresh}
        style={[styles.retryChip, {borderColor: theme.colors.primary}]}
        textStyle={{color: theme.colors.primary}}>
        Try Again
      </Chip>
    </View>
  );

  const ErrorState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="error-outline"
        size={80}
        color={theme.colors.error}
        style={styles.emptyIcon}
      />
      <Text
        variant="headlineSmall"
        style={[styles.emptyTitle, {color: theme.colors.onSurface}]}>
        Oops! Something went wrong
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptySubtitle, {color: theme.colors.onSurfaceVariant}]}>
        {error}
      </Text>
      <Spacer size={20} />
      <Chip
        mode="outlined"
        onPress={onRefresh}
        style={[styles.retryChip, {borderColor: theme.colors.primary}]}
        textStyle={{color: theme.colors.primary}}>
        Retry
      </Chip>
    </View>
  );

  const renderPlaylistCard = useCallback(
    ({item, index}) => (
      <EachPlaylistCard
        name={item.name}
        follower={`${item.songCount} Songs`}
        key={item.id}
        image={item.image?.[2]?.link}
        id={item.id}
        MainContainerStyle={[
          styles.playlistCard,
          {
            width: cardWidth,
            marginLeft: index % numColumns === 0 ? 0 : 10,
          },
        ]}
        ImageStyle={styles.playlistImage}
      />
    ),
    [cardWidth],
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />

      {/* Header */}
      <Appbar.Header
        style={[styles.appbar, {backgroundColor: theme.colors.primary}]}>
        <Appbar.BackAction
          color={theme.colors.onPrimary}
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title={
            <Text
              variant="titleMedium"
              style={[styles.appbarTitle, {color: theme.colors.onPrimary}]}
              numberOfLines={1}>
              {Searchtext}
            </Text>
          }
        />
      </Appbar.Header>

      <PaddingConatiner>
        <View style={styles.headerContainer}>
          <Heading text={`Playlists for "${Searchtext}"`} />
          <Spacer size={10} />
          {!loading && data?.data?.results?.length > 0 && <PlaylistCount />}
        </View>
      </PaddingConatiner>

      {/* Loading State */}
      {loading && <LoadingComponent loading={true} />}

      {/* Content */}
      {!loading && (
        <>
          {error ? (
            <ErrorState />
          ) : data?.data?.results?.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={numColumns}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.flatListContent}
              data={data.data.results}
              renderItem={renderPlaylistCard}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[theme.colors.primary]}
                  tintColor={theme.colors.primary}
                />
              }
              ListFooterComponent={<View style={styles.footer} />}
            />
          ) : (
            <EmptyState />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  appbarTitle: {
    fontWeight: '600',
  },
  headerContainer: {
    paddingTop: 16,
  },
  countContainer: {
    alignItems: 'flex-start',
  },
  countChip: {
    backgroundColor: 'transparent',
  },
  flatListContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
    paddingTop: 10,
  },
  playlistCard: {
    marginBottom: 15,
  },
  playlistImage: {
    height: 140,
    borderRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
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
  },
  retryChip: {
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  footer: {
    height: 20,
  },
});
