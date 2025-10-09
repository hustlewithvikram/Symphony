import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '@react-navigation/native';
import BottomTabBar from '../components/tab/BottomTabBar';
import {HomeRoute} from './home/HomeRoute';
import {DiscoverRoute} from './discover/DiscoverRoute';
import {LibraryRoute} from './library/LibraryRoute';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAppTheme} from '../theme';

const Tab = createBottomTabNavigator();

export const RootRoute = () => {
  const theme = useAppTheme();

  return (
    <>
      <Tab.Navigator
        tabBar={props => <BottomTabBar {...props} />}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarLabelStyle: {
            fontWeight: 'bold',
          },
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarActiveTintColor: theme.colors.primary,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderColor: 'rgba(28,27,27,0)',
          },
        }}>
        <Tab.Screen
          options={{
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color, size, focused}) => (
              <MaterialIcons name="home" size={size} color={color} />
              // <Octicons name="home" color={color} size={size - 4} />
            ),
          }}
          name="Home"
          component={HomeRoute}
        />
        <Tab.Screen
          options={{
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color, size, focused}) => (
              <Entypo name="compass" color={color} size={size - 4} />
            ),
          }}
          name="Discover"
          component={DiscoverRoute}
        />
        <Tab.Screen
          options={{
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color, size, focused}) => (
              <MaterialCommunityIcons
                name="music-box-multiple-outline"
                color={color}
                size={size - 4}
              />
            ),
          }}
          name="Library"
          component={LibraryRoute}
        />
      </Tab.Navigator>
    </>
  );
};
