import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel from './components/PhasesCarousel';
import Title from './components/title';
import { StatusBar } from 'expo-status-bar';
import { PersonData } from './components/types';
import SpeechText from './components/SpeechText';
import FabButton from './components/FabButton';
import { router } from 'expo-router';
import colors from './config/colors';
import { Dificuldade, loadPerfilLogado } from './utils/utils';


export default function SelectLevel() {
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil');
  const [user, setUser] = useState<PersonData | null>(null);


  useEffect(() => {
    const carregarPerfil = async () => {
      const userLogado = await loadPerfilLogado();
      if (userLogado) {
        setUser(userLogado);
      }
    };
  
    carregarPerfil();
  }, []);


  const handleSelectDificuldade = (novaDificuldade: Dificuldade) => {
    setDificuldade(novaDificuldade);
    console.log(dificuldade);
  };

  const botaoFacilStyle = dificuldade === 'facil' ? styles.botaoSelecionado : styles.botao;
  const botaoMedioStyle = dificuldade === 'medio' ? styles.botaoSelecionado : styles.botao;
  const botaoDificilStyle = dificuldade === 'dificil' ? styles.botaoSelecionado : styles.botao;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.backGroundTitle} />
      <SpeechText style={{}} text={'Selecione uma Fase'} />
      <Title title='Selecione uma Fase' />
      <View style={styles.game}>
        <View >
          <Carousel dif={dificuldade} />
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
      <FabButton back={() => { router.replace('/selectProfile') }} style={styles.fabButton} avatar={user ? user.avatar : 'dragao'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backGroundApp,
    alignItems: 'center',
  },

  fabButton: {
    right: 35,
    bottom: 70,
  },

  game: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
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
