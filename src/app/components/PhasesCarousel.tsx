
import { ImageSourcePropType, FlatList, View, StyleSheet, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import {Link} from 'expo-router';
import { Href } from 'expo-router/build/link/href';
import { Dificuldade } from '../utils/utils';
import {useState, useEffect, useCallback} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
    ViewToken
  } from '@react-native/virtualized-lists';

interface Images {
    title: string,
    uri: ImageSourcePropType,
    link: Href;
    descricao: string
}


const images: Images[] = [
    {
        title: 'Compare as Expressões' , 
        uri: require('./../../assets/phases/compareAExpressao.png'),
        link:'/phases/compareExpressions',
        descricao: 'Atenção aos detalhes! Duas imagens serão apresentadas, e você precisa determinar se as expressões faciais são iguais. Veja bem e faça sua escolha!'
    },
    {
        title: 'Escreva a Expressão' , 
        uri: require('./../../assets/phases/escrevaAExpressao.png'),
        link:'/phases/escrevaExpressao',
        descricao:'Coloque em palavras! Diante de uma imagem, escreva o que você acha que a expressão facial representa. Descreva com suas próprias palavras!'
    },
    {
        title: 'Selecione a Expressão' , 
        uri: require('./../../assets/phases/selecioneAExpressao.png'),
        link:'/phases/selecioneExpressao',
        descricao:'Faça a escolha certa! Uma imagem surgirá com quatro opções de expressões faciais. Selecione a expressão que melhor representa a imagem. Qual será a sua escolha?'

    },
    {
        title: 'Combine as Expressões' , 
        uri: require('./../../assets/phases/combineAExpressao.png'),
        link:'/phases/ligueExpressao',
        descricao: 'Faça as conexões certas! Quatro imagens e quatro expressões faciais. Sua tarefa é combinar cada imagem com a expressão correspondente. Vamos lá, faça as correspondências!'
    },
    {
        title: 'Encontre o Impostor' , 
        uri: require('./../../assets/phases/encontreOErro.png'),
        link:'/phases/encontreOErro',
        descricao: 'Atenção ao detalhe! Diversas imagens serão exibidas, mas apenas uma terá uma expressão facial diferente. Encontre a imagem que não combina com as outras!'
    },
    {
        title: 'Jogo da Memória' , 
        uri: require('./../../assets/phases/jogoDaMemoria.png'),
        link:'/phases/jogoDaMemoria',
        descricao: 'Memória em ação! Encontre pares de imagens que representam expressões faciais correspondentes. Desafie sua memória e conecte as imagens corretas!'
    },

    {
        title: 'Pisca Pisca',
        uri: require('./../../assets/phases/piscaPisca.png'),
        link: '/phases/piscaPisca',
        descricao: 'Hora de piscar os olhos! O desafio é simples: siga as instruções do aplicativo e pisque seus olhos no ritmo indicado. Vamos lá, acompanhe o padrão!'
    },

    {
        title: 'Sorria, você Está Sendo Filmado',
        uri: require('./../../assets/phases/sorriaEstaSendoFilmado.png'),
        link: '/phases/sorriaEstaSendoFilmado',
        descricao: 'Chegou a vez de sorrir! O aplicativo vai exibir imagens que vão te fazer sorrir. Responda ao desafio sorrindo para as imagens apresentadas. Um sorriso diz mais que mil palavras!'
    },

    {
        title: 'Chefin Mandou',
        uri: require('./../../assets/phases/chefinMandou.png'),
        link: '/phases/chefimMandou',
        descricao: 'Aqui quem manda sou eu, o "O Chefinho", e você tem que obdecer! O "Chefinho" vai mostrar diversas expressões faciais. Sua missão é imitar cada expressão. Está pronto? Mostre o que você sabe!'
    },

    {
        title: 'Imite as Expressões' , 
        uri: require('./../../assets/phases/imiteAExpressao.png'),
        link:'/phases/imiteAExpressao',
        descricao: 'Hora de representar! Serão exibidas emoções como raiva, tristeza, surpresa e felicidade. Seu desafio é imitar cada expressão. Pronto para expressar suas emoções?'
    },
]

const {width, height} = Dimensions.get('window');

interface CarouselProps {
    dif: Dificuldade;
  }

export default function Carousel ({dif} : CarouselProps) {

    const [position, setPosition] = useState(0);

    useEffect(() => {
      // Recupere a posição armazenada
      const getPosition = async () => {
        try {
          const savedPosition = await AsyncStorage.getItem('listPosition');
          if (savedPosition !== null) {
            setPosition(parseInt(savedPosition, 10));
          } else {
            setPosition(0);
          }
        } catch (error) {
          console.error('Erro ao recuperar a posição da lista', error);
        }
      };
  
      getPosition();
    }, []);

    const onChangeList = useCallback(({ changed, viewableItems }: { changed: ViewToken[], viewableItems: ViewToken[] }) => {
        if (viewableItems) {
          const index = viewableItems[0].index;
          if (index || index === 0) {
            console.log( index.toString())
            AsyncStorage.setItem('listPosition', index.toString());
          }
        }
      },[]);
  
    return (
        <View style={styles.container}>
            <FlatList
            style={styles.flatList} 
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()} 
            onViewableItemsChanged={onChangeList}
            initialScrollIndex={position}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
                minimumViewTime: 0,
              }}
            renderItem={({item}) => {
                return (
                <View style={styles.imageContainer}>
                    <Link href={`${item.link}/${dif}`} asChild style={styles.initialPhase}>
                        <TouchableOpacity>
                            <Image style={styles.image} source={item.uri}/>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.descricao}>{item.descricao}</Text>
                        </TouchableOpacity>
                    </Link>

                </View>)
            }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:  {
        justifyContent:'center',
        alignItems:'center'
    },
    flatList: { flexGrow: 0},
    imageContainer: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    initialPhase: {
        alignItems: 'center',
        width: width - (width * 0.1),
        height: (height * 0.6),
        resizeMode: 'cover',
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        marginBottom: 20,
        padding: 20,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        maxHeight: width - (width * 0.2),
        resizeMode: 'cover',
        borderRadius: 10,
    },
    title:{
        fontSize: 24,
        textAlign: 'left',
        padding: 20,
        color: 'gray',
        fontWeight: 'bold',
    },
    descricao:{
        fontSize: 18,
        textAlign: 'justify',
        padding: 20,
    }
})
