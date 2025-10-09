import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import BottomSheetMusic from '../musicplayer/BottomSheetMusic';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import Context from '../../context/Context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DefaultTheme} from 'react-native-paper';
import {useAppTheme} from '../../theme';

const bottomColor = DefaultTheme.colors.background;

export default function BottomTabBar({state, descriptors, navigation}) {
  const {setIndex} = useContext(Context);
  const theme = useAppTheme();

  useEffect(() => {
    setIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BottomSheetMusic />

      <View
        style={[
          styles.mainContainer,
          {backgroundColor: theme.colors.primaryDark},
        ]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <View key={index} style={styles.mainItemContainer}>
              <Pressable
                onPress={onPress}
                style={{
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderRadius: 20,
                  height: 40,
                }}>
                {!isFocused && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      paddingHorizontal: 15,
                      borderRadius: 15,
                      gap: 2,
                    }}>
                    {getIcon(label, true)}
                    <Text
                      style={{
                        fontSize: 8,
                        color: 'rgb(153,151,151)',
                        fontFamily: 'roboto',
                        letterSpacing: 1,
                      }}>
                      {label}
                    </Text>
                  </View>
                )}
                {isFocused && (
                  <Animated.View
                    entering={FadeInUp}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      paddingHorizontal: 15,
                      borderRadius: 15,
                      gap: 2,
                    }}>
                    {getIcon(label)}
                    <Animated.Text
                      entering={FadeInDown}
                      style={{
                        fontSize: 8,
                        color: 'white',
                        fontFamily: 'roboto',
                        letterSpacing: 1,
                      }}>
                      {label}
                    </Animated.Text>
                  </Animated.View>
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
    </>
  );
}

function getIcon(label, isDiabled = false) {
  if (label === 'Home') {
    return (
      <MaterialIcons
        name={'home'}
        color={isDiabled ? 'rgb(153,151,151)' : 'white'}
        size={22}
      />
    );
  } else if (label === 'Discover') {
    return (
      <MaterialIcons
        name={'explore'}
        color={isDiabled ? 'rgb(153,151,151)' : 'white'}
        size={22}
      />
    );
  } else if (label === 'Library') {
    return (
      <MaterialIcons
        name={'person'}
        color={isDiabled ? 'rgb(153,151,151)' : 'white'}
        size={22}
      />
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  mainItemContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
