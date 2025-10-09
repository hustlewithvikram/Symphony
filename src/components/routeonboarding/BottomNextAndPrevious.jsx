import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const BottomNextAndPrevious = ({
  showPrevious,
  delay = 0,
  onNextPress,
  onPreviousPress,
}) => {
  const theme = useTheme();
  const buttonBg = '#fff'; // white background
  const buttonColor = theme.colors.primary || '#6200ee'; // fallback theme color

  return (
    <View style={styles.container}>
      {showPrevious && (
        <Animated.View entering={FadeInDown.delay(delay)} style={{flex: 1}}>
          <Pressable
            onPress={onPreviousPress}
            style={({pressed}) => [
              styles.prevButton,
              {backgroundColor: buttonBg},
              pressed && {opacity: 0.6},
            ]}>
            <MaterialIcons
              name="arrow-circle-left"
              size={20}
              color={buttonColor}
              style={{marginRight: 8}}
            />
            <Text style={[styles.prevText, {color: buttonColor}]}>
              Previous
            </Text>
          </Pressable>
        </Animated.View>
      )}

      <Animated.View
        entering={FadeInDown.delay(delay + 100)}
        style={{marginLeft: showPrevious ? 8 : 0}}>
        <Pressable
          onPress={onNextPress}
          style={({pressed}) => [
            styles.nextButton,
            {backgroundColor: '#fff'},
            pressed && {opacity: 0.8},
          ]}>
          <MaterialIcons name="arrow-circle-right" size={28} color="#000" />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 24,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'red',
    gap: 8,
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  prevText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28, // circular
    justifyContent: 'center',
    alignItems: 'center',
  },
});
