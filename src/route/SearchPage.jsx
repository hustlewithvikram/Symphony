/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {View, StyleSheet, StatusBar, ScrollView, Platform} from 'react-native';
import {MainWrapper} from '../layout/MainWrapper';
import {SearchBar} from '../components/global/SearchBar';
import Tabs from '../components/global/tabs/Tabs';
import {getSearchSongData} from '../api/songs';
import {getSearchPlaylistData} from '../api/playlist';
import {getSearchAlbumData} from '../api/album';
import SongDisplay from '../components/searchpage/SongDisplay';
import {LoadingComponent} from '../components/global/Loading';
import PlaylistDisplay from '../components/searchpage/PlaylistDisplay';
import AlbumsDisplay from '../components/searchpage/AlbumDisplay';
import {Spacer} from '../components/global/Spacer';
import {useAppTheme} from '../theme';
import {Text, Chip} from 'react-native-paper';

const SEARCH_DEBOUNCE_DELAY = 400;
const PAGE_LIMIT = 20;

export const SearchPage = ({navigation}) => {
  const theme = useAppTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const tabConfig = useMemo(
    () => [
      {key: 'songs', label: 'Songs', api: getSearchSongData},
      {key: 'playlists', label: 'Playlists', api: getSearchPlaylistData},
      {key: 'albums', label: 'Albums', api: getSearchAlbumData},
    ],
    [],
  );

  const fetchSearchData = useCallback(
    async text => {
      if (!text.trim()) {
        setData({});
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const apiCall = tabConfig[activeTab].api;
        const result = await apiCall(text, 1, PAGE_LIMIT);
        setData(result);
      } catch (err) {
        console.log('Search error:', err);
        setError('Failed to fetch results. Please try again.');
        setData({});
      } finally {
        setLoading(false);
      }
    },
    [activeTab, tabConfig],
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchText(searchQuery);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch data when search text changes
  useEffect(() => {
    fetchSearchData(searchText);
  }, [searchText, fetchSearchData]);

  // Fetch data when tab changes (only if there's a search text)
  useEffect(() => {
    if (searchText) {
      fetchSearchData(searchText);
    }
  }, [activeTab]);

  const handleSearchChange = useCallback(text => {
    setSearchQuery(text);
  }, []);

  const handleTabChange = useCallback(index => {
    setActiveTab(index);
  }, []);

  const renderContent = () => {
    if (!searchText) {
      return (
        <View style={styles.emptyState}>
          <Text
            variant="headlineMedium"
            style={[styles.emptyTitle, {color: theme.colors.onSurfaceVariant}]}>
            Search for Music
          </Text>
          <Text
            variant="bodyLarge"
            style={[
              styles.emptySubtitle,
              {color: theme.colors.onSurfaceVariant},
            ]}>
            Find songs, playlists, and albums
          </Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <LoadingComponent loading={true} />
          <Spacer size={16} />
          <Text
            variant="bodyMedium"
            style={[
              styles.loadingText,
              {color: theme.colors.onSurfaceVariant},
            ]}>
            Searching for {tabConfig[activeTab].label.toLowerCase()}...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorState}>
          <Text
            variant="headlineSmall"
            style={[styles.errorTitle, {color: theme.colors.onSurface}]}>
            Oops!
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.errorSubtitle,
              {color: theme.colors.onSurfaceVariant},
            ]}>
            {error}
          </Text>
        </View>
      );
    }

    const hasResults = data?.data?.results?.length > 0;

    if (!hasResults) {
      return (
        <View style={styles.emptyState}>
          <Text
            variant="headlineSmall"
            style={[styles.emptyTitle, {color: theme.colors.onSurface}]}>
            No {tabConfig[activeTab].label} Found
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.emptySubtitle,
              {color: theme.colors.onSurfaceVariant},
            ]}>
            Try searching with different keywords
          </Text>
        </View>
      );
    }

    const commonProps = {
      data,
      limit: PAGE_LIMIT,
      Searchtext: searchText,
    };

    switch (activeTab) {
      case 0:
        return <SongDisplay {...commonProps} />;
      case 1:
        return <PlaylistDisplay {...commonProps} />;
      case 2:
        return <AlbumsDisplay {...commonProps} />;
      default:
        return null;
    }
  };

  const renderResultCount = () => {
    if (!searchText || loading || error || !data?.data?.results?.length) {
      return null;
    }

    const resultCount = data.data.results.length;
    const tabLabel = tabConfig[activeTab].label.toLowerCase();

    return (
      <View style={styles.resultCountContainer}>
        <Chip
          mode="outlined"
          style={[styles.resultChip, {borderColor: theme.colors.primary}]}
          textStyle={[styles.resultText, {color: theme.colors.primary}]}>
          {resultCount} {tabLabel} found
        </Chip>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />

      {/* Safe Area Header */}
      <View style={styles.safeArea} />

      {/* Search Section */}
      <View style={styles.searchSection}>
        <SearchBar
          navigation={navigation}
          onChange={handleSearchChange}
          placeholder={`Search ${tabConfig[activeTab].label.toLowerCase()}...`}
        />
      </View>

      <Spacer size={20} />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Tabs
          tabs={tabConfig.map(tab => tab.label)}
          setState={handleTabChange}
          state={activeTab}
        />
      </View>

      <Spacer size={24} />

      {/* Result Count */}
      {renderResultCount()}

      <Spacer size={16} />

      {/* Content */}
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    height: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 8 : 0,
  },
  tabsContainer: {
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  errorSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  resultCountContainer: {
    paddingHorizontal: 20,
  },
  resultChip: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  resultText: {
    fontWeight: '600',
    fontSize: 13,
  },
});
