/* eslint-disable react-hooks/exhaustive-deps */
import {Dimensions, ImageBackground, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Heading} from '../global/Heading';
import {SmallText} from '../global/SmallText';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {PlayPauseButton} from './PlayPauseButton';
import {Spacer} from '../global/Spacer';
import {NextSongButton} from './NextSongButton';
import {PreviousSongButton} from './PreviousSongButton';
import {RepeatSongButton} from './RepeatSongButton';
import {LikeSongButton} from './LikeSongButton';
import {ProgressBar} from './ProgressBar';
import {GetLyricsButton} from './GetLyricsButton';
import {getLyricsSongData} from '../../api/songs';
import {ShowLyrics} from './ShowLyrics';
import {useActiveTrack} from 'react-native-track-player';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {PlayNextSong, PlayPreviousSong} from '../../../MusicPlayerFunctions';

export const FullScreenMusic = ({color, Index, setIndex, openQueue}) => {
  const pan = Gesture.Pan();
  const width = Dimensions.get('window').width;
  const currentPlaying = useActiveTrack();
  const [showDialog, setShowDialog] = useState(false);
  const [lyrics, setLyrics] = useState({});
  const [loading, setLoading] = useState(false);

  pan.onFinalize(e => {
    if (e.translationX > 100) PlayPreviousSong();
    else if (e.translationX < -100) PlayNextSong();
    else setIndex(0); // Collapse bottom sheet
  });

  async function getLyrics() {
    setShowDialog(true);
    try {
      setLoading(true);
      const Lyrics = await getLyricsSongData(currentPlaying.id);
      if (Lyrics.success) setLyrics(Lyrics.data);
      else setLyrics({lyrics: 'No Lyrics Found \nOpps... O_o'});
    } catch (e) {
      setLyrics({lyrics: 'No Lyrics Found \nOpps... O_o'});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(200)}
      style={{flex: 1, backgroundColor: 'rgb(0,0,0)'}}>
      <ShowLyrics
        Loading={loading}
        Lyric={lyrics}
        setShowDailog={setShowDialog}
        ShowDailog={showDialog}
      />

      <ImageBackground
        blurRadius={20}
        source={{
          uri:
            currentPlaying?.artwork ??
            'https://htmlcolorcodes.com/assets/images/colors/gray-color-solid-background-1920x1080.png',
        }}
        style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.44)'}}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={[
              'rgba(4,4,4,0.23)',
              'rgba(9,9,9,0.47)',
              'rgba(0,0,0,0.65)',
              'rgba(0,0,0,0.89)',
              'rgba(0,0,0,0.9)',
              'rgba(0,0,0,1)',
            ]}
            style={{flex: 1, alignItems: 'center'}}>
            <View
              style={{
                width: '90%',
                marginTop: 40,
                marginLeft: 10,
                height: 60,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}>
              <GetLyricsButton onPress={getLyrics} />
            </View>

            <Spacer height={20} />

            <GestureDetector gesture={pan}>
              <FastImage
                source={{
                  uri:
                    currentPlaying?.artwork ??
                    'https://htmlcolorcodes.com/assets/images/colors/gray-color-solid-background-1920x1080.png',
                }}
                style={{
                  height: width * 0.8,
                  width: width * 0.8,
                  borderRadius: 9999,
                }}
              />
            </GestureDetector>

            <Spacer height={30} />

            <Heading
              text={currentPlaying?.title ?? 'No music :('}
              style={{textAlign: 'center', paddingHorizontal: 40}}
              nospace={true}
            />
            <Spacer />
            <SmallText
              text={currentPlaying?.artist ?? 'Explore now!'}
              style={{textAlign: 'center', fontSize: 16, paddingHorizontal: 10}}
            />

            <Spacer />
            <ProgressBar />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingHorizontal: 20,
                width: '100%',
              }}>
              <LikeSongButton size={20} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                }}>
                <PreviousSongButton size={30} />
                <PlayPauseButton isFullScreen={true} />
                <NextSongButton size={30} />
              </View>
              <RepeatSongButton size={25} />
            </View>
          </LinearGradient>
          {/* <QueueBottomSheet /> */}
        </View>
      </ImageBackground>
    </Animated.View>
  );
};
