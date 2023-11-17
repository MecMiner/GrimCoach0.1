import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersonData, Token } from "../components/types";

export const shuffleArray = (array: string[]) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

export const generateRandomOptions = (allEmotions: string[], correctEmotion: string, numOptions: number) => {
const options = [correctEmotion];

while (options.length < numOptions) {
    const randomEmotion = allEmotions[Math.floor(Math.random() * allEmotions.length)];

    if (!options.includes(randomEmotion)) {
    options.push(randomEmotion);
    }
}

return shuffleArray(options); // Embaralha as opções
};

export type Dificuldade = 'facil' | 'medio' | 'dificil'


export function shuffleArrayGeneric<T>(array: T[]): T[]{
  const shuffledArray = [...array]; // Faça uma cópia do array de entrada
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};


export const loadPerfilLogado = async (): Promise<PersonData | null> => {
  try {
    const response = await AsyncStorage.getItem('@grimcoach:token');
    const token: Token | null = response ? JSON.parse(response) : null;

    if (token) {
      const data = await AsyncStorage.getItem('@grimcoach:profile');

      if (data) {
        const profiles: PersonData[] = JSON.parse(data);
        const profile = profiles.find((e) => e.id === token.hash);

        if (profile) {
          console.log(JSON.stringify(profile, null, 2));
          return profile;
        }
      }
    } else {
      console.log('Token não encontrado');
    }

    return null;
  } catch (error) {
    console.error('Erro ao carregar dados do perfil:', error);
    return null;
  }
};


export const salvarAvanco = async (user : PersonData) => {
  try {
    // Carregar os dados existentes do AsyncStorage
    const response = await AsyncStorage.getItem('@grimcoach:profile');
    const previusData = response ? JSON.parse(response) : [];

    // Encontrar o índice do objeto que corresponde ao id que você deseja atualizar
    const index = previusData.findIndex((profile: PersonData) => profile.id === user?.id);

    if (index !== -1) {
      // Atualizar o objeto existente com os novos valores
      previusData[index] = user;

      // Salvar os dados atualizados de volta no AsyncStorage
      await AsyncStorage.setItem('@grimcoach:profile', JSON.stringify(previusData));
      console.log('Dados do perfil atualizados com sucesso!');
    } else {
      console.log('ID não encontrado. Não foi possível atualizar o perfil.');
    }
  } catch (error) {
    console.error('Erro ao salvar dados do perfil:', error);
  }
};