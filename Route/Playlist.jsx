/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext} from 'react';
import {Dimensions, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {MainWrapper} from '../Layout/MainWrapper';
import {EachSongCard} from '../Component/Global/EachSongCard';
import {LoadingComponent} from '../Component/Global/Loading';
import {PlainText} from '../Component/Global/PlainText';
import {SmallText} from '../Component/Global/SmallText';
import {getPlaylistData} from '../Api/Playlist';
import {useTheme} from '@react-navigation/native';
import FormatArtist from '../Utils/FormatArtists';

const {width} = Dimensions.get('window');
const HEADER_HEIGHT = 250;

export const Playlist = ({route}) => {
  const theme = useTheme();
  const {id, image, name, follower} = route.params;

  const [Loading, setLoading] = useState(true);
  const [Data, setData] = useState({});
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  async function fetchPlaylistData() {
    try {
      setLoading(true);
      const data = await getPlaylistData(id);
      setData(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  const headerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [1.05, 1, 0.95],
      Extrapolate.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -50],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{scale}, {translateY}],
    };
  });

  return (
    <MainWrapper>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingBottom: 80,
          paddingTop: 60,
          margin: 10,
          backgroundColor: theme.colors.background,
        }}>
        {/* Header */}
        <Animated.View
          style={{
            width,
            height: HEADER_HEIGHT,
            overflow: 'hidden',
            ...headerStyle,
          }}>
          <View style={{flex: 1}}>
            <Animated.Image
              source={{uri: image}}
              style={{width: '100%', height: '100%'}}
              resizeMode="cover"
            />
          </View>
        </Animated.View>

        {/* Playlist Info */}
        <View style={{padding: 10}}>
          <PlainText text={name} />
          <SmallText text={`Followers: ${follower ?? 0}`} />
          <SmallText
            text={`Released: ${Data?.data?.releaseDate ?? 'Unknown'}`}
          />
        </View>

        {/* Loading */}
        {Loading && <LoadingComponent loading={Loading} height={200} />}

        {/* Song List */}
        {!Loading && Data?.data?.songs?.length > 0 && (
          <View style={{paddingHorizontal: 10, gap: 10}}>
            {Data.data.songs.map((song, index) => (
              <EachSongCard
                key={index}
                Data={Data}
                isFromPlaylist={true}
                index={index}
                artist={FormatArtist(song.artists?.primary)}
                language={song.language}
                playlist
                artistID={song.primary_artists_id}
                duration={song.duration}
                image={song.image[2]?.url}
                id={song.id}
                width="100%"
                title={song.name}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {!Loading && (!Data?.data?.songs || Data.data.songs.length === 0) && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              height: 200,
            }}>
            <PlainText text="Playlist not available" />
            <SmallText text="No songs found" />
          </View>
        )}
      </Animated.ScrollView>
    </MainWrapper>
  );
};
