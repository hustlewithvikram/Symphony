import React, {useRef, useState, useEffect, useCallback, useMemo} from 'react';
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
  runOnJS,
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer, {
  useActiveTrack,
  useProgress,
  usePlaybackState,
  RepeatMode,
  useTrackPlayerEvents,
  Event,
  State,
} from 'react-native-track-player';
import FastImage from 'react-native-fast-image';
import {useAppTheme} from '../../theme';
import {useNavigationState} from '@react-navigation/native';
import QueueBottomSheet from './QueueBottomSheet';
import {ActivityIndicator} from 'react-native-paper';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

// Memoized components for better performance
const Icon = React.memo(({name, size, color}) => (
  <MaterialIcons name={name} size={size} color={color} />
));

const AlbumArt = React.memo(({artwork, theme, style}) => {
  return (
    <Animated.View style={style}>
      {artwork ? (
        <FastImage
          source={{
            uri: artwork,
            priority: FastImage.priority.normal,
          }}
          style={styles.albumArtImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <View
          style={[
            styles.albumArtPlaceholder,
            {backgroundColor: theme.colors.surface},
          ]}
        />
      )}
    </Animated.View>
  );
});

const ProgressBar = React.memo(
  ({duration, position, theme, onSeek, progressStyle}) => {
    const [progressBarLayout, setProgressBarLayout] = useState({
      width: 0,
      x: 0,
    });
    const isDragging = useSharedValue(false);
    const dragProgress = useSharedValue(0);

    // Throttled progress update
    const progressPercentage = useSharedValue(0);

    useEffect(() => {
      if (duration > 0) {
        progressPercentage.value = (position / duration) * 100;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position, duration]);

    const handleProgressBarLayout = useCallback(event => {
      const {width, x} = event.nativeEvent.layout;
      setProgressBarLayout({width, x});
    }, []);

    const panResponder = useRef(
      PanResponder.create({
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
            runOnJS(onSeek)(newPosition);
          }
          isDragging.value = false;
        },
        onPanResponderTerminate: () => {
          isDragging.value = false;
        },
      }),
    ).current;

    const progressFillStyle = useAnimatedStyle(() => {
      const progress = isDragging.value
        ? dragProgress.value
        : progressPercentage.value;
      return {
        width: `${progress}%`,
      };
    });

    const formatTime = useCallback(seconds => {
      if (!isFinite(seconds)) return '0:00';
      const mins = Math.floor(Math.max(0, seconds) / 60);
      const secs = Math.floor(Math.max(0, seconds) % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, []);

    const currentTime = isDragging.value
      ? (dragProgress.value / 100) * duration
      : position;

    return (
      <Animated.View style={[styles.progressContainer, progressStyle]}>
        <View
          style={styles.progressBackground}
          onLayout={handleProgressBarLayout}
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
    );
  },
);

const Controls = React.memo(
  ({
    isPlaying,
    isBuffering,
    repeatMode,
    theme,
    onPlayPause,
    onNext,
    onPrevious,
    onRepeat,
    onShuffle,
    controlsStyle,
    playButtonStyle,
    otherControlsStyle,
  }) => {
    const getRepeatIcon = useCallback(() => {
      switch (repeatMode) {
        case RepeatMode.Track:
          return 'repeat-one';
        case RepeatMode.Queue:
          return 'repeat';
        default:
          return 'repeat';
      }
    }, [repeatMode]);

    const getRepeatColor = useCallback(() => {
      return repeatMode !== RepeatMode.Off ? '#000000FF' : '#fff';
    }, [repeatMode]);

    // Memoized control buttons to prevent unnecessary re-renders
    const ShuffleButton = useMemo(
      () => (
        <TouchableOpacity onPress={onShuffle} style={styles.controlButton}>
          <Icon name="shuffle" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      [onShuffle],
    );

    const PreviousButton = useMemo(
      () => (
        <TouchableOpacity onPress={onPrevious} style={styles.controlButton}>
          <Icon name="skip-previous" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      [onPrevious],
    );

    const NextButton = useMemo(
      () => (
        <TouchableOpacity onPress={onNext} style={styles.controlButton}>
          <Icon name="skip-next" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      [onNext],
    );

    const RepeatButton = useMemo(
      () => (
        <TouchableOpacity onPress={onRepeat} style={styles.controlButton}>
          <Icon name={getRepeatIcon()} size={24} color={getRepeatColor()} />
        </TouchableOpacity>
      ),
      [onRepeat, getRepeatIcon, getRepeatColor],
    );

    // Memoized play/pause button content
    const PlayPauseContent = useMemo(() => {
      if (isBuffering) {
        return <ActivityIndicator size="large" color="#fff" />;
      }
      return isPlaying ? (
        <Icon name="pause-circle" size={70} color="#fff" />
      ) : (
        <Icon name="play-circle" size={70} color="#fff" />
      );
    }, [isPlaying, isBuffering]);

    return (
      <Animated.View style={[styles.controlsContainer, controlsStyle]}>
        <Animated.View style={[styles.otherControls, otherControlsStyle]}>
          {ShuffleButton}
          {PreviousButton}
        </Animated.View>

        <AnimatedTouchableOpacity
          onPress={onPlayPause}
          style={[styles.playButton, playButtonStyle]}
          disabled={isBuffering}>
          {PlayPauseContent}
        </AnimatedTouchableOpacity>

        <Animated.View style={[styles.otherControls, otherControlsStyle]}>
          {NextButton}
          {RepeatButton}
        </Animated.View>
      </Animated.View>
    );
  },
);

const BottomSheetMusic = () => {
  const bottomSheetRef = useRef(null);
  const currentPlaying = useActiveTrack();
  const {position, duration} = useProgress(200); // Throttle progress updates
  const playbackState = usePlaybackState();

  // Get current navigation route
  const navigationState = useNavigationState(state => state);
  const currentRoute = navigationState?.routes[navigationState.index]?.name;

  // Check if current route is Settings
  const isSettingsRoute = currentRoute === 'Settings';

  // app theme
  const theme = useAppTheme();

  // Determine if music is playing based on playback state
  const isPlaying = playbackState.state === State.Playing;
  const isBuffering = playbackState.state === State.Buffering;

  // Repeat state
  const [repeatMode, setRepeatMode] = useState(RepeatMode.Off);

  // Use animated index instead of direct position value
  const animatedIndex = useSharedValue(0);
  const isBottomSheetOpen = animatedIndex.value > 0;

  const snapPoints = [150, '100%'];

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

  // Track repeat mode changes
  useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
    if (event.type === Event.PlaybackQueueEnded) {
      const currentRepeatMode = await TrackPlayer.getRepeatMode();
      setRepeatMode(currentRepeatMode);
    }
  });

  // Memoized track player functions
  const playSong = useCallback(async () => {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.log('Play error:', error);
    }
  }, []);

  const pauseSong = useCallback(async () => {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.log('Pause error:', error);
    }
  }, []);

  const seekTo = useCallback(async position => {
    try {
      await TrackPlayer.seekTo(position);
    } catch (error) {
      console.log('Seek error:', error);
    }
  }, []);

  const skipToNext = useCallback(async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.log('Skip next error:', error);
    }
  }, []);

  const skipToPrevious = useCallback(async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.log('Skip previous error:', error);
    }
  }, []);

  const toggleRepeat = useCallback(async () => {
    try {
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
    } catch (error) {
      console.log('Repeat toggle error:', error);
    }
  }, [repeatMode]);

  const handleShuffle = useCallback(async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      if (queue.length <= 1) return;

      const wasPlaying = isPlaying;

      // Shuffle the queue
      const shuffledQueue = [...queue].sort(() => Math.random() - 0.5);

      await TrackPlayer.reset();
      await TrackPlayer.add(shuffledQueue);

      if (wasPlaying) {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.log('Shuffle error:', error);
    }
  }, [isPlaying]);

  const handlePlayPause = useCallback(async () => {
    if (isPlaying) {
      await pauseSong();
    } else {
      await playSong();
    }
  }, [isPlaying, pauseSong, playSong]);

  const handleNext = useCallback(async () => {
    await skipToNext();
  }, [skipToNext]);

  const handlePrevious = useCallback(async () => {
    await skipToPrevious();
  }, [skipToPrevious]);

  const handleRepeat = useCallback(async () => {
    await toggleRepeat();
  }, [toggleRepeat]);

  const handleSheetTouch = useCallback(() => {
    if (!isBottomSheetOpen && bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  }, [isBottomSheetOpen]);

  // Keep your existing animated styles (they are already optimized)
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

    return {marginLeft, marginTop, paddingTop};
  });

  const coverAndSongInfoStyle = useAnimatedStyle(() => {
    const flexDirection = animatedIndex.value > 0.5 ? 'column' : 'row';
    return {flexDirection, alignItems: 'center', gap: 10};
  });

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

    return {opacity, transform: [{scale}], paddingTop};
  });

  const titleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      animatedIndex.value,
      [0, 1],
      [14, 28],
      Extrapolate.CLAMP,
    );
    const textAlign = animatedIndex.value > 0.5 ? 'center' : 'left';
    return {fontSize, textAlign};
  });

  const artistStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      animatedIndex.value,
      [0, 1],
      [12, 18],
      Extrapolate.CLAMP,
    );
    const textAlign = animatedIndex.value > 0.5 ? 'center' : 'left';
    return {fontSize, textAlign};
  });

  const progressStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.3],
      [0, 1],
      Extrapolate.CLAMP,
    );
    return {opacity};
  });

  const controlsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.5],
      [0, 1],
      Extrapolate.CLAMP,
    );
    return {opacity};
  });

  const playButtonStyle = useAnimatedStyle(() => {
    const size = interpolate(
      animatedIndex.value,
      [0, 1],
      [40, 70],
      Extrapolate.CLAMP,
    );
    return {width: size, height: size, borderRadius: size / 2};
  });

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
    return {opacity, transform: [{scale}]};
  });

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
      containerStyle={styles.bottomSheetContainer}
      enablePanDownToClose={false}
      enableOverDrag={false}>
      <TouchableOpacity
        style={styles.container}
        onPress={handleSheetTouch}
        activeOpacity={1}>
        {/* Album Art and Song Info */}
        <Animated.View style={[styles.coverAndSongInfo, coverAndSongInfoStyle]}>
          <AlbumArt
            artwork={currentPlaying?.artwork}
            theme={theme}
            style={[styles.albumArt, albumArtStyle]}
          />

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
                <Icon name="pause-circle" size={40} color="#fff" />
              ) : (
                <Icon name="play-circle" size={40} color="#fff" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              style={styles.miniNextButton}>
              <Icon name="skip-next" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Progress Bar */}
        <ProgressBar
          duration={duration}
          position={position}
          theme={theme}
          onSeek={seekTo}
          progressStyle={progressStyle}
        />

        {/* Controls */}
        <Controls
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          repeatMode={repeatMode}
          theme={theme}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onRepeat={handleRepeat}
          onShuffle={handleShuffle}
          controlsStyle={controlsStyle}
          playButtonStyle={playButtonStyle}
          otherControlsStyle={otherControlsStyle}
        />

        <QueueBottomSheet />
      </TouchableOpacity>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {},
  bottomSheetContainer: {
    marginBottom: -60,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  albumArt: {
    overflow: 'hidden',
  },
  albumArtImage: {
    width: '100%',
    height: '100%',
  },
  albumArtPlaceholder: {
    width: '100%',
    height: '100%',
  },
  songInfoContainer: {
    minHeight: 60,
    flex: 1,
  },
  songTitle: {
    fontWeight: 'bold',
  },
  songArtist: {
    marginTop: 4,
    opacity: 0.8,
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
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    opacity: 0.7,
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

export default React.memo(BottomSheetMusic);
