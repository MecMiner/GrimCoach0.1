import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, ImageSourcePropType, Animated } from 'react-native';
import expressionImages from '../../config/expressionImages';
import expressionName from '../../config/expressionName';
import SuccessModal from '../../modal/sucess';
import SpeechText from '../../components/SpeechText';
import Title from '../../components/title';
import Correct from '../../modal/Animate';
import StatusGame from '../../components/StatusGame';
import { StatusBar } from 'expo-status-bar';
import colors from '../../config/colors';
import { useLocalSearchParams } from 'expo-router';
import { Dificuldade, shuffleArray } from '../../utils/utils';


export default function CompareExpressions() {
  const [respost, setRespost] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]); // 4 opções de emoção
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Estado para controlar a visibilidade da modal de sucesso
  const [animated, setAnimated] = useState(false);
  const [current, setCurrent] = useState<number>(1);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')
  const [imagens, setImagens] = useState<ImageSourcePropType[]>([])

  const { dif } = useLocalSearchParams();

  const diff = Array.isArray(dif) ? dif[0] : dif;

  useEffect(() => {
    if (diff === 'facil' || diff === 'medio' || diff === 'dificil') {
      setDificuldade(diff);
    }
  }, [diff]);


  const atualizarImagens = () => {
    const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];
    const allOption = [randomEmotion]

    while (allOption.length < 12) {
      const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];

      if (!allOption.includes(randomEmotion)) {
        for (let index = 0; index < 11; index++) {
          allOption.push(randomEmotion);
        }
      }
    }

    const embaralhar = shuffleArray(allOption);
    const allImages: ImageSourcePropType[] = [];

    embaralhar.map((item) => {
      if(expressionImages[dificuldade][item].length){
        allImages.push(expressionImages[dificuldade][item][Math.floor(Math.random() * expressionImages[dificuldade][item].length)])
      }
    })
    setOptions(embaralhar)
    setImagens(allImages)
    setRespost(randomEmotion);
  }

  useEffect(() => {
    atualizarImagens();


  }, [dificuldade]);



  const compare = (index: number) => {
    if (options[index] == respost) {
      setAnimated(true)
    }
  }

  const resetGame = () => {
    setAnimated(false)

    if (current < 5) {
      atualizarImagens();
      setCurrent(current+1)

    } else {
      setIsSuccessModalVisible(true);
    }



  }

  const closeSuccessModal = () => {
    // Fecha a modal de sucesso
    setIsSuccessModalVisible(false);

  };



  return (
    <View style={styles.container}>
        <Title title='Econtre o Impostor' />
        <StatusBar backgroundColor={colors.backGroundTitle} />
      <Correct isVisible={animated} onAnimationFinish={() => resetGame()} />
      <SpeechText style={{}} text={'Encontre a expressão isolada'} />
      <StatusGame atual={current} total={5} />

      <View style={styles.game}>
        <View style={styles.grid}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card]}
              onPress={() => compare(index)}
              activeOpacity={0.7}
            >
              <Image source={imagens[index]} style={styles.image} />

            </TouchableOpacity>
          ))}

        </View>
        <Text style={styles.feedback}>{feedback}</Text>
      </View>
      <SuccessModal isVisible={isSuccessModalVisible} nextPag={`/phases/piscaPisca/${dificuldade}`} />
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
    marginTop: 40,
    alignItems: 'center',
  },
  feedback: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 120,
    height: 120,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    elevation: 5,
  },

  image: {
    width: 80,
    height: 80,
  },
});
