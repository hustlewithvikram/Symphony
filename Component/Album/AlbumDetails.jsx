import React, {useContext, useMemo} from 'react';
import {View, Dimensions, Pressable, StyleSheet, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Heading} from '../Global/Heading';
import {SmallText} from '../Global/SmallText';
import {PlayButton} from '../Playlist/PlayButton';
import Context from '../../Context/Context';
import {AddPlaylist, getIndexQuality} from '../../MusicPlayerFunctions';
import FormatArtist from '../../Utils/FormatArtists';
import FormatTitleAndArtist from '../../Utils/FormatTitleAndArtist';

export const AlbumDetails = ({name, releaseData, liked, Data}) => {
  const {updateTrack} = useContext(Context);
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;

  // Memoize formatted songs list for performance
  const playlistData = useMemo(() => {
    if (!Data?.data?.songs) return [];
    return Data.data.songs.map(e => ({
      url: e?.downloadUrl?.[0]?.url, // fallback quality
      title: FormatTitleAndArtist(e?.name),
      artist: FormatTitleAndArtist(FormatArtist(e?.artists?.primary)),
      artwork: e?.image?.[2]?.url,
      image: e?.image?.[2]?.url,
      duration: e?.duration,
      id: e?.id,
      language: e?.language,
      artistID: e?.primary_artists_id,
    }));
  }, [Data]);

  const handleAddToPlayer = async () => {
    const quality = await getIndexQuality();
    const songsWithQuality = playlistData.map(song => ({
      ...song,
      url: song.url || '', // fallback
    }));
    await AddPlaylist(songsWithQuality);
    updateTrack();
  };

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      colors={['rgba(44,44,44,0.5)', 'rgb(23,23,23)', theme.colors.background]}
      style={styles.gradientContainer}>
      <View style={[styles.albumInfoContainer, {maxWidth: screenWidth * 0.75}]}>
        <Heading text={name} numberOfLines={2} style={styles.heading} />
        <View style={styles.metadataContainer}>
          <Ionicons name="musical-note" size={16} color={theme.colors.text} />
          <SmallText text={`Released in ${releaseData}`} />
        </View>
        {/* Optional like button can be added here */}
      </View>

      <PlayButton onPress={handleAddToPlayer} style={styles.playButton} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 6,
  },
  albumInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playButton: {
    width: 55,
    height: 55,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
    elevation: 5,
  },
});
