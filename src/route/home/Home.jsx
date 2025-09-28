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
import {useTheme} from '@react-navigation/native';

export const Home = () => {
  const [Loading, setLoading] = useState(true);
  const [Data, setData] = useState({});
  const [showHeader, setShowHeader] = useState(false);
  const theme = useTheme();

  async function fetchHomePageData() {
    try {
      setLoading(true);
      const Languages = await GetLanguageValue();
      const data = await getHomePageData(Languages);
      setData(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchHomePageData();
  }, []);
  return (
    <MainWrapper>
      <LoadingComponent loading={Loading} />
      {!Loading && (
        <View>
          <ScrollView
            style={{zIndex: -1}}
            onScroll={e => {
              if (e.nativeEvent.contentOffset.y > 200 && !showHeader) {
                setShowHeader(true);
              } else if (e.nativeEvent.contentOffset.y < 200 && showHeader) {
                setShowHeader(false);
              }
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 90,
              paddingTop: 40,
              backgroundColor: theme.colors.tertiary,
            }}>
            <RouteHeading showSearch={true} showSettings={true} />
            {/*<DisplayTopSection playlist={Data.data.charts.filter((e)=>e.type === 'playlist')}/>*/}
            <DisplayTopGenres />
            <PaddingConatiner>
              <HorizontalScrollSongs id={Data.data.charts[0].id} />
              <Heading text={'Recommended'} />
            </PaddingConatiner>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 20,
                gap: 15,
              }}
              data={Data?.data?.playlists ?? []}
              renderItem={(item, i) => (
                <EachPlaylistCard
                  name={item.item.title}
                  follower={item.item.subtitle}
                  key={item.index}
                  image={item.item.image[2].link}
                  id={item.item.id}
                />
              )}
            />
            <PaddingConatiner>
              <Heading text={'Trending Albums'} />
            </PaddingConatiner>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 20,
              }}
              data={Data?.data?.trending?.albums ?? []}
              renderItem={item => (
                <EachAlbumCard
                  image={item.item.image[2].link}
                  artists={item.item.artists}
                  key={item.index}
                  name={item.item.name}
                  id={item.item.id}
                />
              )}
            />
            <PaddingConatiner>
              <HorizontalScrollSongs id={Data?.data?.charts[1]?.id} />
            </PaddingConatiner>
            <PaddingConatiner>
              <Heading text={'Top Charts'} />
            </PaddingConatiner>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 20,
              }}
              data={[1]}
              renderItem={() => <RenderTopCharts playlist={Data.data.charts} />}
            />
            <PaddingConatiner>
              <HorizontalScrollSongs id={Data?.data?.charts[3]?.id} />
            </PaddingConatiner>
            <PaddingConatiner>
              <Heading text={'Recommended Albums'} />
            </PaddingConatiner>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 20,
              }}
              data={Data?.data?.albums ?? []}
              renderItem={item => (
                <EachAlbumCard
                  image={item?.item?.image[2]?.link ?? ''}
                  artists={item.item.artists}
                  key={item.index}
                  name={item.item.name}
                  id={item.item.id}
                />
              )}
            />
            <PaddingConatiner>
              <HorizontalScrollSongs id={Data?.data?.charts[2]?.id} />
            </PaddingConatiner>
          </ScrollView>
          {/* <TopHeader showHeader={showHeader} /> */}
        </View>
      )}
    </MainWrapper>
  );
};
