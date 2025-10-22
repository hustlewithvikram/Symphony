import {Pressable, View, StyleSheet} from 'react-native';
import {PlainText} from './PlainText';
import {SmallText} from './SmallText';
import {SpaceBetween} from '../../layout/SpaceBetween';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image';
import {memo} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';

export const EachPlaylistCard = memo(function EachPlaylistCard({
  image,
  name,
  follower,
  id,
  MainContainerStyle,
  ImageStyle,
}) {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Playlist', {id, image, name, follower});
      }}
      style={({pressed}) => [
        styles.container,
        {
          backgroundColor: theme.colors.card,
          transform: [{scale: pressed ? 0.98 : 1}],
        },
        MainContainerStyle,
      ]}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <FastImage source={{uri: image}} style={[styles.image, ImageStyle]} />
        {/* Play Button Overlay */}
        <View style={styles.playButtonOverlay}>
          <View
            style={[
              styles.playButton,
              {backgroundColor: theme.colors.primary},
            ]}>
            <FontAwesome5
              name="play"
              size={14}
              color={theme.colors.background}
            />
          </View>
        </View>
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <View style={styles.textContent}>
          <PlainText text={name} style={styles.title} numberOfLines={2} />
          <SmallText
            text={follower}
            style={[styles.subtitle, {color: theme.colors.text + '80'}]}
            numberOfLines={1}
          />
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 180,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    height: 180,
    width: '100%',
    borderRadius: 12,
  },
  playButtonOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  textContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    height: 72,
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
  },
});
