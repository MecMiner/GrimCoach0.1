import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground } from 'react-native';
import expressionImages from './expressionImages'; // Certifique-se de que a importação está correta
import expressionName from './expressionName'; // Certifique-se de que a importação está correta
import SuccessModal from '../modal/sucess';
import StatusGame from '../components/StatusGame';
import SpeechText from '../components/SpeechText';
import Title from '../components/title';
import { StatusBar } from 'expo-status-bar';
import ButtonGame from '../components/ButtonGame';
import Correct from '../modal/Animate';


export default function SelecioneExpressao() {
  const [current, setCurrent] = useState<number>(1);
  const [feedback, setFeedback] = useState<string>('');
  const [correctEmotion, setCorrectEmotion] = useState<string>(''); // Emoção correta
  const [options, setOptions] = useState<string[]>([]); // 4 opções de emoção
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Estado para controlar a visibilidade da modal de sucesso
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Escolhe aleatoriamente a emoção correta
    const randomIndex = Math.floor(Math.random() * expressionName.length);
    const randomEmotion = expressionName[randomIndex];

    // Define a imagem aleatória com base na emoção correta
    setCorrectEmotion(randomEmotion.toLowerCase());

    // Gere 4 opções de emoção, incluindo a correta
    const randomOptions = generateRandomOptions(expressionName, randomEmotion, 4);
    setOptions(randomOptions);
  }, []);

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

  const checkEmotion = (selectedEmotion: string) => {
    if (selectedEmotion === correctEmotion) {
      sucess();
    } else {
      setFeedback('Tente novamente, a emoção escolhida não está correta.');
    }
  };

  const sucess = () => {
    setCurrent(current + 1);
    if (current < 5) {
      setAnimate(true);
      resetPhase();
    } else {
      setIsSuccessModalVisible(true);
    }
  }

  const closeSuccessModal = () => {
    // Fecha a modal de sucesso
    setIsSuccessModalVisible(false);

    resetPhase();
  };


  const resetPhase = () => {
    // Limpa o campo de entrada e feedback
    setFeedback('');

    // Escolhe aleatoriamente a emoção correta novamente
    const randomIndex = Math.floor(Math.random() * expressionName.length);
    const randomEmotion = expressionName[randomIndex];
    setCorrectEmotion(randomEmotion.toLowerCase());

    // Gera 4 opções de emoção, incluindo a correta
    const randomOptions = generateRandomOptions(expressionName, randomEmotion, 4);
    setOptions(randomOptions);
  };

  return (
    <View style={styles.container}>
      <Correct isVisible={animate} onAnimationFinish={() => setAnimate(false)}/>
      <SpeechText style={{}} text={'Selecione a expressão de acordo com a imagem'} />

      <StatusGame atual={current} total={5} />
      
      <View style={styles.game}>
      <View style={{ flexDirection: 'row', marginBottom: 30 }}>
        <Title title='Selecione a Expressão' />
      </View>

        {expressionImages.facil[correctEmotion] && (
          <View style={styles.viewImage}>
            <Image
              source={expressionImages.facil[correctEmotion]}
              style={styles.image}
            />
          </View>
        )}


        <View style={styles.buttonGroup}>
          <View style={styles.buttonColumn}>
            {options.slice(0, 2).map((option, index) => (
              <ButtonGame
                style={styles.button}
                key={index} onPress={() => checkEmotion(option)}
                text={option.toUpperCase()}
              />
            ))}
          </View>
          <View style={styles.buttonColumn}>
            {options.slice(2, 4).map((option, index) => (
              <ButtonGame
                style={styles.button}
                key={index} onPress={() => checkEmotion(option)}
                text={option.toUpperCase()}
              />
            ))}
          </View>
        </View>

        <Text style={styles.feedback}>{feedback}</Text>
        <StatusBar style='dark' />
        <SuccessModal isVisible={isSuccessModalVisible} onClose={closeSuccessModal} />
      </View>
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
    justifyContent: 'center'
  },

  viewImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 250,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    marginBottom: 30,

  },

  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  feedback: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row', // Organize os botões em uma linha
    justifyContent: 'center', // Centralize os botões na linha
    marginTop: 30,
  },
  buttonColumn: {
    flex: 1, // Faça cada coluna de botões ocupar metade do espaço disponível
    marginHorizontal: 10, // Adicione margem horizontal entre as colunas
  },
  button: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    borderWidth: 1,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
