import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground, ImageSourcePropType } from 'react-native';
import expressionImages from '../../config/expressionImages'; // Certifique-se de que a importação está correta
import expressionName from '../../config/expressionName'; // Certifique-se de que a importação está correta
import SuccessModal from '../../modal/sucess';
import StatusGame from '../../components/StatusGame';
import SpeechText from '../../components/SpeechText';
import Title from '../../components/title';
import { StatusBar } from 'expo-status-bar';
import ButtonGame from '../../components/ButtonGame';
import Correct from '../../modal/Animate';
import colors from '../../config/colors';
import { useLocalSearchParams } from 'expo-router';
import { Dificuldade, generateRandomOptions, loadPerfilLogado, salvarAvanco, shuffleArray } from '../../utils/utils';
import { PersonData } from '../../components/types';


export default function SelecioneExpressao() {
  const [current, setCurrent] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [correctEmotion, setCorrectEmotion] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')
  const [image, setImage] = useState<ImageSourcePropType>()

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
            updatedUser.fasesCompletas.selecioneExpressao[dificuldade] += 1;
  
            // Registra o tempo gasto
            updatedUser.tempoJogado.selecioneExpressao[dificuldade] += tempoRef.current;
  
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

  const atualizarImages = () => {
    // Escolhe aleatoriamente a emoção correta
    const randomArrayEmotion = shuffleArray(expressionName)
    const randomEmotion = randomArrayEmotion[current]


    // Define a imagem aleatória com base na emoção correta
    setCorrectEmotion(randomEmotion.toLowerCase());

    // Gere 4 opções de emoção, incluindo a correta
    const randomOptions = generateRandomOptions(expressionName, randomEmotion, 4);
    setOptions(randomOptions);

    if (expressionImages[dificuldade][randomEmotion] && expressionImages[dificuldade][randomEmotion].length) {
      setImage(expressionImages[dificuldade][randomEmotion][Math.floor(Math.random() * expressionImages[dificuldade][randomEmotion].length)])
    }


  }

  useEffect(() => {

    atualizarImages();


  }, [dificuldade]);



  const checkEmotion = (selectedEmotion: string) => {
    if (selectedEmotion === correctEmotion) {
      setAnimate(true);
    } else {
      setFeedback('Tente novamente, a emoção escolhida não está correta.');
    }
  };


  const resetPhase = () => {
    setAnimate(false);
    if (current <= 4){
      setCurrent(current + 1)
      setFeedback('');
      atualizarImages();
    } else {
      setIsSuccessModalVisible(true);
      salvarProgresso();
    }
  };

  return (
    <View style={styles.container}>
      <Title title='Selecione a Expressão' />
      <StatusBar backgroundColor={colors.backGroundTitle} />
      <Correct isVisible={animate} onAnimationFinish={resetPhase} />
      <SpeechText style={{}} text={'Selecione a expressão de acordo com a imagem'} />

      <StatusGame atual={current + 1} total={5} />

      <View style={styles.game}>

        {expressionImages[dificuldade][correctEmotion] && (
          <View style={styles.viewImage}>
            {image &&
              <Image
                source={image}
                style={styles.image}
              />
            }
          </View>
        )}


        <View style={styles.buttonGroup}>
          <View style={styles.buttonColumn}>
            {options.slice(0, 2).map((option, index) => (
              <ButtonGame
                disabled={false}
                style={styles.button}
                key={index} onPress={() => checkEmotion(option)}
                text={option.toUpperCase()}
              />
            ))}
          </View>
          <View style={styles.buttonColumn}>
            {options.slice(2, 4).map((option, index) => (
              <ButtonGame
                disabled={false}
                style={styles.button}
                key={index} onPress={() => checkEmotion(option)}
                text={option.toUpperCase()}
              />
            ))}
          </View>
        </View>

        <Text style={styles.feedback}>{feedback}</Text>
        <SuccessModal isVisible={isSuccessModalVisible} nextPag={`/selectLevel`} />
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
    justifyContent: 'center'
  },

  viewImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    marginBottom: 30,

  },

  image: {
    width: '90%',
    height: '90%',
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonColumn: {
    flex: 1,
    marginHorizontal: 10,
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
