import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TextInput, StyleSheet, Text,ImageSourcePropType } from 'react-native';
import expressionImages from '../../config/expressionImages';
import expressionName from '../../config/expressionName';
import stringSimilarity from 'string-similarity';
import SuccessModal from '../../modal/sucess';
import { StatusBar } from 'expo-status-bar';
import ButtonGame from '../../components/ButtonGame';
import SpeechText from '../../components/SpeechText';
import Title from '../../components/title';
import StatusGame from '../../components/StatusGame';
import Correct from '../../modal/Animate';
import colors from '../../config/colors';
import { Dificuldade, loadPerfilLogado, salvarAvanco, shuffleArray } from '../../utils/utils';
import { useLocalSearchParams } from 'expo-router';
import { PersonData } from '../../components/types';


const TOTAL_ROUNDS = 5;



export default function EscrevaExpressao() {
  const [inputEmotion, setInputEmotion] = useState<string>(''); //Inicializar Input de Emoçao
  const [feedback, setFeedback] = useState<string>(''); //Inicializa feedeback
  const [expression, setExpression] = useState<string[]>([]); // Inicialize com uma emoção padrão
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState<boolean>(false); // Estado para controlar a visibilidade da modal de sucesso
  const [current, setCurrent] = useState<number>(0); //Inicial parte da fase em que esta
  const [animated, setAnimated] = useState<boolean>(false);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')
  const [imagemApresentada, setImagemApresentada] = useState<ImageSourcePropType>(expressionImages.facil);
  const { dif } = useLocalSearchParams();

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
            updatedUser.fasesCompletas.escrevaExpressao[dificuldade] += 1;
  
            // Registra o tempo gasto
            updatedUser.tempoJogado.escrevaExpressao[dificuldade] += tempoRef.current;
  
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


  const diff = Array.isArray(dif) ? dif[0] : dif;

  useEffect(() => {
    if (diff === 'facil' || diff === 'medio' || diff === 'dificil') {
      setDificuldade(diff);
    }
  }, [diff]);


  useEffect(() => {
    // Embaralha as emoções
    const randomEmotion = shuffleArray(expressionName)

    // Define um array de emoções aleatórias
    setExpression(randomEmotion);

    if (expressionImages[dificuldade] && expressionImages[dificuldade][randomEmotion[current]] && expressionImages[dificuldade][randomEmotion[current]].length){
      setImagemApresentada(expressionImages[dificuldade][randomEmotion[current]][Math.floor(Math.random() * expressionImages[dificuldade][randomEmotion[current]].length)])
    }

  }, [dificuldade]);

  const checkEmotion = () => {
    const userEmotion = inputEmotion.toLowerCase();

    // Verifica se a resposta do usuario esta correta ou próxima
    const similarities =   stringSimilarity.compareTwoStrings(expression[current], userEmotion)



    if (similarities == 1) {
      sucess();
    } else if (similarities > 0.5 && similarities < 1) {
      setFeedback(`Você está perto! A emoção é ${expression[current]}.`);
    } else {
      setFeedback('Tente novamente, não foi possível identificar a emoção.');
    }

  };

  const resetFase = () => {
    setAnimated(false);

    if (current < TOTAL_ROUNDS - 1) {
      const imageCurrent = current + 1;
      setInputEmotion(''); // Limpa o campo de entrada de emoção
      setFeedback(''); // Limpa o feedback
  
      setCurrent(imageCurrent);
  
  
      if (expressionImages[dificuldade] && expressionImages[dificuldade][expression[imageCurrent]] && expressionImages[dificuldade][expression[imageCurrent]].length){
        setImagemApresentada(expressionImages[dificuldade][expression[imageCurrent]][Math.floor(Math.random() * expressionImages[dificuldade][expression[imageCurrent]].length)])
      }
    } else {
      salvarProgresso();
      setIsSuccessModalVisible(true);
    }


  };

  const sucess = () => {

    setAnimated(true)

  }
 


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.backGroundTitle}/>
      <Correct isVisible={animated} onAnimationFinish={resetFase}/>
      <SpeechText style={{}} text={'Digite a expressão que a imagem passsa'} />
      <Title title='Identifique a Expressão' />
      <StatusGame atual={current+1} total={TOTAL_ROUNDS} />
      <View style={styles.game}>
        
        {expressionImages[dificuldade][expression[current]] && (
          <View style={styles.viewImage}>
            <Image
              source={imagemApresentada}
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

        <ButtonGame disabled={false} onPress={checkEmotion} style={styles.button} text='Corrigir' />

        <Text style={styles.feedback}>{feedback}</Text>


        <SuccessModal isVisible={isSuccessModalVisible} nextPag={`/selectLevel`}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.backGroundApp,
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
    width: '50%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,

  },
  image: {
    width: '90%',
    height: '90%',
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
