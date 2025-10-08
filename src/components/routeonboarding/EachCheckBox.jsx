import {View, Text, Pressable, StyleSheet} from 'react-native';
import {DefaultTheme, useTheme} from '@react-navigation/native';

export const EachCheckBox = ({
  checkbox1,
  checkbox2,
  onCheck1,
  onCheck2,
  data,
}) => {
  return (
    <View style={styles.row}>
      <EachCheck name={checkbox1} data={data} onPress={onCheck1} />
      <EachCheck name={checkbox2} data={data} onPress={onCheck2} />
    </View>
  );
};

function EachCheck({name, onPress, data}) {
  const theme = useTheme();
  const isSelected = data.includes(name.toLowerCase());

  const handlePress = () => {
    const updated = [...data];
    if (isSelected) {
      const index = updated.indexOf(name.toLowerCase());
      if (index > -1) updated.splice(index, 1);
    } else {
      updated.push(name.toLowerCase());
    }
    onPress(updated);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({pressed}) => [
        styles.checkboxContainer,
        {
          backgroundColor: isSelected ? theme.colors.primary : '#fff',
          borderColor: theme.colors.primary,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <View style={styles.checkbox}>
        {isSelected && <View style={styles.innerCheck} />}
      </View>
      <Text
        style={[
          styles.checkboxText,
          {color: isSelected ? '#fff' : DefaultTheme.colors.text},
        ]}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  innerCheck: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
