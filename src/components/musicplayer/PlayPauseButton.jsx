/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useTheme} from '@react-navigation/native';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import {PauseSong, PlaySong} from '../../../MusicPlayerFunctions';
import {usePlaybackState} from 'react-native-track-player';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export const PlayPauseButton = ({isFullScreen}) => {
  const theme = useTheme();
  const playerState = usePlaybackState();

  const isPlaying = playerState.state === 'playing';
  const isBuffering = playerState.state === 'buffering';

  // Animation values
  const scale = useSharedValue(1);
  const borderRadius = useSharedValue(isPlaying ? 30 : 10); // 30 = circle, 10 = rounded square

  // Sync borderRadius with play/pause state
  React.useEffect(() => {
    borderRadius.value = withSpring(isPlaying ? 30 : 10, {
      damping: 12,
      stiffness: 120,
    });
  }, [isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    borderRadius: borderRadius.value,
  }));

  const handlePress = () => {
    // Slight bounce
    scale.value = withSpring(1.1, {damping: 8, stiffness: 100}, () => {
      scale.value = withSpring(1, {damping: 8, stiffness: 100});
    });

    // Toggle play/pause
    if (isPlaying) PauseSong();
    else PlaySong();
  };

  if (isBuffering) {
    return (
      <ActivityIndicator
        size={'large'}
        style={{height: 60, width: 60}}
        color={isFullScreen ? 'white' : theme.colors.text}
      />
    );
  }

  return (
    <Animated.View style={isFullScreen ? animatedStyle : {}}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.button,
          isPlaying ? styles.playButton : styles.pauseButton,
        ]}>
        <FontAwesome6
          name={isPlaying ? 'pause' : 'play'}
          size={20}
          color={theme.colors.primary}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    height: 60,
    width: 60,
    backgroundColor: 'white',
    borderRadius: 9999,
  },
  pauseButton: {
    height: 60,
    width: 60,
    backgroundColor: 'white',
    borderRadius: 15,
  },
});
