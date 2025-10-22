import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import BottomSheetMusic from '../musicplayer/BottomSheetMusic';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import Context from '../../context/Context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAppTheme} from '../../theme';

const TAB_CONFIG = {
  Home: {icon: 'home'},
  Discover: {icon: 'explore'},
  Library: {icon: 'person'},
};

export default function BottomTabBar({state, descriptors, navigation}) {
  const {setIndex} = useContext(Context);
  const theme = useAppTheme();

  useEffect(() => {
    setIndex(0);
  }, [setIndex]);

  const renderTabItem = (route, index) => {
    const {options} = descriptors[route.key];
    const label = options.tabBarLabel ?? options.title ?? route.name;
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

    const TabContent = isFocused ? Animated.View : View;
    const TextComponent = isFocused ? Animated.Text : Text;

    return (
      <View key={route.key} style={styles.mainItemContainer}>
        <Pressable onPress={onPress} style={styles.pressable}>
          <TabContent
            entering={isFocused ? FadeInUp : undefined}
            style={styles.tabContent}>
            <MaterialIcons
              name={TAB_CONFIG[label]?.icon || 'circle'}
              color={isFocused ? 'white' : 'rgb(153,151,151)'}
              size={22}
            />
            <TextComponent
              entering={isFocused ? FadeInDown : undefined}
              style={[
                styles.label,
                {color: isFocused ? 'white' : 'rgb(153,151,151)'},
              ]}>
              {label}
            </TextComponent>
          </TabContent>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[styles.mainContainer, {backgroundColor: theme.colors.black}]}>
      {state.routes.map(renderTabItem)}
    </View>
  );
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
    backgroundColor: 'transparent',
  },
  pressable: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    height: 40,
  },
  tabContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 15,
    borderRadius: 15,
    gap: 2,
  },
  label: {
    fontSize: 8,
    fontFamily: 'roboto',
    letterSpacing: 1,
  },
});
