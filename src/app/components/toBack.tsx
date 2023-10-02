import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ToBackProps {
  text: string;
}

const ToBack: React.FC<ToBackProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="arrow-forward" size={24} color="black" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    width: '100%',
    height: 30,
    paddingHorizontal: 10,
  },
  text: {
    marginLeft: 10,
  },
});

export default ToBack;
