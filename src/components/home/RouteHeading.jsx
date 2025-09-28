import {Dimensions, Pressable, Text, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {Spacer} from '../global/Spacer';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {GetCurrentDaytime} from '../../utils/GetCurrentDaytime';
import {useGetUserName} from '../../hooks/useGetUserName';

export const RouteHeading = ({bottomText, showSearch, showSettings}) => {
  const userName = useGetUserName();
  const theme = useTheme();
  const width = Dimensions.get('window').width;
  const navigation = useNavigation();

  return (
    <>
      <Spacer />
      <View
        style={{
          paddingHorizontal: 5,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 15,
        }}>
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}>
          <Text
            style={{
              fontWeight: 900,
              color: theme.colors.text,
              fontSize: width * 0.055,
              fontFamily: 'roboto',
            }}>{`Hey, ${userName}`}</Text>
          {/*<SmallText text=/>*/}
          <Text
            style={{
              fontWeight: 400,
              color: theme.colors.text,
              fontSize: width * 0.04,
              fontFamily: 'roboto',
            }}>
            {bottomText ? bottomText : GetCurrentDaytime()}
          </Text>
        </View>
        <View style={{flex: 1}} />
        {showSearch && (
          <Pressable
            style={{
              padding: 5,
              backgroundColor: 'rgba(0,0,0,0)',
              borderRadius: 10,
            }}
            onPress={() => {
              navigation.navigate('Search');
            }}>
            <Feather
              name={'search'}
              size={width * 0.055}
              color={theme.colors.text}
            />
          </Pressable>
        )}
        {showSettings && (
          <Pressable
            onPress={() => {
              navigation.navigate('Settings');
            }}
            style={{
              padding: 5,
              paddingRight: 20,
              backgroundColor: 'rgba(0,0,0,0)',
              borderRadius: 10,
            }}>
            <SimpleLineIcons
              name={'settings'}
              size={width * 0.055}
              color={theme.colors.text}
            />
          </Pressable>
        )}
      </View>
      <Spacer />
    </>
  );
};
