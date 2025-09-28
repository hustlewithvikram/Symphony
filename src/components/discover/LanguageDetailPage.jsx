import {useEffect, useState} from 'react';
import {getHomePageData} from '../../api/homepage';
import {MainWrapper} from '../../layout/MainWrapper';
import {LoadingComponent} from '../global/Loading';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {FlatList, ScrollView} from 'react-native';
import {PaddingConatiner} from '../../layout/PaddingConatiner';
import {Heading} from '../global/Heading';
import {EachPlaylistCard} from '../global/EachPlaylistCard';
import {HorizontalScrollSongs} from '../global/HorizontalScrollSongs';
import {EachAlbumCard} from '../global/EachAlbumCard';
import {RenderTopCharts} from '../home/RenderTopCharts';
import {Spacer} from '../global/Spacer';

export const LanguageDetailPage = ({route}) => {
  const [Loading, setLoading] = useState(true);
  const [Data, setData] = useState({});
  const {language} = route.params;
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  async function fetchHomePageData() {
    try {
      setLoading(true);
      const data = await getHomePageData(language);
      setData(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchHomePageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainWrapper>
      <LoadingComponent loading={Loading} />
      {!Loading && (
        <Animated.View entering={FadeInDown.delay(200)}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 90,
            }}>
            <Spacer />
            <PaddingConatiner>
              <Heading nospace={true} text={capitalizeFirstLetter(language)} />
              <Heading text={'Recommended'} />
            </PaddingConatiner>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 13,
                gap: 10,
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
              <HorizontalScrollSongs id={Data.data.charts[4].id} />
              <Heading text={'Trending Albums'} />
            </PaddingConatiner>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 13,
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
                paddingLeft: 13,
              }}
              data={[1]}
              renderItem={() => (
                <RenderTopCharts
                  playlist={Data.data.charts.filter(e => e.type === 'playlist')}
                />
              )}
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
                paddingLeft: 13,
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
        </Animated.View>
      )}
    </MainWrapper>
  );
};
