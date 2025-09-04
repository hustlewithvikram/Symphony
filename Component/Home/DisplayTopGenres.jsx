import { memo } from "react";
import { ScrollView } from "react-native";
import { EachMomentsandGenres } from "../Discover/EachMomentsandGenres";
import {useTheme} from '@react-navigation/native';

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
  const theme = useTheme();
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
            backgroundColor: theme.colors.tertiaryDark,
          }}
        />
      ))}
    </ScrollView>
  );
});
