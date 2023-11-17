import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, ImageSourcePropType } from 'react-native';
import expressionImages from '../../config/expressionImages';
import expressionName from '../../config/expressionName';
import SuccessModal from '../../modal/sucess';
import SpeechText from '../../components/SpeechText';
import Title from '../../components/title';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Correct from '../../modal/Animate';
import StatusGame from '../../components/StatusGame';
import { StatusBar } from 'expo-status-bar';
import colors from '../../config/colors';
import { useLocalSearchParams } from 'expo-router';
import { Dificuldade, loadPerfilLogado, salvarAvanco } from '../../utils/utils';
import { PersonData } from '../../components/types';

const TOTAL_ROUNDS = 5;



export default function CompareExpressions() {
  const [respost, setRespost] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [options, setOptions] = useState<string>(''); // 4 opções de emoção
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Estado para controlar a visibilidade da modal de sucesso
  const [animated, setAnimated] = useState(false);
  const [current, setCurrent] = useState<number>(1);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil');
  const [optionsImage, setOptionsImage] = useState<ImageSourcePropType>();
  const [respostImage, setRespostImage] = useState<ImageSourcePropType>();
  const [user,setUser] = useState<PersonData>();
  const tempoRef = useRef(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      tempoRef.current += 1;
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const carregarPerfil = async () => {
      const profile = await loadPerfilLogado();
      if (profile) {
        setUser(profile);
      }
    };
  
    carregarPerfil();
  }, []); //Carreganmento de Perfil do Usuário

  const salvarProgresso = async () => {
    try {
      await new Promise<void>((resolve) => {
        setUser((prevUser) => {
          if (prevUser) {
            const updatedUser = { ...prevUser };
  
            // Adiciona pontos
            updatedUser.pontos += 10;
  
            // Marca a fase como concluída
            updatedUser.fasesCompletas.compareExpressions[dificuldade] += 1;
  
            // Registra o tempo gasto
            updatedUser.tempoJogado.compareExpressions[dificuldade] += tempoRef.current;
  
            // Atualiza o estado e resolve a Promise quando a atualização estiver completa
            resolve();
            return updatedUser;
          }
  
          return prevUser;
        });
      });
  
      // Depois que a Promise é resolvida, chama salvarAvanco
      if (user) {
        salvarAvanco(user);
      }
    } catch (error) {
      console.error('Erro ao salvar o progresso:', error);
    }
  };


  const { dif } = useLocalSearchParams();

  const diff = Array.isArray(dif) ? dif[0] : dif;

  useEffect(() => {
    if (diff === 'facil' || diff === 'medio' || diff === 'dificil') {
      setDificuldade(diff);
    }
  }, [diff]);


  function atualizarImages() {
    const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];
  
    const optionsImg = expressionImages[dificuldade][randomEmotion];
    if (optionsImg && optionsImg.length) {
      setOptionsImage(optionsImg[Math.floor(Math.random() * optionsImg.length)]);
    }
  
    const randomEmotion2 = expressionName[Math.floor(Math.random() * expressionName.length)];
  
    const respostImg = expressionImages[dificuldade][randomEmotion2];
    if (respostImg && respostImg.length) {
      setRespostImage(respostImg[Math.floor(Math.random() * respostImg.length)]);
    }
  
    setOptions(randomEmotion);
    setRespost(randomEmotion2);
  }
  

  useEffect(() => {

    atualizarImages();

  }, [dificuldade]);



  const compare = (isTrue: boolean) => {
    if (isTrue) {
      if (options === respost) {
          setAnimated(true)
      } else {
        setFeedback('Infelimente você errou essa')
      }
    } else {
      if (options !== respost) {
        setAnimated(true)
      } else {
        setFeedback('Infelimente você errou essa')
      }
    }
  }

  const resetGame = () => {
    setAnimated(false);
    if (current < TOTAL_ROUNDS) {
      
      atualizarImages();
  
      setCurrent(current + 1);

      setFeedback('');
    } else {
      setIsSuccessModalVisible(true)
      salvarProgresso();
    }

  }


  


  return (
    <View style={styles.container}>
      <Title title='Compare as Expressões' />
      <Correct isVisible={animated} onAnimationFinish={() => resetGame()} />
      <StatusGame atual={current} total={TOTAL_ROUNDS} />
      <SpeechText style={{}} text={'Informe se a figuras são iguais ou diferentes'} />
      <StatusBar backgroundColor={colors.backGroundTitle} />

      <View style={styles.game}>
        <View style={{ flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.viewImage}>
             {optionsImage && <Image style={styles.image} source={optionsImage} />}
            </View>

            <View style={styles.viewImage}>
            {respostImage && <Image style={styles.image} source={respostImage} />}
            </View>

          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 40 }}>
            <TouchableOpacity style={[styles.viewCompare, { marginRight: 20 }]} onPress={() => compare(true)}>
              <MaterialCommunityIcons name="equal" size={60} color="black" />
              <Text>Igual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.viewCompare, { marginLeft: 20 }]} onPress={() => compare(false)}>
              <MaterialCommunityIcons name="not-equal-variant" size={60} color="black" />
              <Text>Diferente</Text>
            </TouchableOpacity>

          </View>
        </View>
        <Text style={styles.feedback}>{feedback}</Text>
        <SuccessModal isVisible={isSuccessModalVisible} nextPag={`/selectLevel`}/>
      </View>
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
    justifyContent: 'center',
  },

  button: {
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewImage: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 20,
    marginVertical: 20,
    elevation: 5,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },

  viewCompare: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 120,
    height: 120,
    borderRadius: 60,
    elevation: 5,
  },
  feedback: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});
