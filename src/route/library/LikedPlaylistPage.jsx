import Animated, {useAnimatedRef} from 'react-native-reanimated';
import {LikedPagesTopHeader} from '../../components/library/TopHeaderLikedPages';
import {LikedDetails} from '../../components/library/LikedDetails';
import {useEffect, useState} from 'react';
import {GetLikedPlaylist} from '../../localstorage/StoreLikedPlaylists';
import {EachPlaylistCard} from '../../components/global/EachPlaylistCard';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {PaddingConatiner} from '../../layout/PaddingConatiner';

export const LikedPlaylistPage = () => {
  const theme = useTheme();
  const AnimatedRef = useAnimatedRef();
  const [LikedPlaylist, setLikedPlaylist] = useState([]);
  async function getAllLikedSongs() {
    const Playlists = await GetLikedPlaylist();
    const Temp = [];
    for (const [key, value] of Object.entries(Playlists.playlist)) {
      Temp[value.count] = value;
    }
    setLikedPlaylist(Temp);
  }
  useEffect(() => {
    getAllLikedSongs();
  }, []);
  return (
    <Animated.ScrollView
      scrollEventThrottle={16}
      ref={AnimatedRef}
      contentContainerStyle={{
        paddingBottom: 65,
        backgroundColor: 'rgba(0,0,0)',
      }}>
      <LikedPagesTopHeader
        AnimatedRef={AnimatedRef}
        url={require('../../images/LikedPlaylist.png')}
      />
      <LikedDetails name={'Liked Playlists'} dontShowPlayButton={true} />
      <PaddingConatiner>
        <View
          style={{
            backgroundColor: theme.colors.background,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
          {LikedPlaylist.map((e, i) => {
            if (e) {
              return (
                <EachPlaylistCard
                  name={e.name}
                  image={e.image}
                  id={e.id}
                  follower={e.follower}
                  MainContainerStyle={{
                    width: '48%',
                  }}
                />
              );
            }
          })}
          <View />
        </View>
      </PaddingConatiner>
    </Animated.ScrollView>
  );
};
