import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Button, StyleSheet, Text, ImageBackground, TouchableWithoutFeedback, ImageSourcePropType } from 'react-native';
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
import Correct from '../../modal/Animate';

export default function LigueExpressao() {
  const [respost, setRespost] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]); // 4 opções de emoção
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Opção selecionada
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Estado para controlar a visibilidade da modal de sucesso
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [atual, setAtual] = useState<number>(0);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')
  const [imagens, setImagens] = useState<ImageSourcePropType[]>([]);
  const [imagenSelected, setImagenSelected] = useState<ImageSourcePropType>();
  const [animated, setAnimated] = useState(false);


  
const TOTAL_ROUNDS = 3;

  const { dif } = useLocalSearchParams();

  const diff = Array.isArray(dif) ? dif[0] : dif;

  useEffect(() => {
    if (diff === 'facil' || diff === 'medio' || diff === 'dificil') {
      setDificuldade(diff);
    }
  }, [diff]);


  const atualizarImages = () => {
    const expresssionDiff = expressionImages[dificuldade]
    const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];

    // Gere 4 opções de emoção
    const randomOptions = generateRandomOptions(expressionName, randomEmotion, 4);
    setOptions(randomOptions);
    setRespost(shuffleArray(randomOptions));

    const images:ImageSourcePropType[] = []
    randomOptions.map((e) => {
      if (expresssionDiff[e] && expresssionDiff[e].length > 0){
        
        const randomIndex = Math.floor(Math.random() * expresssionDiff[e].length);
        images.push(expressionImages[dificuldade][e][randomIndex])
      }
    })

    setImagens(images);
  }

  useEffect(() => {

    atualizarImages();
  }, [dificuldade]);

  useEffect(() => {
    if (selectedImage != null && selectedOption != null) {
      if (selectedImage != null && selectedOption != null)
      if (selectedOption === selectedImage) {

        setFeedback('');
        const novoArrayOption = options.filter(opcao => opcao !== selectedImage);
        const novoArrayRespost = respost.filter(opcao => opcao !== selectedImage);
        const novoArrayImagens = imagens.filter(opcao => opcao !== imagenSelected);

        if(!novoArrayImagens.length){
          setAnimated(true);

        } else {
          setImagens(novoArrayImagens);
          setRespost(novoArrayRespost);
          setOptions(novoArrayOption);
        }

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
    const current = atual + 1;
    setAnimated(false);

    if (current < TOTAL_ROUNDS){
      setAtual (current);
      atualizarImages();

    } else {
      setIsSuccessModalVisible(true);
    }
  } 



  return (
    <View style={styles.container}>
      <Title title='Combine' />
      <StatusBar backgroundColor={colors.backGroundTitle} />
      <StatusGame atual={atual + 1} total={TOTAL_ROUNDS} />
      <SpeechText style={{}} text={'Selecione a expressão de acordo com a imagem'} />
      <Correct isVisible={animated} onAnimationFinish={resetGame}/>
      <View style={styles.game}>
        <View style={styles.row}>
          <View style={styles.column}>
            {options.map((e, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                {/* Exibir as imagens */}
                  <TouchableOpacity style={[styles.boxOption, selectedImage === e && styles.optionSelected]} onPress={() => {setSelectedImage(e); setImagenSelected(imagens[index])}}>
                    <Image
                      source={imagens[index]}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
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

        <SuccessModal isVisible={isSuccessModalVisible} nextPag={`/phases/jogoDaMemoria/${diff}`}/>
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
