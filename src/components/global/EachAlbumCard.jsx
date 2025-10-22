import {ImageBackground, Pressable, View, StyleSheet} from 'react-native';
import {PlainText} from './PlainText';
import {SmallText} from './SmallText';
import {memo, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

export const EachAlbumCard = memo(function EachAlbumCard({
  image,
  name,
  artists,
  id,
  Search,
}) {
  const navigation = useNavigation();

  // Format artists names
  const artistsNames = useMemo(() => {
    if (Search) {
      return artists;
    }

    if (!artists?.length) return '';

    let names = '';
    const displayArtists = artists.slice(0, 3); // Show max 3 artists

    displayArtists.forEach((artist, index) => {
      if (index === displayArtists.length - 1) {
        names += artist.name;
      } else {
        names += artist.name + ', ';
      }
    });

    if (artists.length > 3) {
      names += ' ...';
    }

    return names;
  }, [artists, Search]);

  // Format text with ellipsis
  const formattedText = useMemo(() => {
    if (!name) return '';

    const maxLength = Search ? 22 : 30; // Adjusted for fixed width
    if (name.length >= maxLength) {
      return name.slice(0, maxLength) + '...';
    }
    return name;
  }, [name, Search]);

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Album', {id});
      }}
      style={({pressed}) => [
        styles.container,
        {
          transform: [{scale: pressed ? 0.96 : 1}],
          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      <ImageBackground
        source={{uri: image}}
        style={styles.imageBackground}
        resizeMode="cover"
        imageStyle={styles.image}>
        <View style={styles.overlay}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}>
            <PlainText
              text={formattedText}
              style={styles.albumName}
              numberOfLines={2}
            />
            <SmallText
              text={artistsNames}
              style={styles.artistNames}
              numberOfLines={1}
            />
          </LinearGradient>
        </View>
      </ImageBackground>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 160, // Fixed width
    height: 160, // Fixed height (square)
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    // Prevent external overrides
    minWidth: 160,
    maxWidth: 160,
    minHeight: 160,
    maxHeight: 160,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a', // Fallback color
  },
  image: {
    borderRadius: 12,
  },
  overlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  gradient: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingTop: 32, // More space for gradient effect
  },
  albumName: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  artistNames: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
});
