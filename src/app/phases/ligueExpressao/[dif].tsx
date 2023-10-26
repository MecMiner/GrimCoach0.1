import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Button, StyleSheet, Text, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import expressionImages from '../../config/expressionImages'; // Certifique-se de que a importação está correta
import expressionName from '../../config/expressionName'; // Certifique-se de que a importação está correta
import SuccessModal from '../../modal/sucess';
import SpeechText from '../../components/SpeechText';
import Title from '../../components/title';
import StatusGame from '../../components/StatusGame';
import { StatusBar } from 'expo-status-bar';
import colors from '../../config/colors';
import { Dificuldade, generateRandomOptions, shuffleArray } from '../../utils/utils';
import { useLocalSearchParams } from 'expo-router';

export default function LigueExpressao() {
  const [respost, setRespost] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]); // 4 opções de emoção
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Opção selecionada
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Estado para controlar a visibilidade da modal de sucesso
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [atual, setAtual] = useState<number>(1);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')

  const { dif } = useLocalSearchParams();

  const diff = Array.isArray(dif) ? dif[0] : dif;

  useEffect(() => {
    if (diff === 'facil' || diff === 'medio' || diff === 'dificil') {
      setDificuldade(diff);
    }
  }, [diff]);

  useEffect(() => {
    // Escolhe aleatoriamente a emoção correta
    const randomIndex = Math.floor(Math.random() * expressionName.length);
    const randomEmotion = expressionName[randomIndex];


    // Gere 4 opções de emoção, incluindo a correta
    const randomOptions = generateRandomOptions(expressionName, randomEmotion, 4);
    setOptions(randomOptions);
    setRespost(shuffleArray(randomOptions));
  }, []);

  useEffect(() => {
    if (selectedImage != null && selectedOption != null) {
      if (selectedImage != null && selectedOption != null)
      if (selectedOption === selectedImage) {

        setFeedback('');
        const novoArrayOption = options.filter(opcao => opcao !== selectedImage);
        const novoArrayRespost = respost.filter(opcao => opcao !== selectedImage);
        setRespost(novoArrayRespost);
        setOptions(novoArrayOption);
        setSelectedImage(null);
        setSelectedOption(null);
      } else {
        setSelectedImage(null);
        setSelectedOption(null);
        setFeedback('Infelizmente você errou')
      }
    }

  }, [selectedOption, selectedImage]);


  const closeSuccessModal = () => {
    // Fecha a modal de sucesso
    setIsSuccessModalVisible(false);

  };

  const resetGame = () => {
    const randomIndex = Math.floor(Math.random() * expressionName.length);
    const randomEmotion = expressionName[randomIndex];


    // Gere 4 opções de emoção, incluindo a correta
    const randomOptions = generateRandomOptions(expressionName, randomEmotion, 4);
    setOptions(randomOptions);
    setRespost(shuffleArray(randomOptions));
  }



  return (
    <View style={styles.container}>
      <Title title='Combine' />
      <StatusBar backgroundColor={colors.backGroundTitle} />
      <StatusGame atual={atual} total={3} />
      <SpeechText style={{}} text={'Selecione a expressão de acordo com a imagem'} />
      <View style={styles.game}>
        <View style={styles.row}>
          <View style={styles.column}>
            {options.map((e, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                {/* Exibir as imagens */}
                {expressionImages[dificuldade][e] && (
                  <TouchableOpacity style={[styles.boxOption, selectedImage === e && styles.optionSelected]} onPress={() => setSelectedImage(e)}>
                    <Image
                      source={expressionImages[dificuldade][e]}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
          <View style={styles.column}>
            {respost.map((e, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                {/* Exibir as imagens */}
                <TouchableOpacity style={[styles.boxOption, selectedOption === e && styles.optionSelected]} onPress={() => setSelectedOption(e)}>
                  <Text>{e.toUpperCase()}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

        </View>
        {/* Feedback para o usuário */}
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
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundStyle: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    margin: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    fontWeight: 'bold',
    color: 'blue', // Defina a cor desejada para o texto selecionado
  },
  feedback: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  boxOption: {
    height: 150,
    width: 150,
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10, // Defina o valor de elevação para adicionar sombreamento
  },



  optionSelected: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)', // Red com 50% de opacidade
  }
});