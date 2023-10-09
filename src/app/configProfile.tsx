import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput} from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Importe a interface de imagem
import { ImageSourcePropType } from 'react-native';
import { PersonData } from './components/types';

// Importe as imagens do arquivo expressionImages.tsx
import expressionImages from './config/expressionImages';
import Title from './components/title';
import SpeechText from './components/SpeechText';
import { StatusBar } from 'expo-status-bar';
import colors from './config/colors';
import SelectedAvatar from './modal/SelectAvatar';

export default function CreateProfile() {
  const [inputName, setInputName] = useState('');
  const [age, setAge] = useState(23);
  const [selectedAvatar, setSelectedAvatar] = useState<ImageSourcePropType | null>(null); // Inicialize com null
  const [avatarName, setAvatarName] = useState('pato');
  const [user, setUser] = useState<PersonData>();
  const [feedback, setFeedback] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);

  const openAvatarSelection = () => {
    setAvatarModalVisible(true);
  };

  const closeAvatarSelection = () => {
    setAvatarModalVisible(false);


  };



  const loadProfileData = async () => {
    try {
      const userOn = await AsyncStorage.getItem('@grimcoach:token');
      const storedData = await AsyncStorage.getItem('@grimcoach:profile');

      if (storedData && userOn) {
        const token = JSON.parse(userOn)
        const parsedData = JSON.parse(storedData);
        const profile = parsedData.find((profile: PersonData) => profile.id === token.hash)

        if (profile) {
          console.log(profile);
          setSelectedAvatar(expressionImages.avatar[profile.avatar]);
          setAge(profile.age);
          setInputName(profile.name);
          setAvatarName(profile.avatar)
          setUser(profile);
        } else {
          console.log('Erro ao buscar usuario')
        }
      } else {
        router.replace('/createProfile')
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    }
  };

  useEffect(() => {
    console.log('teste');
    loadProfileData();
  }, []); // Executa somente uma vez na montagem



  const saveProfileData = async () => {
    try {
      // Carregar os dados existentes do AsyncStorage
      const response = await AsyncStorage.getItem('@grimcoach:profile');
      const previusData = response ? JSON.parse(response) : [];

      // Encontrar o índice do objeto que corresponde ao id que você deseja atualizar
      const index = previusData.findIndex((profile: PersonData) => profile.id === user?.id);

      if (index !== -1) {
        // Atualizar o objeto existente com os novos valores
        previusData[index] = {
          id: user?.id,
          name: inputName,
          age: age,
          avatar: avatarName,
          pontos: user?.pontos,
          dataCriacao: user?.dataCriacao,
        };

        // Salvar os dados atualizados de volta no AsyncStorage
        await AsyncStorage.setItem('@grimcoach:profile', JSON.stringify(previusData));
        console.log('Dados do perfil atualizados com sucesso!');
      } else {
        console.log('ID não encontrado. Não foi possível atualizar o perfil.');
      }
    } catch (error) {
      console.error('Erro ao salvar dados do perfil:', error);
    }
  };

  const deleteProfile = async () => {
    try {
      // Carregar os dados existentes do AsyncStorage
      const response = await AsyncStorage.getItem('@grimcoach:profile');
      const previusData = response ? JSON.parse(response) : [];
  
      // Filtrar os perfis existentes para excluir o perfil atual
      const filteredData = previusData.filter((profile: PersonData) => profile.id !== user?.id);
  
      // Salvar os dados atualizados de volta no AsyncStorage
      await AsyncStorage.setItem('@grimcoach:profile', JSON.stringify(filteredData));
      console.log('Perfil excluído com sucesso!');
      router.replace('/');
  
      // Redirecionar o usuário para a tela de criação de perfil ou realizar qualquer outra ação necessária
      // router.replace('/createProfile');
    } catch (error) {
      console.error('Erro ao excluir o perfil:', error);
    }
  };
  


  const createProfile = () => {
    if (inputName === user?.name && avatarName === user?.avatar && age === user.age) {
      setFeedback('Por favor, altere algo.');
      return;
    }

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

      <SpeechText style={{}} text={'Crie um perfil, você tem que selecionar um avatar, inserir nome e idade'} />

      <Title title='Adicione um perfil' />

      <View style={styles.game}>
        <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
          <TouchableOpacity disabled={!editMode} onPress={openAvatarSelection} style={styles.avatarButton}>
            {selectedAvatar ? (
              <Image source={selectedAvatar} style={styles.avatarSelected} />
            ) : (
              <Ionicons name="ios-add" size={60} color="#888" />
            )}
          </TouchableOpacity>
          <View style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: 130 }}>
            <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => setEditMode(true)}>
              <Ionicons name="create-outline" size={35} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="trash-outline" size={35} color="red" onPress={deleteProfile}/>
            </TouchableOpacity>
          </View>

        </View>
        {editMode ?
          <TextInput

          style={styles.input}
          placeholder="Digite o nome"
          placeholderTextColor="#888"
          value={inputName}
          onChangeText={(text) => setInputName(text)}
        />
          :
          <Text style={styles.ageText}>{user?.name}</Text>
          
      }
        <View style={styles.ageView}>
          <Text style={styles.ageText}>Idade: {Math.round(age)}</Text>

          {editMode &&
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

          />}
        </View>

        <TouchableOpacity onPress={createProfile} style={styles.buttonConfig}>
          <Text style={{ color: 'purple' }}>Salvar Alterações</Text>
        </TouchableOpacity>

        {feedback && <Text style={{ color: 'red', position: 'absolute', bottom: 0 }}>{feedback}</Text>}
      </View>

      <SelectedAvatar
        isVisible={isAvatarModalVisible}
        onClose={() => setAvatarModalVisible(false)}
        setAvatar={setSelectedAvatar}
        setAvatarName={setAvatarName}
      />
      <StatusBar backgroundColor={colors.backGroundTitle} />
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
    borderWidth: 1,
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
  buttonConfig: {
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
  ageView: {
    borderWidth: 1,
    textAlign: 'left',
    backgroundColor: 'white',
    borderColor: '#ccc',
    marginBottom: 40,
    width: 300
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
