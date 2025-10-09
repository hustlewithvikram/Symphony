import React, {useRef, useState, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer, {
  useActiveTrack,
  useProgress,
  usePlaybackState,
  RepeatMode,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import FastImage from 'react-native-fast-image';
import {useAppTheme} from '../../theme';
import {useNavigationState} from '@react-navigation/native';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

const BottomSheetMusic = () => {
  const bottomSheetRef = useRef(null);
  const currentPlaying = useActiveTrack();
  const {position, duration} = useProgress();
  const playbackState = usePlaybackState();

  // Get current navigation route
  const navigationState = useNavigationState(state => state);
  const currentRoute = navigationState?.routes[navigationState.index]?.name;

  console.log('navigationState', navigationState);

  // Check if current route is Settings
  const isSettingsRoute = currentRoute === 'Settings';

  // app theme
  const theme = useAppTheme();

  // Determine if music is playing based on playback state
  const isPlaying = playbackState.state === 'playing';
  const isBuffering = playbackState.state === 'buffering';

  // Repeat state
  const [repeatMode, setRepeatMode] = useState(RepeatMode.Off);

  // Use animated index instead of direct position value
  const animatedIndex = useSharedValue(0);

  const snapPoints = [150, '100%'];

  // Animated value for progress during drag
  const dragProgress = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // Store the progress bar dimensions
  const [progressBarLayout, setProgressBarLayout] = useState({width: 0, x: 0});

  // Track repeat mode changes
  useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
    if (event.type === Event.PlaybackQueueEnded) {
      const currentRepeatMode = await TrackPlayer.getRepeatMode();
      setRepeatMode(currentRepeatMode);
    }
  });

  // Initialize repeat mode on component mount
  useEffect(() => {
    const initializeRepeatMode = async () => {
      const mode = await TrackPlayer.getRepeatMode();
      setRepeatMode(mode);
    };
    initializeRepeatMode();
  }, []);

  // Close bottom sheet when navigating to Settings
  useEffect(() => {
    if (isSettingsRoute && bottomSheetRef.current) {
      bottomSheetRef.current.collapse();
    }
  }, [isSettingsRoute]);

  async function PlaySong() {
    await TrackPlayer.play();
  }
  async function PauseSong() {
    await TrackPlayer.pause();
  }
  async function seekTo(position) {
    await TrackPlayer.seekTo(position);
  }
  async function skipToNext() {
    await TrackPlayer.skipToNext();
  }
  async function skipToPrevious() {
    await TrackPlayer.skipToPrevious();
  }
  async function toggleRepeat() {
    let newMode;
    switch (repeatMode) {
      case RepeatMode.Off:
        newMode = RepeatMode.Track;
        break;
      case RepeatMode.Track:
        newMode = RepeatMode.Queue;
        break;
      case RepeatMode.Queue:
        newMode = RepeatMode.Off;
        break;
      default:
        newMode = RepeatMode.Off;
    }
    await TrackPlayer.setRepeatMode(newMode);
    setRepeatMode(newMode);
  }

  const handleShuffle = async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      if (queue.length <= 1) return;

      const wasPlaying = isPlaying;

      // Shuffle the queue
      const shuffledQueue = [...queue].sort(() => Math.random() - 0.5);

      // Use setQueue if available in your version
      await TrackPlayer.setQueue(shuffledQueue);
      await TrackPlayer.skip(0);

      if (wasPlaying) {
        await TrackPlayer.play();
      }

      console.log('Queue shuffled!');
    } catch (error) {
      console.log('Error shuffling:', error);
    }
  };

  // Format time function
  const formatTime = seconds => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.floor(Math.max(0, seconds) % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  // Handle progress bar layout
  const handleProgressBarLayout = event => {
    const {width, x} = event.nativeEvent.layout;
    setProgressBarLayout({width, x});
  };

  // Handle touch on progress bar
  const handleProgressTouch = event => {
    const touchX = event.nativeEvent.locationX;
    const newPercentage = Math.max(
      0,
      Math.min((touchX / progressBarLayout.width) * 100, 100),
    );

    isDragging.value = true;
    dragProgress.value = newPercentage;

    if (duration > 0) {
      const newPosition = (newPercentage / 100) * duration;
      seekTo(newPosition);
    }

    // Reset dragging after a short delay
    setTimeout(() => {
      isDragging.value = false;
    }, 100);
  };

  // PanResponder for the progress bar
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: event => {
      if (!progressBarLayout.width) return;

      const touchX = event.nativeEvent.locationX;
      const newPercentage = Math.max(
        0,
        Math.min((touchX / progressBarLayout.width) * 100, 100),
      );

      isDragging.value = true;
      dragProgress.value = newPercentage;
    },

    onPanResponderMove: (event, gestureState) => {
      if (!progressBarLayout.width) return;

      const touchX = Math.max(
        0,
        Math.min(
          gestureState.moveX - progressBarLayout.x,
          progressBarLayout.width,
        ),
      );
      const newPercentage = Math.max(
        0,
        Math.min((touchX / progressBarLayout.width) * 100, 100),
      );

      dragProgress.value = newPercentage;
    },

    onPanResponderRelease: () => {
      if (duration > 0) {
        const newPosition = (dragProgress.value / 100) * duration;
        seekTo(newPosition);
      }
      isDragging.value = false;
    },

    onPanResponderTerminate: () => {
      isDragging.value = false;
    },
  });

  // Progress fill style - uses drag progress when dragging, otherwise actual progress
  const progressFillStyle = useAnimatedStyle(() => {
    const widthPercent = isDragging.value
      ? dragProgress.value
      : progressPercentage;
    return {
      width: `${widthPercent}%`,
    };
  });

  // Current time display - shows drag time when dragging
  const currentTime = isDragging.value
    ? (dragProgress.value / 100) * duration
    : position;

  // Get repeat icon based on repeat mode
  const getRepeatIcon = () => {
    switch (repeatMode) {
      case RepeatMode.Track:
        return 'repeat-one';
      case RepeatMode.Queue:
        return 'repeat';
      default:
        return 'repeat';
    }
  };

  // Get repeat icon color based on repeat mode
  const getRepeatColor = () => {
    return repeatMode !== RepeatMode.Off ? '#1DB954' : '#fff';
  };

  // Album art animation
  const albumArtStyle = useAnimatedStyle(() => {
    const size = interpolate(
      animatedIndex.value,
      [0, 1],
      [60, 300],
      Extrapolate.CLAMP,
    );

    const borderRadius = interpolate(
      animatedIndex.value,
      [0, 1],
      [10, 12],
      Extrapolate.CLAMP,
    );

    const marginTop = interpolate(
      animatedIndex.value,
      [0, 1],
      [12, 60],
      Extrapolate.CLAMP,
    );

    return {
      width: size,
      height: size,
      borderRadius,
      marginTop,
      alignSelf: animatedIndex.value > 0.5 ? 'center' : 'flex-start',
    };
  });

  // Song info container animation
  const songInfoStyle = useAnimatedStyle(() => {
    const marginLeft = interpolate(
      animatedIndex.value,
      [0, 1],
      [5, 0],
      Extrapolate.CLAMP,
    );

    const marginTop = interpolate(
      animatedIndex.value,
      [0, 1],
      [10, 40],
      Extrapolate.CLAMP,
    );

    const paddingTop = interpolate(
      animatedIndex.value,
      [0, 1],
      [10, 0],
      Extrapolate.CLAMP,
    );

    return {
      marginLeft,
      marginTop,
      paddingTop,
    };
  });

  const coverAndSongInfoStyle = useAnimatedStyle(() => {
    const flexDirection = animatedIndex.value > 0.5 ? 'column' : 'row';
    const alignItems = 'center';
    const gap = animatedIndex.value > 0.5 ? 20 : 10;

    return {
      flexDirection,
      alignItems,
      gap,
    };
  });

  // Mini player controls animation
  const miniControlsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.3],
      [1, 0],
      Extrapolate.CLAMP,
    );

    const scale = interpolate(
      animatedIndex.value,
      [0, 0.3],
      [1, 0.8],
      Extrapolate.CLAMP,
    );

    const paddingTop = interpolate(
      animatedIndex.value,
      [0, 1],
      [15, 0],
      Extrapolate.CLAMP,
    );

    return {
      opacity,
      transform: [{scale}],
      paddingTop,
    };
  });

  // Title text animation
  const titleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      animatedIndex.value,
      [0, 1],
      [14, 28],
      Extrapolate.CLAMP,
    );

    const textAlign = animatedIndex.value > 0.5 ? 'center' : 'left';

    return {
      fontSize,
      textAlign,
    };
  });

  // Artist text animation
  const artistStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      animatedIndex.value,
      [0, 1],
      [12, 18],
      Extrapolate.CLAMP,
    );

    const textAlign = animatedIndex.value > 0.5 ? 'center' : 'left';

    return {
      fontSize,
      textAlign,
    };
  });

  // Progress bar animation
  const progressStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.3],
      [0, 1],
      Extrapolate.CLAMP,
    );

    return {
      opacity,
    };
  });

  // Controls animation
  const controlsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.5],
      [0, 1],
      Extrapolate.CLAMP,
    );

    return {
      opacity,
    };
  });

  // Play button animation
  const playButtonStyle = useAnimatedStyle(() => {
    const size = interpolate(
      animatedIndex.value,
      [0, 1],
      [40, 70],
      Extrapolate.CLAMP,
    );

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
    };
  });

  // Other controls animation
  const otherControlsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.3],
      [0, 1],
      Extrapolate.CLAMP,
    );

    const scale = interpolate(
      animatedIndex.value,
      [0, 0.3],
      [0.5, 1],
      Extrapolate.CLAMP,
    );

    return {
      opacity,
      transform: [{scale}],
    };
  });

  // Bottom sheet container style - hides when in Settings
  const bottomSheetContainerStyle = useAnimatedStyle(() => {
    const display = isSettingsRoute ? 'none' : 'flex';
    const opacity = isSettingsRoute ? 0 : 1;

    return {
      display,
      opacity,
    };
  });

  const handlePlayPause = async () => {
    if (isPlaying) {
      PauseSong();
    } else {
      PlaySong();
    }
  };

  const handleNext = async () => {
    await skipToNext();
  };

  const handlePrevious = async () => {
    await skipToPrevious();
  };

  const handleRepeat = async () => {
    await toggleRepeat();
  };

  // Don't render the bottom sheet at all when in Settings route
  if (isSettingsRoute) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      animatedIndex={animatedIndex}
      handleComponent={null}
      backgroundStyle={[
        styles.background,
        {backgroundColor: theme.colors.primary},
      ]}
      enablePanDownToClose={false}
      enableOverDrag={false}>
      <View style={styles.container}>
        {/* Album Art */}
        <Animated.View style={[styles.coverAndSongInfo, coverAndSongInfoStyle]}>
          <Animated.View style={[styles.albumArt, albumArtStyle]}>
            {currentPlaying?.artwork ? (
              <FastImage
                source={{
                  uri:
                    currentPlaying?.artwork ??
                    'https://htmlcolorcodes.com/assets/images/colors/gray-color-solid-background-1920x1080.png',
                  priority: FastImage.priority.high,
                }}
                style={{width: '100%', height: '100%'}}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View
                style={{
                  backgroundColor: theme.colors.primary,
                  height: '100%',
                  width: '100%',
                }}
              />
            )}
          </Animated.View>

          <Animated.View style={[styles.songInfoContainer, songInfoStyle]}>
            <AnimatedText
              style={[styles.songTitle, {color: theme.colors.text}, titleStyle]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {currentPlaying?.title || 'No song playing'}
            </AnimatedText>
            <AnimatedText
              style={[
                styles.songArtist,
                {color: theme.colors.text},
                artistStyle,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {currentPlaying?.artist || 'Unknown artist'}
            </AnimatedText>
          </Animated.View>

          {/* Mini Player Controls */}
          <Animated.View style={[styles.miniControls, miniControlsStyle]}>
            <TouchableOpacity
              onPress={handlePlayPause}
              style={styles.miniPlayButton}>
              {isPlaying ? (
                <MaterialIcons name={'pause-circle'} size={40} color="#fff" />
              ) : (
                <MaterialIcons name={'play-circle'} size={40} color="#fff" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              style={styles.miniNextButton}>
              <MaterialIcons name={'skip-next'} size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Progress Bar */}
        <Animated.View style={[styles.progressContainer, progressStyle]}>
          <View
            style={styles.progressBackground}
            onLayout={handleProgressBarLayout}
            onTouchStart={handleProgressTouch}
            {...panResponder.panHandlers}>
            <AnimatedView
              style={[
                styles.progressFill,
                {backgroundColor: theme.colors.background},
                progressFillStyle,
              ]}
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, {color: theme.colors.text}]}>
              {formatTime(currentTime)}
            </Text>
            <Text style={[styles.timeText, {color: theme.colors.text}]}>
              {formatTime(duration)}
            </Text>
          </View>
        </Animated.View>

        {/* Controls */}
        <Animated.View style={[styles.controlsContainer, controlsStyle]}>
          <Animated.View style={[styles.otherControls, otherControlsStyle]}>
            <TouchableOpacity
              onPress={handleShuffle}
              style={styles.controlButton}>
              <MaterialIcons name={'shuffle'} size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePrevious}
              style={styles.controlButton}>
              <MaterialIcons name={'skip-previous'} size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          <AnimatedTouchableOpacity
            onPress={handlePlayPause}
            style={[styles.playButton, playButtonStyle]}>
            {isPlaying ? (
              <MaterialIcons name={'pause-circle'} size={70} color="#fff" />
            ) : (
              <MaterialIcons name={'play-circle'} size={70} color="#fff" />
            )}
          </AnimatedTouchableOpacity>

          <Animated.View style={[styles.otherControls, otherControlsStyle]}>
            <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
              <MaterialIcons name={'skip-next'} size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRepeat}
              style={styles.controlButton}>
              <MaterialIcons
                name={getRepeatIcon()}
                size={24}
                color={getRepeatColor()}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {},
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  albumArt: {
    overflow: 'hidden',
  },
  songInfoContainer: {
    minHeight: 60,
    flex: 1,
  },
  songTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#888',
    marginTop: 4,
  },
  miniControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniPlayButton: {
    padding: 8,
    borderRadius: 20,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniNextButton: {
    backgroundColor: '#333',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginVertical: 40,
    marginHorizontal: 20,
  },
  progressBackground: {
    height: 10,
    backgroundColor: '#333',
    borderRadius: 999,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#888',
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  otherControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 15,
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverAndSongInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default BottomSheetMusic;
