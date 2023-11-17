import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Importe a interface de imagem
import { ImageSourcePropType } from 'react-native';
import { PersonData } from './components/types';
import { FontAwesome } from '@expo/vector-icons';

// Importe as imagens do arquivo expressionImages.tsx
import expressionImages from './config/expressionImages';
import Title from './components/title';
import SpeechText from './components/SpeechText';
import { StatusBar } from 'expo-status-bar';
import colors from './config/colors';
import SelectedAvatar from './modal/SelectAvatar';


//importar graficos
import { BarChart } from "react-native-gifted-charts";
import { TextInput } from 'react-native-gesture-handler';
import { loadPerfilLogado } from './utils/utils';

const { width, height } = Dimensions.get('window');

type Grafico = 'total' | 'facil' | 'medio' | 'dificil';

type DadosFases = {
  value: number;
  label: string;
  frontColor?: string;
};


export default function CreateProfile() {
  const [inputName, setInputName] = useState('');
  const [age, setAge] = useState(23);
  const [selectedAvatar, setSelectedAvatar] = useState<ImageSourcePropType | null>(null); // Inicialize com null
  const [avatarName, setAvatarName] = useState('pato');
  const [user, setUser] = useState<PersonData | null>();
  const [feedback, setFeedback] = useState('');
  const [modo, setModo] = useState<boolean>(false);
  const [graficoFases, setGraficosFases] = useState<Grafico>('total');
  const [graficoTempo, setGraficosTempo] = useState<Grafico>('total');
  const [dadosFases, setDadosFases] = useState<DadosFases[]>([]);
  const [dadosTempo, setDadosTempo] = useState<DadosFases[]>([]);



  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);

  const openAvatarSelection = () => {
    setAvatarModalVisible(true);
  };

  const closeAvatarSelection = () => {
    setAvatarModalVisible(false);


  };


  useEffect(() => {
    const carregarPerfil = async () => {
      const profile = await loadPerfilLogado();
      if (profile) {
          setSelectedAvatar(expressionImages.avatar[profile.avatar]);
          setAge(profile.age);
          setInputName(profile.name);
          setAvatarName(profile.avatar)
          setUser(profile);
          setGraficosFases('facil');
          setGraficosTempo('facil');
      }
    };
    carregarPerfil();
  }, []);



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
          fasesCompletas: user?.fasesCompletas,
          tempoJogado: user?.tempoJogado
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

  useEffect(() =>{
    if (graficoFases == 'total'){
      const barData = [
        { value: 
          (user?.fasesCompletas.compareExpressions.dificil ?? 0)+
          (user?.fasesCompletas.compareExpressions.facil ?? 0)+
          (user?.fasesCompletas.compareExpressions.medio ?? 0), 
          label: 'Compare as Expressões', frontColor: '#177AD5' },
        { value: 
          (user?.fasesCompletas.selecioneExpressao.dificil ?? 0)+
          (user?.fasesCompletas.selecioneExpressao.facil ?? 0)+
          (user?.fasesCompletas.selecioneExpressao.medio ?? 0),
          label: 'Selecione a Expressão' },
        { value:
          (user?.fasesCompletas.escrevaExpressao.dificil ?? 0)+
          (user?.fasesCompletas.escrevaExpressao.facil ?? 0)+
          (user?.fasesCompletas.escrevaExpressao.medio ?? 0), 
          label: 'Escreva a Expressão', frontColor: '#177AD5' },
        { value:
          (user?.fasesCompletas.ligueExpressao.dificil ?? 0)+
          (user?.fasesCompletas.ligueExpressao.facil ?? 0)+
          (user?.fasesCompletas.ligueExpressao.medio ?? 0),
          label: 'Combine' },
        { value:
          (user?.fasesCompletas.encontreOErro.dificil ?? 0)+
          (user?.fasesCompletas.encontreOErro.facil ?? 0)+
          (user?.fasesCompletas.encontreOErro.medio ?? 0), 
          label: 'Encontre', frontColor: '#177AD5' },
        { value: 
          (user?.fasesCompletas.jogoDaMemoria.dificil ?? 0)+
          (user?.fasesCompletas.jogoDaMemoria.facil ?? 0)+
          (user?.fasesCompletas.jogoDaMemoria.medio ?? 0), 
          label: 'Jogo da Me' },
        { value: 
          (user?.fasesCompletas.piscaPica.dificil ?? 0)+
          (user?.fasesCompletas.piscaPica.facil ?? 0)+
          (user?.fasesCompletas.piscaPica.medio ?? 0), 
          label: 'Pisca Pisca', frontColor: '#177AD5' },
        { value: 
          (user?.fasesCompletas.sorriaEstaSendoFilmado.dificil ?? 0)+
          (user?.fasesCompletas.sorriaEstaSendoFilmado.facil ?? 0)+
          (user?.fasesCompletas.sorriaEstaSendoFilmado.medio ?? 0), 
          label: 'Sorria, você está' },
        { value: 
          (user?.fasesCompletas.chefinMandou.dificil ?? 0)+
          (user?.fasesCompletas.chefinMandou.facil ?? 0)+
          (user?.fasesCompletas.chefinMandou.medio ?? 0), 
          label: 'Chefis Mandou', frontColor: '#177AD5' },
        { value:
          (user?.fasesCompletas.imiteAExpressao.dificil ?? 0)+
          (user?.fasesCompletas.imiteAExpressao.facil ?? 0)+
          (user?.fasesCompletas.imiteAExpressao.medio ?? 0), 
          label: 'Imite a Expre' },
      ];

      setDadosFases(barData);
    
    } else {
      const barData = [
        { value:
          user?.fasesCompletas.compareExpressions[graficoFases] ?? 0,
          label: 'Compare as Expressões', frontColor: '#177AD5' },
        { value: 
          user?.fasesCompletas.selecioneExpressao[graficoFases] ?? 0,
          label: 'Selecione a Expressão' },
        { value:
          user?.fasesCompletas.escrevaExpressao[graficoFases] ?? 0,
          label: 'Escreva a Expressão', frontColor: '#177AD5' },
        { value:
          user?.fasesCompletas.ligueExpressao[graficoFases] ?? 0,
          label: 'Combine' },
        { value:
          user?.fasesCompletas.encontreOErro[graficoFases] ?? 0,
          label: 'Encontre', frontColor: '#177AD5' },
        { value: 
          user?.fasesCompletas.jogoDaMemoria[graficoFases] ?? 0,
          label: 'Jogo da Me' },
        { value: 
          user?.fasesCompletas.piscaPica[graficoFases] ?? 0,
          label: 'Pisca Pisca', frontColor: '#177AD5' },
        { value: 
          user?.fasesCompletas.sorriaEstaSendoFilmado[graficoFases] ?? 0,
          label: 'Sorria, você está' },
        { value: 
          user?.fasesCompletas.chefinMandou[graficoFases] ?? 0,
          label: 'Chefis Mandou', frontColor: '#177AD5' },
        { value:
          user?.fasesCompletas.imiteAExpressao[graficoFases] ?? 0,
          label: 'Imite a Expre' },
      ];

      
      setDadosFases(barData);
    }
  },[graficoFases])

  useEffect(() =>{
    if (graficoTempo === 'total'){
      const barData = [
        { value: 
          (user?.tempoJogado.compareExpressions.dificil ?? 0)+
          (user?.tempoJogado.compareExpressions.facil ?? 0)+
          (user?.tempoJogado.compareExpressions.medio ?? 0), 
          label: 'Compare as Expressões', frontColor: '#177AD5' },
        { value: 
          (user?.tempoJogado.selecioneExpressao.dificil ?? 0)+
          (user?.tempoJogado.selecioneExpressao.facil ?? 0)+
          (user?.tempoJogado.selecioneExpressao.medio ?? 0),
          label: 'Selecione a Expressão' },
        { value:
          (user?.tempoJogado.escrevaExpressao.dificil ?? 0)+
          (user?.tempoJogado.escrevaExpressao.facil ?? 0)+
          (user?.tempoJogado.escrevaExpressao.medio ?? 0), 
          label: 'Escreva a Expressão', frontColor: '#177AD5' },
        { value:
          (user?.tempoJogado.ligueExpressao.dificil ?? 0)+
          (user?.tempoJogado.ligueExpressao.facil ?? 0)+
          (user?.tempoJogado.ligueExpressao.medio ?? 0),
          label: 'Combine' },
        { value:
          (user?.tempoJogado.encontreOErro.dificil ?? 0)+
          (user?.tempoJogado.encontreOErro.facil ?? 0)+
          (user?.tempoJogado.encontreOErro.medio ?? 0), 
          label: 'Encontre', frontColor: '#177AD5' },
        { value: 
          (user?.tempoJogado.jogoDaMemoria.dificil ?? 0)+
          (user?.tempoJogado.jogoDaMemoria.facil ?? 0)+
          (user?.tempoJogado.jogoDaMemoria.medio ?? 0), 
          label: 'Jogo da Me' },
        { value: 
          (user?.tempoJogado.piscaPica.dificil ?? 0)+
          (user?.tempoJogado.piscaPica.facil ?? 0)+
          (user?.tempoJogado.piscaPica.medio ?? 0), 
          label: 'Pisca Pisca', frontColor: '#177AD5' },
        { value: 
          (user?.tempoJogado.sorriaEstaSendoFilmado.dificil ?? 0)+
          (user?.tempoJogado.sorriaEstaSendoFilmado.facil ?? 0)+
          (user?.tempoJogado.sorriaEstaSendoFilmado.medio ?? 0), 
          label: 'Sorria, você está' },
        { value: 
          (user?.tempoJogado.chefinMandou.dificil ?? 0)+
          (user?.tempoJogado.chefinMandou.facil ?? 0)+
          (user?.tempoJogado.chefinMandou.medio ?? 0), 
          label: 'Chefis Mandou', frontColor: '#177AD5' },
        { value:
          (user?.tempoJogado.imiteAExpressao.dificil ?? 0)+
          (user?.tempoJogado.imiteAExpressao.facil ?? 0)+
          (user?.tempoJogado.imiteAExpressao.medio ?? 0), 
          label: 'Imite a Expre' },
      ];

      setDadosTempo(barData);
    
    } else {
      const barData = [
        { value: 
          user?.tempoJogado.compareExpressions[graficoTempo] ?? 0,
          label: 'Compare as Expressões', frontColor: '#177AD5' },
        { value: 
          user?.tempoJogado.selecioneExpressao[graficoTempo] ?? 0,
          label: 'Selecione a Expressão' },
        { value:
          user?.tempoJogado.escrevaExpressao[graficoTempo] ?? 0,
          label: 'Escreva a Expressão', frontColor: '#177AD5' },
        { value:
          user?.tempoJogado.ligueExpressao[graficoTempo] ?? 0,
          label: 'Combine' },
        { value:
          user?.tempoJogado.encontreOErro[graficoTempo] ?? 0,
          label: 'Encontre', frontColor: '#177AD5' },
        { value: 
          user?.tempoJogado.jogoDaMemoria[graficoTempo] ?? 0,
          label: 'Jogo da Me' },
        { value: 
          user?.tempoJogado.piscaPica[graficoTempo] ?? 0,
          label: 'Pisca Pisca', frontColor: '#177AD5' },
        { value: 
          user?.tempoJogado.sorriaEstaSendoFilmado[graficoTempo] ?? 0,
          label: 'Sorria, você está' },
        { value: 
          user?.tempoJogado.chefinMandou[graficoTempo] ?? 0,
          label: 'Chefis Mandou', frontColor: '#177AD5' },
        { value:
          user?.tempoJogado.imiteAExpressao[graficoTempo] ?? 0,
          label: 'Imite a Expre' },
      ];

      setDadosTempo(barData);
    }
  },[graficoTempo])

  return (
    <View style={styles.container}>

      <SpeechText style={{}} text={'Crie um perfil, você tem que selecionar um avatar, inserir nome e idade'} />

      <Title title='Perfil' />
      <View style={styles.buttonNavigat}>
        <TouchableOpacity style={[styles.touchNavigat, { borderTopLeftRadius: 40 }, modo ? null : styles.actived]} onPress={() => setModo(false)}>
          <FontAwesome name="user" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.touchNavigat, { borderBottomLeftRadius: 40 }, modo ? styles.actived : null]} onPress={() => setModo(true)}>
          <FontAwesome name="gear" size={40} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: width }} showsVerticalScrollIndicator={false}>
        <View style={styles.game}>
          {!modo ?
            <View style={{ width: '100%' }}>
              <View style={{ width: width - 30, backgroundColor: 'white', borderRadius: 20, elevation: 5, alignItems: 'center', marginBottom: 20, flexDirection: 'row' }}>
                <View style={{ width: '30%' }}>
                  {selectedAvatar && <Image source={selectedAvatar} style={styles.avatarSelected} />}

                </View>
                <View style={{ flexDirection: 'column', width: '70%' }}>
                  <Text style={{ fontSize: 32, color: 'gray' }}>{user?.name}</Text>
                  <Text style={{ fontSize: 24 }}>{user?.age} anos</Text>
                </View>
              </View>

              <View style={{ width: width - 30, backgroundColor: 'white', borderRadius: 20, elevation: 5, alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 24, color: 'gray' }}>Fases Completas</Text>
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                  <TouchableOpacity style={[styles.butGraf, graficoFases === 'total' ? styles.actived : null]} onPress={() => setGraficosFases('total')}>
                    <Text style={styles.textBtnGraf}>Total</Text>
                  </TouchableOpacity >
                  <TouchableOpacity style={[styles.butGraf, graficoFases === 'facil' ? styles.actived : null]} onPress={() => setGraficosFases('facil')}>
                    <Text style={styles.textBtnGraf}>Fácil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.butGraf, graficoFases === 'medio' ? styles.actived : null]} onPress={() => setGraficosFases('medio')}>
                    <Text style={styles.textBtnGraf}>Médio</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.butGraf, graficoFases === 'dificil' ? styles.actived : null]} onPress={() => setGraficosFases('dificil')}>
                    <Text style={styles.textBtnGraf}>Difícil</Text>
                  </TouchableOpacity>

                </View>

                <View style={{ width: width - 60, height: 'auto' }}>
                  <BarChart

                    barWidth={22}
                    noOfSections={4}
                    barBorderRadius={4}
                    frontColor="lightgray"
                    data={dadosFases}
                    yAxisThickness={0}
                    xAxisThickness={0}
                  />

                </View>
              </View>
              <View style={{ width: width - 30, backgroundColor: 'white', borderRadius: 20, elevation: 5, alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 24, color: 'gray' }}>Tempo Jogado</Text>
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                  <TouchableOpacity style={[styles.butGraf, graficoTempo === 'total' ? styles.actived : null]} onPress={() => setGraficosTempo('total')}>
                    <Text style={styles.textBtnGraf}>Total</Text>
                  </TouchableOpacity >
                  <TouchableOpacity style={[styles.butGraf, graficoTempo === 'facil' ? styles.actived : null]} onPress={() => setGraficosTempo('facil')}>
                    <Text style={styles.textBtnGraf}>Fácil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.butGraf, graficoTempo === 'medio' ? styles.actived : null]} onPress={() => setGraficosTempo('medio')}>
                    <Text style={styles.textBtnGraf}>Médio</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.butGraf, graficoTempo === 'dificil' ? styles.actived : null]} onPress={() => setGraficosTempo('dificil')}>
                    <Text style={styles.textBtnGraf}>Difícil</Text>
                  </TouchableOpacity>

                </View>
                <View style={{ width: width - 60, height: 'auto' }}>
                  <BarChart

                    barWidth={22}
                    noOfSections={4}
                    barBorderRadius={4}
                    frontColor="lightgray"
                    data={dadosTempo}
                    yAxisThickness={0}
                    xAxisThickness={0}
                  />

                </View>
              </View>
              <View style={{ width: width - 30, backgroundColor: 'white', borderRadius: 20, elevation: 5, marginBottom: 20, padding: 10 }}>
                <Text style={{ color: 'gray', fontSize: 18 }}>Data de Criação: {user?.dataCriacao}</Text>
              </View>
            </View>
            ://Alteração de tela
            <View>
              <View style={{ alignItems: 'center', marginBottom: 20, padding: 5 }}>
                <TouchableOpacity onPress={openAvatarSelection} style={styles.avatarButton}>
                  {selectedAvatar ? (
                    <Image source={selectedAvatar} style={styles.avatarSelected} />
                  ) : (
                    <Ionicons name="ios-add" size={60} color="#888" />
                  )}
                </TouchableOpacity>
              </View>
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

              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', alignItems: 'center' }}>
                  <TouchableOpacity onPress={deleteProfile} style={styles.buttonConfig}>
                    <Ionicons name="trash-outline" size={35} color="red" />
                  </TouchableOpacity>

                </View>
                <View style={{ width: '50%', alignItems: 'center' }}>

                  <TouchableOpacity onPress={createProfile} style={styles.buttonConfig}>
                    <Text style={{ color: 'purple' }}>Salvar Alterações</Text>
                  </TouchableOpacity>

                </View>


              </View>



              {feedback && <Text style={{ color: 'red', position: 'absolute', bottom: 0 }}>{feedback}</Text>}
            </View>
          }


        </View>
      </ScrollView>
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
    marginTop: 50,
    justifyContent: 'center',
    marginBottom: 80,
    marginHorizontal: 15,

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
    elevation: 5,
    borderColor: '#ccc',
    borderRadius: 20,
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
    fontSize: 24,
    color: '#888',
  },
  slider: {
    width: 300,
    height: 40,
  },

  buttonNavigat: {
    width: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    position: 'absolute',
    right: 0,
    top: height / 2 - 75,
    flexDirection: 'column',
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    elevation: 5,
    zIndex: 999,
  },

  touchNavigat: {
    height: 75,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center'
  },

  actived: {
    backgroundColor: '#F6BDFF'
  },

  butGraf: {
    width: '20%',
    padding: 4,
    backgroundColor: 'white',
    elevation: 2,
    alignItems: 'center'

  },

  textBtnGraf: {
    fontSize: 18,
  }
});
