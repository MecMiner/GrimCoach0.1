import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


interface BackButtonProps {
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
            <Ionicons name="md-arrow-back-outline" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    elevation: 5, // Cor do botão
    borderBottomRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Para garantir que ele fique na parte superior de outros elementos
  },
});

export default BackButton;
