/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from '../theme';
import BottomTabBar from '../components/tab/BottomTabBar';
import {HomeRoute} from './home/HomeRoute';
import {DiscoverRoute} from './discover/DiscoverRoute';
import {LibraryRoute} from './library/LibraryRoute';

const Tab = createBottomTabNavigator();

export const RootRoute = () => {
  const theme = useAppTheme();

  const screenOptions = {
    tabBarShowLabel: false,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarActiveTintColor: theme.colors.primary,
    headerShown: false,
    tabBarStyle: {
      backgroundColor: theme.colors.primary,
      borderColor: 'rgba(28,27,27,0)',
    },
  };

  const screens = [
    {
      name: 'Home',
      component: HomeRoute,
      icon: props => <MaterialIcons name="home" {...props} />,
    },
    {
      name: 'Discover',
      component: DiscoverRoute,
      icon: props => <Entypo name="compass" {...props} size={props.size - 4} />,
    },
    {
      name: 'Library',
      component: LibraryRoute,
      icon: props => (
        <MaterialCommunityIcons
          name="music-box-multiple-outline"
          {...props}
          size={props.size - 4}
        />
      ),
    },
  ];

  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={screenOptions}>
      {screens.map(({name, component, icon}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{tabBarIcon: icon}}
        />
      ))}
    </Tab.Navigator>
  );
};
