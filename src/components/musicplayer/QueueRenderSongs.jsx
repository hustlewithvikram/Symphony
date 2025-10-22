import React, {memo, useContext, useCallback} from 'react';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {EachSongQueue} from './EachSongQueue';
import Context from '../../context/Context';

export const QueueRenderSongs = memo(function QueueRenderSongs() {
  const {Queue} = useContext(Context);

  const renderItem = useCallback(
    ({item, index}) => (
      <EachSongQueue
        title={item.title}
        artist={item.artist}
        id={item.id}
        index={index}
        image={item.artwork}
      />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item, index) => (item.id ? item.id.toString() : `queue-${index}`),
    [],
  );

  return (
    <BottomSheetFlatList
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 100,
        paddingRight: 60,
      }}
      data={Queue}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
});
