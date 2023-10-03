import React from "react";
import { Text, View } from "react-native";

interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  return (
      <Text
        style={{
          fontSize: 26,
          color: '#FF914D',
          alignItems: 'center',
          textAlign: 'center',
          marginTop: 0,
          fontWeight: "bold"
        }}
      >
        {title}
      </Text>
  );
}
