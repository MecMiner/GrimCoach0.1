import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";


interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  return (
    <View style={[styles.container]}>
      <Text
        style={{
          fontSize: 32,
          color: '#FF914D',
          alignItems: 'center',
          textAlign: 'center',
          marginTop: 0,
          fontWeight: "bold",
          padding: 20
        }}
      >
        {title}
      </Text>

    </View>
      
  );
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.backGroundTitle,
    elevation: 5,
  },

})