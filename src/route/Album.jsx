import {MainWrapper} from '../layout/MainWrapper';
import Animated, {useAnimatedRef} from 'react-native-reanimated';
import {PlaylistTopHeader} from '../components/playlist/PlaylistTopHeader';
import {View} from 'react-native';
import {EachSongCard} from '../components/global/EachSongCard';
import {useEffect, useState} from 'react';
import {LoadingComponent} from '../components/global/Loading';
import {PlainText} from '../components/global/PlainText';
import {SmallText} from '../components/global/SmallText';
import {getAlbumData} from '../api/album';
import {AlbumDetails} from '../components/album/AlbumDetails';
import FormatArtist from '../utils/FormatArtists';

export const Album = ({route}) => {
  const AnimatedRef = useAnimatedRef();
  const [Loading, setLoading] = useState(true);
  const [Data, setData] = useState({});
  const {id} = route.params;
  async function fetchAlbumData() {
    try {
      setLoading(true);
      const data = await getAlbumData(id);
      setData(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchAlbumData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <MainWrapper>
      {Loading && <LoadingComponent loading={Loading} />}
      {!Loading && (
        <>
          {Data?.data?.songs?.length > 0 && (
            <Animated.ScrollView
              scrollEventThrottle={16}
              ref={AnimatedRef}
              contentContainerStyle={{
                paddingBottom: 80,
                backgroundColor: '#101010',
              }}>
              <PlaylistTopHeader
                AnimatedRef={AnimatedRef}
                url={Data?.data?.image[2]?.url ?? ''}
              />
              <AlbumDetails
                name={Data?.data?.name ?? ''}
                liked={false}
                releaseData={Data?.data?.year ?? ''}
                Data={Data}
              />
              {
                <View
                  style={{
                    backgroundColor: '#101010',
                    padding: 20,
                    gap: 7,
                  }}>
                  {Data?.data?.songs?.map((e, i) => (
                    <EachSongCard
                      isFromPlaylist={true}
                      Data={Data}
                      index={i}
                      artist={FormatArtist(e?.artists?.primary)}
                      language={e?.language}
                      playlist={true}
                      artistID={e?.primary_artists_id}
                      key={i}
                      duration={e?.duration}
                      image={e?.image[2]?.url}
                      id={e?.id}
                      width={'100%'}
                      title={e?.name}
                      url={e?.downloadUrl}
                      style={{
                        marginBottom: 15,
                      }}
                    />
                  ))}
                </View>
              }
            </Animated.ScrollView>
          )}
        </>
      )}
      {Data?.songs?.length <= 0 && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <PlainText text={'Playlist not available'} />
          <SmallText text={'not available'} />
        </View>
      )}
    </MainWrapper>
  );
};
