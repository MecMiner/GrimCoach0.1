
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
}


const images: Images[] = [
    {
        title: 'Copare as Expressões' , 
        uri: require('./../../assets/phases/compareAExpressao.png'),
        link:'/phases/compareExpressions'
    },
    {
        title: 'Escreva a Exprresão' , 
        uri: require('./../../assets/phases/escrevaAExpressao.png'),
        link:'/phases/escrevaExpressao'
    },
    {
        title: 'Selecione a expressão' , 
        uri: require('./../../assets/phases/selecioneAExpressao.png'),
        link:'/phases/selecioneExpressao'
    },
    {
        title: 'Combine as Expressao' , 
        uri: require('./../../assets/phases/combineAExpressao.png'),
        link:'/phases/ligueExpressao'
    },
    {
        title: 'Jogo da Memória' , 
        uri: require('./../../assets/phases/jogoDaMemoria.png'),
        link:'/phases/jogoDaMemoria'
    },
    {
        title: 'Encontre o Erro' , 
        uri: require('./../../assets/phases/encontreOErro.png'),
        link:'/phases/encontreOErro'
    },

    {
        title: 'Pisca Pisca',
        uri: require('./../../assets/phases/piscaPisca.png'),
        link: '/phases/piscaPisca'
    },

    {
        title: 'Sorria, você Está Sendo Filmado',
        uri: require('./../../assets/phases/sorriaEstaSendoFilmado.png'),
        link: '/phases/sorriaEstaSendoFilmado'
    },

    {
        title: 'Chefim Mandou',
        uri: require('./../../assets/phases/chefimMandou.png'),
        link: '/phases/chefimMandou'
    },

    {
        title: 'Imite as Expressões' , 
        uri: require('./../../assets/phases/imiteAExpressao.png'),
        link:'/phases/imiteAExpressao'
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
        if (viewableItems.length > 0) {
          const index = viewableItems[0].index;
          if (index) {
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
        width,
        height: 700,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        height: 500,
        width: width-100,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    initialPhase: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 600,
        width: width-50,
        resizeMode: 'cover',
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
    },
    title:{
        fontSize: 24,
        textAlign: 'left',
        padding: 20,
        color: 'gray'
    }
})
