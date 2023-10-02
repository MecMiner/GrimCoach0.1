import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';
import { Entypo } from '@expo/vector-icons'; // Importe o ícone do Expo Icons
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage
import { router, Link } from 'expo-router';
import uuid from 'react-native-uuid'
import { Ionicons } from '@expo/vector-icons';
// Importe a interface de imagem
import { ImageSourcePropType } from 'react-native';

// Importe as imagens do arquivo expressionImages.tsx
import expressionImages from './phases/expressionImages';
import Title from './components/title';
import SpeechText from './components/speechText';

export default function CreateProfile() {
  const [inputName, setInputName] = useState('');
  const [age, setAge] = useState(23);
  const [selectedAvatar, setSelectedAvatar] = useState<ImageSourcePropType | null>(null); // Inicialize com null
  const [avatarName, setAvatarName]= useState('pato');
  const [data, setData] = useState('');
  const [feedback, setFeedback] = useState('');

  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);

  const openAvatarSelection = () => {
    setAvatarModalVisible(true);
  };

  const closeAvatarSelection = () => {
    setAvatarModalVisible(false);
  };

  const login = async (id: string | number[]) => {
    const user = {
      hash: id,
    }
    try {
      await AsyncStorage.setItem('@grimcoach:token', JSON.stringify(user)).then((e) => {
        console.log('User Logado');
        router.replace('/selectLevel')
      })
    } catch (error) {
      console.log('Erro ao inserir User')
    }
  }

  const saveProfileData = async () => { 
    try {
      const id = uuid.v4();
      const date = new Date();
      const newData = {
        id: id,
        name: inputName,
        age: age,
        avatar: avatarName,
        pontos: 0,
        dataCriacao: date,
        // Adicione outras informações aqui, se necessário
      };

      const response = await AsyncStorage.getItem('@grimcoach:profile');
      const previusData = response ? JSON.parse(response) : [];

      const data = [...previusData, newData]

      await AsyncStorage.setItem('@grimcoach:profile', JSON.stringify(data));
      console.log('Dados do perfil salvos com sucesso!');
      login(id)
 
    } catch (error) {
      console.error('Erro ao salvar dados do perfil:', error);
    }
  };

  const createProfile = () => {
    if (!inputName) {
      setFeedback('Por favor, insira um nome.');
      return;
    }
  
    if (!selectedAvatar) {
      setFeedback('Por favor, selecione um avatar.');
      return;
    }
  
    if (age <= 0) {
      setFeedback('Por favor, selecione uma idade válida.');
      return;
    }
    saveProfileData();
  };
  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row', paddingTop: 30}}>
          <SpeechText style={{}} text={'Crie um perfil, você tem que selecionar um avatar, inserir nome e idade'}/>
          <Title title='Adicione um perfil'/>
        </View>
        <View style={styles.game}>

        <TouchableOpacity onPress={openAvatarSelection} style={styles.avatarButton}>
          {selectedAvatar ? (
            <Image source={selectedAvatar} style={styles.avatarSelectionImage} />
          ) : (
            <Ionicons name="ios-add" size={60} color="#888" />
          )}
        </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome"
            placeholderTextColor="#888"
            value={inputName}
            onChangeText={(text) => setInputName(text)}
          />
        <View style={styles.ageView}>
          <Text style={styles.ageText}>Idade: {Math.round(age)}</Text>
          <Slider
            style={styles.slider}
            value={age}
            minimumValue={0}
            maximumValue={100}
            step={1}
            onValueChange={(value) => setAge(value)}
            minimumTrackTintColor="#30C28E" // Cor da trilha preenchida
            maximumTrackTintColor="#ccc" // Cor da trilha não preenchida
            thumbTintColor="#30C28E" // Cor do "thumb" (o marcador do slider)
            
          />
        </View>

          <TouchableOpacity onPress={createProfile} style={styles.buttonConfig}>
            <Text style={{color: 'purple'}}>Criar Perfil</Text>
          </TouchableOpacity>

          {feedback && <Text style={{color: 'red', position: 'absolute', bottom: 0}}>{feedback}</Text>}
        </View>

      <StatusBar hidden />

      {/* Modal de seleção de avatar */}
      <Modal
        visible={isAvatarModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAvatarSelection}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <View style={styles.avatarGrid}>
                {Object.keys(expressionImages.avatar).map((avatarName, index) => {
                  const isLastInRow = (index + 1) % 3 === 0;
                  return (
                    <TouchableOpacity
                      key={avatarName}
                      onPress={() => {
                        setSelectedAvatar(expressionImages.avatar[avatarName]);
                        setAvatarName(avatarName);
                        closeAvatarSelection();
                      }}
                      style={styles.avatarGridItem}
                    >
                      <Image
                        source={expressionImages.avatar[avatarName]}
                        style={styles.avatarSelectionImage}
                      />
                      {isLastInRow && <View style={styles.lineBreak} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <StatusBar hidden/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8EBFF',
    alignItems: 'center',
  },


  game: {
    flex: 1,
    backgroundColor: '#C8EBFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backgroundStyle: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  input: {
    width: 300,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 24,
    color: '#333',
    margin: 20,
    backgroundColor: 'white'
  },
  text: {
    fontSize: 36,
    color: '#FF914D',
    marginBottom: 30,
  },
  buttonConfig:{
    marginTop: 100,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    width: 180,
    height: 40,
    borderRadius: 50,
    marginBottom: 5,
    elevation: 5,
  },
  avatarButton: {
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    elevation: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Modal aparece na parte inferior da tela
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarGridItem: {
    width: '30%', // 30% para que 3 avatares caibam em uma linha
    margin: 5,
    alignItems: 'center',
  },
  lineBreak: {
    width: '100%', // Quebra de linha
  },
  avatarSelectionImage: {
    width: 50,
    height: 50,
    margin: 5,
  },
  ageView:{
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'left',
    backgroundColor: 'white',
    borderColor: '#ccc',
    marginBottom: 40,
  },
  ageText: {
    paddingHorizontal: 20,
    marginTop: 20,
    fontSize: 24,
    color: '#888',
  },
  slider: {
    width: 300,
    height: 40,
    marginBottom: 20,
  },
});
