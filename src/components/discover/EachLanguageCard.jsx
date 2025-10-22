import {Pressable} from 'react-native';
import {PlainText} from '../global/PlainText';
import {useNavigation} from '@react-navigation/native';
import {useAppTheme} from '../../theme';
import {Text} from 'react-native-paper';

export const EachLanguageCard = ({language}) => {
  const navigation = useNavigation();
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('LanguageDetail', {
          language: language.toLowerCase(),
        });
      }}
      style={{
        backgroundColor: 'rgba(43,47,44,0.84)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{paddingRight: 0, color: theme.colors.textWhite}}>
        {language}
      </Text>
    </Pressable>
  );
};
