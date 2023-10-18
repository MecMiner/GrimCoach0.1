
import { ImageSourcePropType, FlatList, View, StyleSheet, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import {Link} from 'expo-router';
import { Href } from 'expo-router/build/link/href';

interface Images {
    title: string,
    uri: ImageSourcePropType,
    link: Href;
}


const images: Images[] = [
    {
        title: 'Escreva a Exprresão' , 
        uri: require('./../../assets/phases/phase1.png'),
        link:'/phases/escrevaExpressao'
    },
    {
        title: 'Selecione a expressão' , 
        uri: require('./../../assets/phases/phase2.png'),
        link:'/phases/selecioneExpressao'
    },
    {
        title: 'Combine as Expressao' , 
        uri: require('./../../assets/phases/phase3.png'),
        link:'/phases/ligueExpressao'
    },
    {
        title: 'Jogo da Memória' , 
        uri: require('./../../assets/phases/phase4.png'),
        link:'/phases/jogoDaMemoria'
    },
    {
        title: 'Encontre o Erro' , 
        uri: require('./../../assets/phases/phase5.png'),
        link:'/phases/encontreOErro'
    },
    {
        title: 'Copare as Expressões' , 
        uri: require('./../../assets/phases/phase6.png'),
        link:'/phases/compareExpressions'
    },
    {
        title: 'Imite as Expressões' , 
        uri: require('./../../assets/phases/phase6.png'),
        link:'/phases/imiteAExpressao'
    },
]

const {width, height} = Dimensions.get('window');

export default function Carousel () {
    return (
        <View style={styles.container}>
            <FlatList
            style={styles.flatList} 
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()} 
            renderItem={({item}) => {
                return (
                <View style={styles.imageContainer}>
                    <Link href={`${item.link}`} asChild style={styles.initialPhase}>
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
