import {MainWrapper} from '../../layout/MainWrapper';
import {EachLibraryCard} from '../../components/library/EachLibraryCard';
import {Dimensions, ScrollView, View} from 'react-native';
import {RouteHeading} from '../../components/home/RouteHeading';

export const Library = () => {
  const width = Dimensions.get('window').width;
  return (
    <MainWrapper>
      <RouteHeading bottomText={'Your Library'} />
      <ScrollView>
        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            width: width,
            justifyContent: 'space-evenly',
          }}>
          <EachLibraryCard
            text={'Liked Songs'}
            image={require('../../images/LikedSong.png')}
            navigate={'LikedSongs'}
          />
          <EachLibraryCard
            text={'Liked Playlists'}
            image={require('../../images/LikedPlaylist.png')}
            navigate={'LikedPlaylists'}
          />
          <EachLibraryCard
            text={'About Project'}
            image={require('../../images/AboutProject.png')}
            navigate={'AboutProject'}
          />
          <View style={{width: width * 0.45}} />
        </View>
      </ScrollView>
    </MainWrapper>
  );
};
