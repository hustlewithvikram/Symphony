import {Dimensions, ImageBackground, Pressable, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {PlainText} from '../global/PlainText';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native-paper';
import {useAppTheme} from '../../theme';

export const EachLibraryCard = ({image, text, navigate}) => {
  const width = Dimensions.get('window').width;
  const containerWidth = width * 0.45;
  const navigation = useNavigation();
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate(navigate);
      }}
      style={{
        // marginVertical: 8,
        height: containerWidth,
        width: containerWidth,
        borderRadius: 7,
        overflow: 'hidden',
      }}>
      <ImageBackground
        blurRadius={10}
        source={image}
        style={{
          height: containerWidth,
          width: containerWidth,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            // backgroundColor: 'rgba(0,0,0,0.53)',
          }}>
          <FastImage
            source={image}
            style={{
              height: '80%',
              width: '100%',
            }}
          />
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 15,
              backgroundColor: theme.colors.onSecondary,
              width: '100%',
            }}>
            <Text style={{fontSize: 12, color: theme.colors.text}}>{text}</Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};
