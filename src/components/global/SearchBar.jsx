import {TextInput, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

export const SearchBar = ({onChange}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        height: 60,
        marginHorizontal: 15,
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 5,
          backgroundColor: 'rgba(0,0,0,0)',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
        }}>
        <TextInput
          cursorColor={'black'}
          placeholder={'Search songs, playlists & albums'}
          placeholderTextColor={'black'}
          style={{
            color: 'black',
            fontSize: 16,
            fontFamily: 'roboto',
            backgroundColor: theme.colors.text,
            borderRadius: 999,
            paddingHorizontal: 25,
            paddingVertical: 20,
          }}
          onChangeText={onChange}
          autoFocus={true}
        />
      </View>
    </View>
  );
};
