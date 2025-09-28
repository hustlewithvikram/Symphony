import {Dimensions, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {GetFontSizeValue} from '../../localstorage/AppSettings';

export const PlainText = ({text, style, numberOfLine}) => {
  const theme = useTheme();
  const width = Dimensions.get('window').width;
  const [Size, setSize] = useState(width * 0.035);
  async function getFont() {
    const data = await GetFontSizeValue();
    if (data === 'Medium') {
      setSize(width * 0.035);
    } else if (data === 'Small') {
      setSize(width * 0.03);
    } else {
      setSize(width * 0.04);
    }
  }

  useEffect(() => {
    getFont();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Text
      numberOfLines={numberOfLine ? numberOfLine : 2}
      style={{
        color: theme.colors.text,
        fontSize: Size,
        fontWeight: 500,
        paddingRight: 10,
        fontFamily: 'roboto',
        ...style,
      }}>
      {text}
    </Text>
  );
};
