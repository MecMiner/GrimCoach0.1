import { ImageSourcePropType } from 'react-native';

interface ExpressionImages {
  facil: Record<string, ImageSourcePropType>;
  medio: Record<string, ImageSourcePropType>;
  dificil: Record<string, ImageSourcePropType>;
  avatar: Record<string, ImageSourcePropType>;
  baralho: ImageSourcePropType;
}


const expressionImages: ExpressionImages = {
    facil: {
        feliz: require('./../../assets/emocoes/facil/felicidade.png'),
        medo: require('./../../assets/emocoes/facil/medo.png'),
        serio: require('./../../assets/emocoes/facil/seriedade.png'),
        raiva: require('./../../assets/emocoes/facil/raiva.png'),
        triste: require('./../../assets/emocoes/facil/tristeza.png'),
        surpreso: require('./../../assets/emocoes/facil/surpresa.png')
    },

    medio: {
      feliz: require('./../../assets/emocoes/facil/felicidade.png'),
      medo: require('./../../assets/emocoes/facil/medo.png'),
      serio: require('./../../assets/emocoes/facil/seriedade.png'),
      raiva: require('./../../assets/emocoes/facil/raiva.png'),
      triste: require('./../../assets/emocoes/facil/tristeza.png'),
      surpreso: require('./../../assets/emocoes/facil/surpresa.png')
    },

    dificil: {
      feliz: require('./../../assets/emocoes/facil/felicidade.png'),
      medo: require('./../../assets/emocoes/facil/medo.png'),
      serio: require('./../../assets/emocoes/facil/seriedade.png'),
      raiva: require('./../../assets/emocoes/facil/raiva.png'),
      triste: require('./../../assets/emocoes/facil/tristeza.png'),
      surpreso: require('./../../assets/emocoes/facil/surpresa.png')
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