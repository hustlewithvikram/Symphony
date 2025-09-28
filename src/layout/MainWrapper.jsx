import {useTheme} from '@react-navigation/native';
import {memo} from 'react';
import {StatusBar, View} from 'react-native';

export const MainWrapper = memo(function MainWrapper({children}) {
  const theme = useTheme();
  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <StatusBar backgroundColor={theme.colors.background} animated={true} />
      {children}
    </View>
  );
});
