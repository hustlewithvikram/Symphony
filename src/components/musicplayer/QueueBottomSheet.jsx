import React, {useRef, useState, useMemo, useCallback} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {QueueRenderSongs} from './QueueRenderSongs';
import {PlainText} from '../global/PlainText';
import {View, StyleSheet} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import {useAppTheme} from '../../theme';

const QueueBottomSheet = () => {
  const theme = useAppTheme();
  const bottomSheetRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const snapPoints = useMemo(() => [130, '50%'], []);

  const handleSheetChange = useCallback(index => {
    setCurrentIndex(index);
  }, []);

  const HandleComponent = useCallback(() => {
    return (
      <View style={styles.handleContainer}>
        <Octicons name="dash" size={24} color={theme.colors.onSurface} />
        <PlainText text="Song Queue" style={styles.titleText} />
      </View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const styles = StyleSheet.create({
    handleContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      height: 70,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
    },
    titleText: {
      color: theme.colors.onSurface,
      fontSize: 16,
      fontWeight: '600',
      marginTop: 4,
    },
    background: {
      backgroundColor: theme.colors.surface,
    },
  });

  return (
    <BottomSheet
      index={0}
      onChange={handleSheetChange}
      enablePanDownToClose={false}
      animateOnMount={true}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      handleComponent={HandleComponent}
      backgroundStyle={styles.background}>
      <QueueRenderSongs />
    </BottomSheet>
  );
};

export default QueueBottomSheet;
