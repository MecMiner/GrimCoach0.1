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
