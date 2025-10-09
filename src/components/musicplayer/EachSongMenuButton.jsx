import {Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useAppTheme} from '../../theme';

export const EachSongMenuButton = ({Onpress}) => {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        Onpress();
      }}
      style={{
        padding: 10,
        backgroundColor: theme.colors.primaryDark,
        borderRadius: 100,
      }}>
      <Entypo
        name={'dots-three-vertical'}
        size={17}
        color={theme.colors.textDark}
      />
    </Pressable>
  );
};
