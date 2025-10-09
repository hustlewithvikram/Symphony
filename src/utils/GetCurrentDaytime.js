import React from 'react';
import { Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAppTheme } from '../theme';

export function GetCurrentDaytime(messages = {}) {
  const theme = useAppTheme();

  const defaultMessages = {
    night: { text: "Lofi Night's", icon: 'nightlight-round' },
    morning: { text: 'Morning Vibes', icon: 'wb-sunny' },
    afternoon: { text: 'Afternoon Vibes', icon: 'wb-cloudy' },
    evening: { text: "Evening Chill's", icon: 'wb-twilight' },
  };

  const mergedMessages = { ...defaultMessages, ...messages };
  const hour = new Date().getHours();

  let current;

  if (hour >= 21 || hour <= 3) { current = mergedMessages.night; }
  else if (hour >= 4 && hour <= 11) { current = mergedMessages.morning; }
  else if (hour >= 12 && hour <= 16) { current = mergedMessages.afternoon; }
  else if (hour >= 17 && hour <= 20) { current = mergedMessages.evening; }
  else { current = { text: 'Good Vibes', icon: 'mood' }; }

  return (
    <Text style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', color: theme.colors.textDark }}>
      {current.text} {' '}
      <MaterialIcons name={current.icon} size={10} color="#000" />
    </Text>
  );
}
