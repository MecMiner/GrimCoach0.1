import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, ImageBackground, Animated } from 'react-native';
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
import { Dificuldade } from '../../utils/utils';


export default function CompareExpressions() {
  const [respost, setRespost] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [options, setOptions] = useState<string>(''); // 4 opções de emoção
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Estado para controlar a visibilidade da modal de sucesso
  const [animated, setAnimated] = useState(false);
  const [current, setCurrent] = useState<number>(1);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')

  const { dif } = useLocalSearchParams();

  const diff = Array.isArray(dif) ? dif[0] : dif;

  useEffect(() => {
    if (diff === 'facil' || diff === 'medio' || diff === 'dificil') {
      setDificuldade(diff);
    }
  }, [diff]);



  useEffect(() => {
    const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];
    const randomEmotion2 = expressionName[Math.floor(Math.random() * expressionName.length)];

    setOptions(randomEmotion);
    setRespost(randomEmotion2);
  }, []);



  const compare = (isTrue: boolean) => {
    if (isTrue) {
      if (options === respost) {
        if (current < 5) {
          setAnimated(true)
        } else {
          setIsSuccessModalVisible(true)
        }
      } else {
        setFeedback('Infelimente você errou essa')
      }
    } else {
      if (options !== respost) {
        if (current < 5) {
          setAnimated(true)
        } else {
          setIsSuccessModalVisible(true)
        }
      } else {
        setFeedback('Infelimente você errou essa')
      }
    }
  }

  const resetGame = () => {
    const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];
    const randomEmotion2 = expressionName[Math.floor(Math.random() * expressionName.length)];
    setCurrent(current + 1);
    setAnimated(false)
    setOptions(randomEmotion);
    setRespost(randomEmotion2);
  }

  const closeSuccessModal = () => {
    // Fecha a modal de sucesso
    setIsSuccessModalVisible(false);

  };



  return (
    <View style={styles.container}>
      <Title title='Compare as Expressões' />
      <Correct isVisible={animated} onAnimationFinish={() => resetGame()} />
      <StatusGame atual={current} total={5} />
      <SpeechText style={{}} text={'Informe se a figuras são iguais ou diferentes'} />
      <StatusBar backgroundColor={colors.backGroundTitle} />

      <View style={styles.game}>
        <View style={{ flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{flexDirection : 'row'}}>
          <View style={styles.viewImage}>
            <Image style={styles.image} source={expressionImages[dificuldade][options]} />
          </View>

          <View style={styles.viewImage}>
            <Image style={styles.image} source={expressionImages[dificuldade][respost]} />
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
        <SuccessModal isVisible={isSuccessModalVisible} onClose={closeSuccessModal} />
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
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    borderRadius: 20,
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
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