import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {Link} from 'expo-router'
import { Href } from 'expo-router/build/link/href';

interface SuccessModalProps {
  isVisible: boolean;
  nextPag: Href;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isVisible, nextPag }) => {

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={styles.congratsText}>Parabéns!</Text>
            <Text style={styles.messageText}>Você concluiu o desafio com sucesso.</Text>

          </View>
          <View style={styles.buttonsContainer}>
            <Link href={'/selectLevel'} asChild>
              <TouchableOpacity style={styles.buttonRedo}>
                <Text style={styles.buttonText}>Refazer</Text>
              </TouchableOpacity>
            </Link>
            <Link href={nextPag} asChild>
            <TouchableOpacity style={styles.buttonAdvance} >
              <Text style={styles.buttonText}>Avançar</Text>
            </TouchableOpacity>

            </Link>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;


const styles = StyleSheet.create({
  modalContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Cor de fundo com transparência
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'gold', // Cor do texto
    marginBottom: 10,
  },
  messageText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',

  },
  buttonRedo: {
    alignItems: 'center',
    width: '50%',
    backgroundColor: 'rgba(255, 162, 162, 0.7)', // Cor do botão "Refazer"
    padding: 20,
    borderBottomLeftRadius: 10,
  },
  buttonAdvance: {
    alignItems: 'center',
    width: '50%',
    backgroundColor: 'rgba(154,255,195,0.7)', // Cor do botão "Avançar"
    padding: 20,
    borderBottomRightRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
