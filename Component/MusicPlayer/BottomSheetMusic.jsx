/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {BackHandler, StyleSheet} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {MinimizedMusic} from './MinimizedMusic';
import {FullScreenMusic} from './FullScreenMusic';
import QueueBottomSheet from './QueueBottomSheet';
import Context from '../../Context/Context';

const BottomSheetMusic = ({color}) => {
  const bottomSheetRef = useRef(null);
  const {Index, setIndex} = useContext(Context);

  // Track sheet index internally
  const [sheetIndex, setSheetIndex] = useState(Index);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      setSheetIndex(0);
      setIndex(0);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    if (sheetIndex === 0) backHandler.remove();
    return () => backHandler.remove();
  }, [sheetIndex]);

  // Update sheet index on drag
  const handleSheetChanges = useCallback(index => {
    setSheetIndex(index);
    setIndex(index);
  }, []);

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={sheetIndex}
        snapPoints={[155, '100%']}
        enableContentPanningGesture={true}
        enableOverDrag={true}
        detached={false}
        handleHeight={5}
        handleIndicatorStyle={{
          height: 0,
          width: 0,
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0)',
        }}
        handleStyle={{position: 'absolute'}}
        backgroundStyle={{backgroundColor: color}}
        onChange={handleSheetChanges}>
        <BottomSheetView
          style={{...styles.contentContainer, backgroundColor: color}}>
          {/* Render mini player only when sheet is collapsed */}
          {sheetIndex === 0 && (
            <MinimizedMusic
              setIndex={setSheetIndex}
              openQueue={() => setIsQueueOpen(true)}
            />
          )}

          {/* Fullscreen player always rendered */}
          <FullScreenMusic
            color={color}
            Index={sheetIndex}
            setIndex={setSheetIndex}
            openQueue={() => setIsQueueOpen(true)}
          />
        </BottomSheetView>
      </BottomSheet>

      {/* Queue Bottom Sheet opens only when triggered */}
      {isQueueOpen && (
        <QueueBottomSheet Index={1} onClose={() => setIsQueueOpen(false)} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'rgb(21,21,21)'},
  contentContainer: {flex: 1},
});

export default BottomSheetMusic;
