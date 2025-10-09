import {Pressable, View} from 'react-native';
import {PlainText} from '../global/PlainText';
import {useNavigation} from '@react-navigation/native';
import {useAppTheme} from '../../theme';

export const EachMomentsandGenres = ({text, color, showLeftColor, style}) => {
  const navigation = useNavigation();
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('ShowPlaylistofType', {
          Searchtext: text.toLowerCase(),
        });
      }}
      style={{
        backgroundColor: 'rgba(43,47,44,0.84)',
        borderRadius: 10,
        paddingRight: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        ...style,
      }}>
      {showLeftColor && (
        <View
          style={{
            borderRadius: 10,
            width: 10,
            height: 50,
            backgroundColor: color,
            marginRight: 10,
          }}
        />
      )}
      <PlainText
        text={text}
        style={{opacity: 0.9, color: theme.colors.textDark}}
      />
    </Pressable>
  );
};
