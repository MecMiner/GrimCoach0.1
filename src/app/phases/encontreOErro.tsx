import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, ImageBackground, Animated } from 'react-native';
import expressionImages from './expressionImages';
import expressionName from './expressionName';
import SuccessModal from '../modal/sucess';
import SpeechText from '../components/SpeechText';
import Title from '../components/title';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Correct from '../modal/Animate';
import StatusGame from '../components/StatusGame';


export default function CompareExpressions() {
  const [respost, setRespost] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]); // 4 opções de emoção
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Estado para controlar a visibilidade da modal de sucesso
  const [animated, setAnimated] = useState(false);
  const [current, setCurrent] = useState<number>(1);

  const generateRandomOptions = (allEmotions: string[], correctEmotion: string, numOptions: number) => {
    const options = [correctEmotion];

    while (options.length < numOptions) {
      const randomEmotion = allEmotions[Math.floor(Math.random() * allEmotions.length)];

      if (!options.includes(randomEmotion)) {
        options.push(randomEmotion);
      }
    }

    return shuffleArray(options); // Embaralha as opções
  };

  const shuffleArray = (array: string[]) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };


  useEffect(() => {

    const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];
    const allImages = [randomEmotion]

    while (allImages.length < 12) {
      const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];

      if (!allImages.includes(randomEmotion)) {
        for (let index = 0; index < 11; index++) {
          allImages.push(randomEmotion);
        }
      }
    }
    setOptions(shuffleArray(allImages))
    setRespost(randomEmotion);

  }, []);



  const compare = (index: number) => {
    if (options[index] == respost) {
      setAnimated(true)
    }
  }

  const resetGame = () => {
    setAnimated(false)

    const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];
    const allImages = [randomEmotion]

    while (allImages.length < 12) {
      const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];

      if (!allImages.includes(randomEmotion)) {
        for (let index = 0; index < 11; index++) {
          allImages.push(randomEmotion);
        }
      }
    }
    setOptions(shuffleArray(allImages))
    setRespost(randomEmotion);


  }

  const closeSuccessModal = () => {
    // Fecha a modal de sucesso
    setIsSuccessModalVisible(false);

  };



  return (
    <View style={styles.container}>
      <Correct isVisible={animated} onAnimationFinish={() => resetGame()} />
      <SpeechText style={{}} text={'Encontre a expressão isolada'} />
      <StatusGame atual={current} total={5} />

      <View style={styles.game}>
      <View style={{ flexDirection: 'row', marginBottom: 30 }}>
        <Title title='Econtre o Impostor' />
      </View>
        <View style={styles.grid}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card]}
              onPress={() => compare(index)}
              activeOpacity={0.7}
            >
              <Image source={expressionImages.facil[item]} style={styles.image} />

            </TouchableOpacity>
          ))}

          <SuccessModal isVisible={isSuccessModalVisible} onClose={() => { }} />
        </View>
        <Text style={styles.feedback}>{feedback}</Text>
      </View>
      <SuccessModal isVisible={isSuccessModalVisible} onClose={closeSuccessModal} />
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
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
