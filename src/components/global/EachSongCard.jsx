import {Dimensions, Pressable, View} from 'react-native';
import {PlainText} from './PlainText';
import {SmallText} from './SmallText';
import FastImage from 'react-native-fast-image';
import {
  AddPlaylist,
  getIndexQuality,
  PlayOneSong,
} from '../../../MusicPlayerFunctions';
import {memo, useContext, useCallback} from 'react';
import Context from '../../context/Context';
import {useActiveTrack, usePlaybackState} from 'react-native-track-player';
import FormatTitleAndArtist from '../../utils/FormatTitleAndArtist';
import FormatArtist from '../../utils/FormatArtists';
import {EachSongMenuButton} from '../musicplayer/EachSongMenuButton';
import {useAppTheme} from '../../theme';

export const EachSongCard = memo(function EachSongCard({
  title,
  artist,
  image,
  id,
  url,
  duration,
  language,
  artistID,
  isLibraryLiked,
  width,
  titleandartistwidth,
  isFromPlaylist,
  Data,
  index,
}) {
  const screenWidth = Dimensions.get('window').width;
  const {updateTrack, setVisible} = useContext(Context);
  const currentPlaying = useActiveTrack();
  const playerState = usePlaybackState();
  const theme = useAppTheme();

  const AddSongToPlayer = useCallback(async () => {
    if (isFromPlaylist) {
      const ForMusicPlayer = [];
      const quality = await getIndexQuality();
      Data?.data?.songs?.forEach((e, i) => {
        if (i >= index) {
          ForMusicPlayer.push({
            url: e?.downloadUrl[quality].url,
            title: FormatTitleAndArtist(e?.name),
            artist: FormatTitleAndArtist(FormatArtist(e?.artists?.primary)),
            artwork: e?.image[2]?.url,
            image: e?.image[2]?.url,
            duration: e?.duration,
            id: e?.id,
            language: e?.language,
            downloadUrl: e?.downloadUrl,
          });
        }
      });
      await AddPlaylist(ForMusicPlayer);
    } else if (isLibraryLiked) {
      const Final = [];
      Data?.map((e, i) => {
        if (i >= index) {
          Final.push({
            url: e.url,
            title: e?.title,
            artist: e?.artist,
            artwork: e?.artwork,
            duration: e?.duration,
            id: e?.id,
            language: e?.language,
            artistID: e?.primary_artists_id,
            downloadUrl: e?.downloadUrl,
          });
        }
      });
      await AddPlaylist(Final);
    } else {
      const quality = await getIndexQuality();
      const song = {
        url: url[quality].url,
        title: FormatTitleAndArtist(title),
        artist: FormatTitleAndArtist(artist),
        artwork: image,
        duration,
        id,
        language,
        artistID,
        image,
        downloadUrl: url,
      };
      PlayOneSong(song);
    }
    updateTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    Data,
    index,
    isFromPlaylist,
    isLibraryLiked,
    title,
    artist,
    image,
    id,
    url,
    language,
    artistID,
    updateTrack,
  ]);

  const isPlaying =
    currentPlaying?.id === id && playerState.state === 'playing';
  const isPaused = currentPlaying?.id === id && playerState.state !== 'playing';

  return (
    <View
      style={{
        flexDirection: 'row',
        width: width + 30 || screenWidth,
        alignItems: 'center',
        marginBottom: 6,
      }}>
      <Pressable
        onPress={AddSongToPlayer}
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          flex: 1,
          paddingVertical: 6,
        }}>
        <FastImage
          source={
            isPlaying
              ? require('../../images/playing.gif')
              : isPaused
              ? require('../../images/songPaused.gif')
              : {uri: image}
          }
          style={{
            height: 50,
            width: 50,
            borderRadius: 10,
          }}
        />
        <View style={{flex: 1}}>
          <PlainText
            text={FormatTitleAndArtist(title)}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              width: titleandartistwidth || screenWidth * 0.65,
            }}
          />
          <SmallText
            text={FormatTitleAndArtist(artist)}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              width: titleandartistwidth || screenWidth * 0.65,
              color: theme.colors.text,
            }}
          />
        </View>
      </Pressable>
      <EachSongMenuButton
        Onpress={() =>
          setVisible({
            visible: true,
            title,
            artist,
            image,
            id,
            url,
            duration,
            language,
          })
        }
      />
    </View>
  );
});
