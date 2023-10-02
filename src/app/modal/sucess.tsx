import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{
        backgroundColor: 'rgba(255, 255, 255, 1)',
        width: 348,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center', // Centralizar o conteúdo horizontalmente
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
      }}>
        <AntDesign name="checkcircle" size={60} color="green" />
        <Text style={{ fontSize: 20, marginVertical: 10 }}>Você acertou!</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={{ fontSize: 16, color: 'blue' }}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SuccessModal;
