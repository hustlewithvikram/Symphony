import {EachSongCard} from './EachSongCard';
import {Dimensions, ScrollView, View} from 'react-native';
import {useEffect, useState} from 'react';
import {getPlaylistData} from '../../api/playlist';
import {LoadingComponent} from './Loading';
import {Heading} from './Heading';
import FormatArtist from '../../utils/FormatArtists';
import {Spacer} from './Spacer';

export const HorizontalScrollSongs = ({id}) => {
  const width = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const fetchPlaylistData = async () => {
    try {
      setLoading(true);
      const response = await getPlaylistData(id);
      setData(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!id) return null;

  const songs = data?.data?.songs || [];

  // Split songs into chunks of 3 for vertical stacking
  const chunkedSongs = [];
  for (let i = 0; i < songs.length; i += 3) {
    chunkedSongs.push(songs.slice(i, i + 3));
  }

  return (
    <>
      <Spacer />
      <Spacer />
      <Heading text={loading ? 'Please Wait...' : data?.data?.name} nospace />
      <Spacer />
      {loading ? (
        <View style={{height: 280}}>
          <LoadingComponent loading={loading} />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{flexDirection: 'row', gap: 12}}>
            {chunkedSongs.map((column, colIndex) => (
              <View key={colIndex} style={{flexDirection: 'column', gap: 12}}>
                {column.map((song, rowIndex) => (
                  <EachSongCard
                    key={song.id || rowIndex}
                    index={colIndex * 3 + rowIndex}
                    Data={data}
                    isFromPlaylist
                    artist={FormatArtist(song?.artists?.primary)}
                    language={song?.language}
                    playlist
                    artistID={song?.primary_artists_id}
                    duration={song?.duration}
                    image={song?.image[2]?.url}
                    id={song?.id}
                    width={width * 0.8}
                    title={song?.name}
                    url={song?.downloadUrl}
                    titleandartistwidth={width * 0.5}
                  />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </>
  );
};
