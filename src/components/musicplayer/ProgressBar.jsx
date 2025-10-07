import React, {useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import {useProgress} from 'react-native-track-player';
import {SetProgressSong} from '../../../MusicPlayerFunctions';
import {SmallText} from '../global/SmallText';

export const ProgressBar = () => {
  const {position, duration} = useProgress();
  const width = Dimensions.get('window').width * 0.9;

  // Local seeking state so UI follows finger while dragging
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  const current =
    duration && duration > 0 ? (isSeeking ? seekValue : position) : 0;
  const progressPercent = duration
    ? Math.max(0, Math.min(current / duration, 1))
    : 0;

  const formatTime = val => {
    const time = Number.isFinite(val) ? Math.max(0, Math.floor(val)) : 0;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.trackWrapper, {width}]}>
        {/* Background (thick) track */}
        <View style={styles.trackBackground} />

        {/* Filled progress (thick) */}
        <View
          style={[styles.trackProgress, {width: `${progressPercent * 100}%`}]}
        />

        {/* Native slider on top, but invisible tracks so our thick track shows */}
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration || 0}
          value={isSeeking ? seekValue : position}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="#fff"
          onSlidingStart={() => {
            setIsSeeking(true);
            setSeekValue(position);
          }}
          onValueChange={val => setSeekValue(val)}
          onSlidingComplete={val => {
            SetProgressSong(val); // call your existing handler
            setIsSeeking(false);
          }}
        />
      </View>

      <View style={styles.timeContainer}>
        <SmallText text={formatTime(isSeeking ? seekValue : position)} />
        <SmallText text={formatTime(duration || 0)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 6,
  },

  // wrapper that contains everything for correct vertical alignment
  trackWrapper: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 6,
  },

  // thick background track
  trackBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 20, // <--- make this bigger if you want thicker
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  // filled progress (on top of background)
  trackProgress: {
    position: 'absolute',
    left: 0,
    height: 8, // same as background
    borderRadius: 8,
    backgroundColor: '#fff',
  },

  // native slider sits above our custom track, thumb still works
  slider: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 40, // keeps thumb centered vertically
  },

  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 4,
  },
});
