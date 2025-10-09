import {memo} from 'react';
import {ScrollView} from 'react-native';
import {EachMomentsandGenres} from '../discover/EachMomentsandGenres';
import {useTheme} from '@react-navigation/native';
import {useAppTheme} from '../../theme';

export const DisplayTopGenres = memo(() => {
  const genres = [
    'Romance',
    'Lofi',
    'Hip Hop',
    'Classical',
    'Jazz',
    'Party',
    'Retro',
    'Sad',
  ];
  const theme = useAppTheme();

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      contentContainerStyle={{gap: 10, paddingHorizontal: 20}}>
      {genres.map((e, i) => (
        <EachMomentsandGenres
          text={e}
          key={i}
          color={'rgb(42,41,41)'}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 35,
            padding: 0,
            paddingLeft: 15,
            borderRadius: 100000,
            backgroundColor: theme.colors.primary,
            color: theme.colors.text,
          }}
        />
      ))}
    </ScrollView>
  );
});
