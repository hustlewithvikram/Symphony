import {useTheme} from '@react-navigation/native';
import {memo} from 'react';
import {StatusBar, View} from 'react-native';
import {useAppTheme} from '../theme';

export const MainWrapper = memo(function MainWrapper({children}) {
  const theme = useAppTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <StatusBar animated={true} />
      {children}
    </View>
  );
});
