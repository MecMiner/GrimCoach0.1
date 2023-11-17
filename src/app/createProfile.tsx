import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage
import { router, Link } from 'expo-router';
import uuid from 'react-native-uuid'
import { Ionicons } from '@expo/vector-icons';
// Importe a interface de imagem
import { ImageSourcePropType } from 'react-native';

// Importe as imagens do arquivo expressionImages.tsx
import expressionImages from './config/expressionImages';
import Title from './components/title';
import SpeechText from './components/SpeechText';
import { StatusBar } from 'expo-status-bar';
import colors from './config/colors';
import SelectedAvatar from './modal/SelectAvatar';

const { width, height } = Dimensions.get('window');

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
      const id: string = uuid.v4() as string;
      const date = new Date();
      const newFasesCompletas = {
        compareExpressions: { facil: 0, medio: 0, dificil: 0 },
        escrevaExpressao: { facil: 0, medio: 0, dificil: 0 },
        ligueExpressao: { facil: 0, medio: 0, dificil: 0 },
        jogoDaMemoria: { facil: 0, medio: 0, dificil: 0 },
        piscaPica: { facil: 0, medio: 0, dificil: 0 },
        sorriaEstaSendoFilmado: { facil: 0, medio: 0, dificil: 0 },
        encontreOErro: { facil: 0, medio: 0, dificil: 0 },
        imiteAExpressao: { facil: 0, medio: 0, dificil: 0 },
        selecioneExpressao: { facil: 0, medio: 0, dificil: 0 },
        chefinMandou: {facil: 0, medio: 0, dificil: 0}
      };
      const newTempoJogado = {
        compareExpressions: { facil: 0, medio: 0, dificil: 0 },
        escrevaExpressao: { facil: 0, medio: 0, dificil: 0 },
        ligueExpressao: { facil: 0, medio: 0, dificil: 0 },
        jogoDaMemoria: { facil: 0, medio: 0, dificil: 0 },
        piscaPica: { facil: 0, medio: 0, dificil: 0 },
        sorriaEstaSendoFilmado: { facil: 0, medio: 0, dificil: 0 },
        encontreOErro: { facil: 0, medio: 0, dificil: 0 },
        imiteAExpressao: { facil: 0, medio: 0, dificil: 0 },
        selecioneExpressao: { facil: 0, medio: 0, dificil: 0 },
        chefinMandou: {facil: 0, medio: 0, dificil: 0}
      };
      const newData = {
        id: id,
        name: inputName,
        age: age,
        avatar: avatarName,
        pontos: 0,
        dataCriacao: date,
        fasesCompletas: newFasesCompletas,
        tempoJogado: newTempoJogado,
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
      
        <SpeechText style={{}} text={'Crie um perfil, você tem que selecionar um avatar, inserir nome e idade'}/>

          <Title title='Adicione um perfil'/>

        <View style={styles.game}>
        <TouchableOpacity onPress={openAvatarSelection} style={styles.avatarButton}>
          {selectedAvatar ? (
            <Image source={selectedAvatar} style={styles.avatarSelected} />
          ) : (
            <Ionicons name="ios-add" size={60} color="#888" />
          )}
        </TouchableOpacity>
        <View style={{ width: width - 30, backgroundColor: 'white', borderRadius: 20, elevation: 5, alignItems: 'center', marginBottom: 20, flexDirection: 'row' }}>
                <TextInput

                  style={styles.input}
                  placeholder="Digite o nome"
                  placeholderTextColor="#888"
                  value={inputName}
                  onChangeText={(text) => setInputName(text)}
                />
              </View>
              <View style={{ width: width - 30, backgroundColor: 'white', borderRadius: 20, elevation: 5, alignItems: 'center', justifyContent: 'center', marginBottom: 20, flexDirection: 'row', padding: 10 }}>
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

      <SelectedAvatar 
        isVisible={isAvatarModalVisible} 
        onClose={() => setAvatarModalVisible(false)} 
        setAvatar={setSelectedAvatar} 
        setAvatarName={setAvatarName}
        />
      <StatusBar backgroundColor={colors.backGroundTitle}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backGroundApp,
    alignItems: 'center',
  },


  game: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50

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
    height: 50,
    borderColor: '#ccc',
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
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  avatarSelected: {
    width: 100,
    height: 100,
    margin: 5,
  },
  ageView:{
    textAlign: 'left',
    backgroundColor: 'white',
    borderColor: '#ccc',
    marginBottom: 40,
  },
  ageText: {
    paddingHorizontal: 20,
    fontSize: 24,
    color: '#888',
  },
  slider: {
    width: 300,
    height: 40,
  },
});
