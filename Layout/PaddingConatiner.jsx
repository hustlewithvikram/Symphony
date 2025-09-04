import { View } from "react-native";

export const PaddingConatiner = ({children}) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}>
      {children}
    </View>
  );
};
