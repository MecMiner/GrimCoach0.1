import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, StyleSheet, Text } from 'react-native';
import expressionImages from './expressionImages';
import expressionName from './expressionName';
import stringSimilarity from 'string-similarity';
import SuccessModal from '../modal/sucess';
import { StatusBar } from 'expo-status-bar';
import ButtonGame from '../components/ButtonGame';
import SpeechText from '../components/speechText';
import Title from '../components/title';
import StatusGame from '../components/StatusGame';
import Correct from '../modal/Animate';



export default function EscrevaExpressao() {
  const [inputEmotion, setInputEmotion] = useState<string>(''); //Inicializar Input de Emoçao
  const [feedback, setFeedback] = useState<string>(''); //Inicializa feedeback
  const [expression, setExpression] = useState<string>(''); // Inicialize com uma emoção padrão
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState<boolean>(false); // Estado para controlar a visibilidade da modal de sucesso
  const [current, setCurrent] = useState<number>(0); //Inicial parte da fase em que esta
  const [usedExpressions, setUsedExpressions] = useState<string[]>([]);
  const [animated, setAnimated] = useState<boolean>(false);


  useEffect(() => {
    // Escolhe aleatoriamente uma emoção
    const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];

    // Define a imagem aleatória com base na emoção
    setExpression(randomEmotion.toLowerCase());
  }, []);

  const checkEmotion = () => {
    const userEmotion = inputEmotion.toLowerCase();

    // Verifica se a resposta do usuario esta correta ou próxima
    const similarities = expressionName.map((emotion) =>
      stringSimilarity.compareTwoStrings(emotion, userEmotion)
    );
    const maxSimilarity = Math.max(...similarities);
    const similarEmotionIndex = similarities.indexOf(maxSimilarity);


    if (maxSimilarity >= 1) {
      sucess();
    } else if (maxSimilarity > 0.5 && maxSimilarity < 1) {
      const similarEmotion = expressionName[similarEmotionIndex];
      setFeedback(`Você está perto! A emoção é ${similarEmotion}.`);
    } else {
      setFeedback('Tente novamente, não foi possível identificar a emoção.');
    }

  };

  const resetFase = () => {
    setAnimated(false);
    setInputEmotion(''); // Limpa o campo de entrada de emoção
    setFeedback(''); // Limpa o feedback
  
    if (usedExpressions.length < expressionName.length) {
      let randomEmotion;
      do {
        randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];
      } while (usedExpressions.includes(randomEmotion));
      
      setExpression(randomEmotion.toLowerCase()); // Define a nova emoção
      setUsedExpressions([...usedExpressions, randomEmotion]);
    } else {
      // Todas as expressões foram usadas, você pode reiniciar o jogo ou tomar outra ação aqui
    }
  
    setCurrent(current + 1);
  };

  const sucess = () => {
    setCurrent(current + 1)
    if (current === 4) {
      setIsSuccessModalVisible(true)
    } else {
      setAnimated(true);
    }


  }
  const closeSuccessModal = () => {


    setIsSuccessModalVisible(false);
  };


  return (
    <View style={styles.container}>
      <Correct isVisible={animated} onAnimationFinish={resetFase}/>
      <StatusGame atual={current} total={5} />
      <View style={{ flexDirection: 'row', marginTop: 30 }}>
        <SpeechText style={{}} text={'Digite a expressão que a imagem passsa'} />
        <Title title='Identifique a Expressão' />
      </View>
      <View style={styles.game}>
        {expressionImages.facil[expression] && (
          <View style={styles.viewImage}>
            <Image
              source={expressionImages.facil[expression]}
              style={styles.image}
            />
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Digite a emoção"
          placeholderTextColor="#888"
          value={inputEmotion}
          onChangeText={(text) => setInputEmotion(text)}
        />

        <ButtonGame onPress={checkEmotion} style={styles.button} text='Corrigir' />

        <Text style={styles.feedback}>{feedback}</Text>


        <SuccessModal isVisible={isSuccessModalVisible} onClose={closeSuccessModal} />
        <StatusBar hidden />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#C8EBFF',
  },

  game: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  animation: {
    position: 'absolute',
    bottom: 0,
    width: '100%', // Defina o tamanho desejado
    height: '100%',
  },

  backgroundStyle: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 250,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,

  },
  image: {
    width: 200,
    height: 200,
  },
  input: {
    width: 250,
    height: 40,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
    marginTop: 40,
  },
  feedback: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },

  button: {
    backgroundColor: 'white',
    marginTop: 40,
    elevation: 5,
    borderWidth: 1,
  }
});
