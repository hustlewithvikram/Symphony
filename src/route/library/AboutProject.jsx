import {MainWrapper} from '../../layout/MainWrapper';
import {Linking, Pressable, ScrollView, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Spacer} from '../../components/global/Spacer';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {useAppTheme} from '../../theme';
import {Appbar, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export const AboutProject = () => {
  const TopHeight = 100;
  const theme = useAppTheme();
  const navigation = useNavigation();

  return (
    <MainWrapper>
      <ScrollView>
        {/* <Spacer height={60} /> */}
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title="About App & Developer" />
        </Appbar.Header>

        <Spacer />

        <View style={{paddingHorizontal: 10, flexDirection: 'column', gap: 10}}>
          <View
            style={{
              height: TopHeight,
              flexDirection: 'row',
              gap: 10,
              paddingHorizontal: 10,
            }}>
            <View
              // source={require('../../images/me.jpeg')}
              style={{
                height: TopHeight,
                width: TopHeight,
                borderRadius: 200000,
                backgroundColor: theme.colors.onBackground,
              }}
            />
            <View style={{justifyContent: 'center', gap: 8}}>
              <View>
                <Text style={{fontSize: 12}}>Developed By</Text>
                <Text style={{fontSize: 10}}>Vikram Vishwakarma</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  maxWidth: 200,
                  flexWrap: 'wrap',
                }}>
                <EachSocialButton
                  title={'LinkedIn'}
                  icon={
                    <AntDesign
                      name={'linkedin-square'}
                      color={theme.colors.textWhite}
                    />
                  }
                  color={'rgb(23,59,100)'}
                  url={'https://www.linkedin.com/in/ankit-kum-shah/'}
                />
                <EachSocialButton
                  title={'Instagram'}
                  icon={
                    <AntDesign
                      name={'instagram'}
                      color={theme.colors.textWhite}
                    />
                  }
                  color={'rgb(83,43,43)'}
                  url={'https://www.instagram.com/ankit_kumar.cpp/'}
                />
                <EachSocialButton
                  title={'Github'}
                  icon={
                    <AntDesign name={'github'} color={theme.colors.textWhite} />
                  }
                  color={'rgb(42,42,42)'}
                  url={'https://github.com/hustlewithvikram'}
                />
              </View>
            </View>
          </View>

          <Spacer />

          {/* telegram & whatsapp */}
          <View style={{paddingHorizontal: 15}}>
            <Text style={{fontSize: 12}}>Want to stay updated?</Text>
            <Text style={{fontSize: 10}}>join the community.</Text>

            <Spacer />

            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <EachCommunityButton
                title={'Telegram'}
                icon={
                  <EvilIcons
                    name={'sc-telegram'}
                    size={35}
                    color={theme.colors.textWhite}
                  />
                }
                color={'rgb(50,95,123)'}
                subTitle={'Symphony'}
                url={'https://t.me/beastzx'}
              />
              <EachCommunityButton
                title={'Whatsapp'}
                icon={
                  <FontAwesome
                    name={'whatsapp'}
                    size={35}
                    color={theme.colors.textWhite}
                  />
                }
                color={'rgb(52,123,50)'}
                subTitle={'Symphony'}
                url={'https://whatsapp.com/'}
              />
            </View>
          </View>

          <Spacer />

          {/* An open source project */}
          <View style={{paddingHorizontal: 15}}>
            <Text style={{fontSize: 12}}>Are you a developer?</Text>
            <Text style={{fontSize: 10}}>Contribute to the project.</Text>

            <Spacer />

            <View
              style={{
                height: 100,
              }}>
              <EachCommunityButton
                style={{
                  justifyContent: 'space-around',
                }}
                title={'Symphony'}
                icon={
                  <AntDesign
                    name={'github'}
                    size={40}
                    color={theme.colors.textWhite}
                  />
                }
                color={'rgb(46,46,46)'}
                subTitle={
                  'An open source music player to listen music for free.'
                }
                url={'https://github.com/Infinite-Null/Symphony'}
              />
            </View>
          </View>

          <Spacer />

          <View style={{paddingHorizontal: 15}}>
            <Text style={{fontSize: 12}}>Request a new feature?</Text>
            <Text style={{fontSize: 10}}>Or report a bug?</Text>

            <Spacer />

            <View
              style={{
                height: 120,
              }}>
              <EachCommunityButton
                style={{
                  justifyContent: 'space-around',
                }}
                title={''}
                icon={
                  <Entypo
                    name={'bug'}
                    size={40}
                    color={theme.colors.textWhite}
                  />
                }
                color={'rgb(98,38,38)'}
                subTitle={
                  'You can always request me new features or report a bug in any of my social media handles or you can mail me at :\nankit.kum.sha9933@gmail.com\n\nEven you can raise an issue in Github'
                }
                url={''}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </MainWrapper>
  );
};

function EachSocialButton({icon, color, title, url}) {
  const theme = useAppTheme();

  function loadInBrowser() {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  return (
    <Pressable
      onPress={loadInBrowser}
      style={{
        flexDirection: 'row',
        backgroundColor: color,
        padding: 5,
        paddingHorizontal: 8,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}>
      {icon}
      <Text
        style={{
          color: theme.colors.textWhite,
          fontSize: 12,
        }}>
        {title}
      </Text>
    </Pressable>
  );
}

function EachCommunityButton({icon, color, title, url, subTitle, style}) {
  const theme = useAppTheme();

  function loadInBrowser() {
    if (url !== '') {
      Linking.openURL(url).catch(err =>
        console.error("Couldn't load page", err),
      );
    }
  }

  return (
    <Pressable
      onPress={loadInBrowser}
      style={{
        flexDirection: 'row',
        backgroundColor: color,
        padding: 5,
        paddingVertical: 15,
        // paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 5,
        ...style,
      }}>
      {icon}
      <View>
        {title !== '' && (
          <Text style={{fontSize: 18, color: theme.colors.textWhite}}>
            {title}
          </Text>
        )}
        <Text
          style={{fontSize: 12, maxWidth: 250, color: theme.colors.textWhite}}>
          {subTitle}
        </Text>
      </View>
    </Pressable>
  );
}
