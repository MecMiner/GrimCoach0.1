import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel from './components/phasesCarousel';
import Title from './components/title';
import { StatusBar } from 'expo-status-bar';
import { PersonData, Token } from './components/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpeechText from './components/speechText';
import FabButton from './components/FabButton';
import { router } from 'expo-router';


export default function SelectLevel() {
  const [dificuldade, setDificuldade] = useState('facil');
  const [user, setUser] = useState<PersonData | null>(null);

  const loadProfileData = async () => {
    try {
      const response = await AsyncStorage.getItem('@grimcoach:token');
      const token: Token | null = response ? JSON.parse(response) : null;
      if (token) {
        await AsyncStorage.getItem('@grimcoach:profile').then((data) => {
          if (data) {
            const profiles: PersonData[] = JSON.parse(data);
            const profile = profiles.find((e) => e.id === token.hash);
            if (profile) {
              setUser(profile);
              console.log(profile)
            }
          }
        })
      } else {
        console.log('Token nao encontrado')
      }

    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []); // Executa somente uma vez na montagem


  const handleSelectDificuldade = (novaDificuldade: string) => {
    setDificuldade(novaDificuldade);
    console.log(dificuldade);
  };

  const botaoFacilStyle = dificuldade === 'facil' ? styles.botaoSelecionado : styles.botao;
  const botaoMedioStyle = dificuldade === 'medio' ? styles.botaoSelecionado : styles.botao;
  const botaoDificilStyle = dificuldade === 'dificil' ? styles.botaoSelecionado : styles.botao;

  return (
    <View style={styles.container}>
      <View style={styles.game}>
        <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
          <SpeechText style={{}} text={'Selecione uma Fase'} />
          <Title title='Selecione uma Fase' />
        </View>
        <View >
          <Carousel />
        </View>

        <View style={styles.difficut}>
          <TouchableOpacity
            style={[botaoFacilStyle, { borderTopLeftRadius: 30, borderBottomLeftRadius: 30 }]}
            onPress={() => handleSelectDificuldade('facil')}
          >
            <Text style={styles.buttonText}>Fácil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[botaoMedioStyle, { borderRadius: 0 }]}
            onPress={() => handleSelectDificuldade('medio')}
          >
            <Text style={styles.buttonText}>Médio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[botaoDificilStyle, { borderTopRightRadius: 30, borderBottomRightRadius: 30 }]}
            onPress={() => handleSelectDificuldade('dificil')}
          >
            <Text style={styles.buttonText}>Difícil</Text>
          </TouchableOpacity>

        </View>

      </View>
      <FabButton back={() => { router.replace('/') }} style={styles.fabButton} avatar={user ? user.avatar : 'dragao'} />
      <StatusBar hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8EBFF',
    alignItems: 'center',
  },

  fabButton: {
    right: 35,
    bottom: 70,
  },

  game: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50
  },

  difficut: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  botao: {
    marginTop: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    width: 100,
    height: 40,
    elevation: 5,
  },

  botaoSelecionado: {
    marginTop: 20,
    justifyContent: 'center',
    backgroundColor: '#E99DFF',
    alignItems: 'center',
    width: 100,
    height: 40,
    elevation: 5,
  },

  buttonText: {
    fontSize: 18,
    color: 'purple',
    textAlign: 'center',
    lineHeight: 30,
  },
});
