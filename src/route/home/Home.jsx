import {MainWrapper} from '../../layout/MainWrapper';
import {FlatList, ScrollView, View} from 'react-native';
import {Heading} from '../../components/global/Heading';
import {HorizontalScrollSongs} from '../../components/global/HorizontalScrollSongs';
import {RouteHeading} from '../../components/home/RouteHeading';
import {PaddingConatiner} from '../../layout/PaddingConatiner';
import {EachAlbumCard} from '../../components/global/EachAlbumCard';
import {RenderTopCharts} from '../../components/home/RenderTopCharts';
import {LoadingComponent} from '../../components/global/Loading';
import {useEffect, useState} from 'react';
import {getHomePageData} from '../../api/homepage';
import {EachPlaylistCard} from '../../components/global/EachPlaylistCard';
import {GetLanguageValue} from '../../localstorage/Languages';
import {DisplayTopGenres} from '../../components/home/DisplayTopGenres';
import {useAppTheme} from '../../theme';

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [showHeader, setShowHeader] = useState(false);
  const theme = useAppTheme();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const languages = await GetLanguageValue();
        const response = await getHomePageData(languages);
        setData(response);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <LoadingComponent loading={loading} />;
  }

  const renderHorizontalAlbums = albums => (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingLeft: 20, gap: 12}}
      data={albums ?? []}
      renderItem={({item}) => (
        <EachAlbumCard
          key={item.id}
          id={item.id}
          name={item.name}
          image={item.image[2]?.link ?? ''}
          artists={item.artists}
        />
      )}
    />
  );

  const renderHorizontalPlaylists = playlists => (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingLeft: 20, gap: 12}}
      data={playlists ?? []}
      renderItem={({item}) => (
        <EachPlaylistCard
          key={item.id}
          id={item.id}
          name={item.title}
          follower={item.subtitle}
          image={item.image[2]?.link}
        />
      )}
    />
  );

  return (
    <MainWrapper>
      <View style={{flex: 1}}>
        <ScrollView
          style={{zIndex: -1}}
          showsVerticalScrollIndicator={false}
          onScroll={e => {
            const yOffset = e.nativeEvent.contentOffset.y;
            if (yOffset > 200 && !showHeader) {
              setShowHeader(true);
            } else if (yOffset < 200 && showHeader) {
              setShowHeader(false);
            }
          }}
          contentContainerStyle={{
            paddingBottom: 90,
            paddingTop: 40,
            backgroundColor: theme.colors.tertiary,
          }}>
          <RouteHeading showSearch showSettings />
          <DisplayTopGenres />

          <PaddingConatiner>
            <HorizontalScrollSongs id={data.data.charts[0]?.id} />
            <Heading text="Recommended" />
          </PaddingConatiner>

          {renderHorizontalPlaylists(data.data.playlists)}
          <PaddingConatiner>
            <Heading text="Trending Albums" />
          </PaddingConatiner>
          {renderHorizontalAlbums(data.data.trending?.albums)}

          <PaddingConatiner>
            <HorizontalScrollSongs id={data.data.charts[1]?.id} />
            <Heading text="Top Charts" />
          </PaddingConatiner>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingLeft: 20}}
            data={[1]}
            renderItem={() => <RenderTopCharts playlist={data.data.charts} />}
          />

          <PaddingConatiner>
            <HorizontalScrollSongs id={data.data.charts[3]?.id} />
            <Heading text="Recommended Albums" />
          </PaddingConatiner>
          {renderHorizontalAlbums(data.data.albums)}

          <PaddingConatiner>
            <HorizontalScrollSongs id={data.data.charts[2]?.id} />
          </PaddingConatiner>
        </ScrollView>
      </View>
    </MainWrapper>
  );
};
