import React, { useState, useEffect, useCallback, useRef} from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import expressionImages from '../../config/expressionImages';
import expressionName from '../../config/expressionName';
import SuccessModal from '../../modal/sucess'; // Certifique-se de que a importação está correta
import SpeechText from '../../components/SpeechText';
import Title from '../../components/title';
import StatusGame from '../../components/StatusGame';
import Correct from '../../modal/Animate';
import colors from '../../config/colors';
import { StatusBar } from 'expo-status-bar';
import { Dificuldade, loadPerfilLogado, salvarAvanco } from '../../utils/utils';
import { useLocalSearchParams } from 'expo-router';
import { PersonData } from '../../components/types';



type Card = {
  id: number;
  value: string;
  image: ImageSourcePropType;
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Estado para controlar a visibilidade da modal de sucesso
  const [hasGameStarted, setHasGameStarted] = useState(false); // Nova variável de estado
  const [current, setCurrent] = useState<number>(1);
  const [animate, setAnimate] = useState(false);
  const [areCardsVisible, setAreCardsVisible] = useState(true);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')

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
            updatedUser.fasesCompletas.jogoDaMemoria[dificuldade] += 1;
  
            // Registra o tempo gasto
            updatedUser.tempoJogado.jogoDaMemoria[dificuldade] += tempoRef.current;
  
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


  useEffect(() => {
    initializeGame();
  }, [dificuldade]);

  useEffect(() => {
    if (hasGameStarted && matchedPairs.length === cards.length / 2) {
      setCurrent(current + 1);
      setAnimate(true);
    }
  }, [hasGameStarted, matchedPairs, cards]);

  const initializeGame = () => {
    const expressions = expressionName;
    const expImg = expressionImages[dificuldade]
    const totalPairs = 6; // Número de pares de cartas
    const allPairs: Card[] = [];
    const shuffledPairs: Card[] = [];

    for (let i = 0; i < totalPairs; i++) {
      allPairs.push({ id: i * 2, value: expressions[i], image: expImg[expressions[i]][Math.floor(Math.random() * expImg[expressions[i]].length)] });
      allPairs.push({ id: i * 2 + 1, value: expressions[i], image: expImg[expressions[i]][Math.floor(Math.random() * expImg[expressions[i]].length)] });
    }

    while (allPairs.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPairs.length);
      shuffledPairs.push(allPairs.splice(randomIndex, 1)[0]);
    }

    setCards(shuffledPairs);
    setHasGameStarted(true);

    // Mostrar as cartas no início e, em seguida, escondê-las após 3 segundos
    setAreCardsVisible(true);
    setTimeout(() => {
      setAreCardsVisible(false);
    }, 3000); // 3 segundos
  };

  const handleCardPress = useCallback((index: number) => {
    if (flippedIndices.includes(index) || flippedIndices.length === 2 || isChecking || isCardMatched(cards[index].value)) {
      return;
    }

    setFlippedIndices([...flippedIndices, index]);

    if (flippedIndices.length === 1) {
      const firstCard = cards[flippedIndices[0]].value;
      const secondCard = cards[index].value;

      if (firstCard === secondCard) {
        setMatchedPairs([...matchedPairs, firstCard]);
      }

      setIsChecking(true);

      setTimeout(() => {
        setFlippedIndices([]);
        setIsChecking(false);
      }, 1000); // Volta as cartas após 1 segundo
    }
  },
    [flippedIndices, isChecking, cards, matchedPairs]
  );


  const isCardFlipped = (index: number) => flippedIndices.includes(index);

  const isCardMatched = (value: string) => matchedPairs.includes(value);

  const resetGame = () => {
    // Resetar todos os estados para reiniciar o jogo
    setAnimate(false)
    if (current < 2) {
      setAnimate(false)
      setCards([]);
      setFlippedIndices([]);
      setMatchedPairs([]);
      setIsChecking(false);
      initializeGame(); // Iniciar um novo jogo após a reinicialização
    } else {
      setIsSuccessModalVisible(true);
      salvarProgresso();
    }

  };

  return (
    <View style={styles.container}>
      <Title title='Jogo da Memória' />
      <StatusBar backgroundColor={colors.backGroundTitle} />
      <Correct isVisible={animate} onAnimationFinish={() => resetGame()} />
      <StatusGame atual={current} total={2} />
      <SpeechText style={{}} text={'Selecione a expressão de acordo com a imagem'} />
      <View style={styles.game}>
        <View style={styles.grid}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                isCardFlipped(index) && styles.flippedCard,
                isCardMatched(card.value) && styles.matchedCard,
              ]}
              onPress={() => handleCardPress(index)}
              activeOpacity={0.7}
            >
              {(isCardFlipped(index) || isCardMatched(card.value) || areCardsVisible) ? (
                <Image source={card.image} style={styles.image} />
              ) : (
                <Image source={expressionImages.baralho} style={styles.imageBaralho} />
              )}
            </TouchableOpacity>
          ))}

          <SuccessModal isVisible={isSuccessModalVisible} nextPag={`/selectLevel`} />
        </View>
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
    marginTop: 50,
    alignItems: 'center',
  },
  backgroundStyle: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '25%',
    aspectRatio: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    elevation: 5,
  },
  flippedCard: {
    elevation: 5,
  },
  matchedCard: {
    backgroundColor: 'lightgreen',
    elevation: 5,
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 5,
  },
  imageBaralho: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});
