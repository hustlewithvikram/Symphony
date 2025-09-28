import React, {useContext, useRef} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import Context from '../../context/Context';

const {height} = Dimensions.get('screen');

const BottomSheetMusic = ({color}) => {
  const bottomSheetRef = useRef(null);
  const {Index} = useContext(Context);

  // Shared value for sheet position (pixels)
  const sheetPosition = useSharedValue(0);

  // Define your snap points
  const collapsedHeight = 155;
  const expandedHeight = height; // or '100%', you can measure it dynamically if needed

  const animatedStyle = useAnimatedStyle(() => {
    const size = 300;

    // Normalize progress between 0 (collapsed) and 1 (expanded)
    const progress =
      (sheetPosition.value - collapsedHeight) /
      (expandedHeight - collapsedHeight);

    // Clamp the value between 0 and 1
    const clamped = Math.min(Math.max(progress, 0), 1);

    const borderRadius = interpolate(clamped, [0, 1], [size / 2, 0]);

    return {
      width: size,
      height: size,
      borderRadius,
      backgroundColor: 'tomato',
    };
  });

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={[collapsedHeight, expandedHeight]}
      enableContentPanningGesture
      enableOverDrag
      handleHeight={5}
      handleIndicatorStyle={{
        height: 0,
        width: 0,
        backgroundColor: 'transparent',
      }}
      backgroundStyle={{backgroundColor: color}}
      animatedPosition={sheetPosition} // track drag in pixels
    >
      <BottomSheetView
        style={[styles.contentContainer, {backgroundColor: color}]}>
        <Animated.View style={animatedStyle} />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default BottomSheetMusic;
