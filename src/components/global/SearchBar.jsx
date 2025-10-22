import {TextInput, View, StyleSheet, Platform} from 'react-native';
import {useAppTheme} from '../../theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const SearchBar = ({onChange, placeholder, navigation}) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Back Button (Optional) */}
      {navigation && (
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={theme.colors.onSurface}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      )}

      {/* Search Input */}
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color={theme.colors.onSurfaceVariant}
          style={styles.searchIcon}
        />
        <TextInput
          cursorColor={theme.colors.primary}
          placeholder={placeholder || 'Search songs, playlists & albums'}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          style={[
            styles.textInput,
            {
              backgroundColor: theme.colors.surfaceVariant,
              color: theme.colors.onSurface,
            },
          ]}
          onChangeText={onChange}
          autoFocus={true}
          clearButtonMode="while-editing"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    overflow: 'hidden',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    padding: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    paddingHorizontal: 48,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    borderRadius: 28,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
