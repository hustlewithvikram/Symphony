import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import {useProgress} from 'react-native-track-player';
import {SetProgressSong} from '../../MusicPlayerFunctions';
import {SmallText} from '../Global/SmallText';

export const ProgressBar = () => {
  const {position, duration} = useProgress();
  const width = Dimensions.get('window').width * 0.9; // slightly smaller than full width

  // Format seconds into mm:ss
  const formatTime = val => {
    const time = parseFloat(val);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Slider
        style={{width, height: 40}}
        minimumValue={0}
        maximumValue={duration || 0}
        value={position >= duration ? 0 : position}
        minimumTrackTintColor="white"
        maximumTrackTintColor="rgba(44,44,44,1)"
        thumbTintColor="white"
        thumbStyle={styles.thumb}
        onSlidingComplete={SetProgressSong}
      />
      <View style={styles.timeContainer}>
        <SmallText
          text={position >= duration ? '0:00' : formatTime(position)}
        />
        <SmallText text={formatTime(duration || 0)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingHorizontal: 20,
  },
  thumb: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: 'white',
  },
});
