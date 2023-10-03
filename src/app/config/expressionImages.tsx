import { ImageSourcePropType } from 'react-native';

interface ExpressionImages {
  facil: Record<string, ImageSourcePropType>;
  avatar: Record<string, ImageSourcePropType>;
  baralho: ImageSourcePropType;
}


const expressionImages: ExpressionImages = {
    facil: {
        alegre: require('./../../assets/emocoes/facil/Alegre.png'),
        apaixonado: require('./../../assets/emocoes/facil/Apaixonado.png'),
        assustado: require('./../../assets/emocoes/facil/Assustado.png'),
        chateado: require('./../../assets/emocoes/facil/Chateado.png'),
        confuso: require('./../../assets/emocoes/facil/Confuso.png'),
        emocionado: require('./../../assets/emocoes/facil/Emocionado.png'),
        pensativo: require('./../../assets/emocoes/facil/Pensativo.png'),
        raiva: require('./../../assets/emocoes/facil/Raiva.png'),
        sono: require('./../../assets/emocoes/facil/Sono.png'),
        triste: require('./../../assets/emocoes/facil/Triste.png'),
    },

    avatar: {
      baleia: require('./../../assets/avatar/baleia.png'),
      dragao: require('./../../assets/avatar/dragao.png'),
      escorpiao: require('./../../assets/avatar/escorpiao.png'),
      grilo: require('./../../assets/avatar/grilo.png'),
      joaninha: require('./../../assets/avatar/joaninha.png'),
      lagarta: require('./../../assets/avatar/lagarta.png'),
      mamute: require('./../../assets/avatar/mamute.png'),
      passaro: require('./../../assets/avatar/passaro.png'),
      pato: require('./../../assets/avatar/pato.png'),
      peru: require('./../../assets/avatar/peru.png'),
      polvo: require('./../../assets/avatar/polvo.png'),
      urso: require('./../../assets/avatar/urso.png'),
    },

    baralho: require("./../../assets/baralho.png")
};



export default expressionImages;