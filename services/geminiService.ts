
import { TabooCard, Difficulty, Language } from "../types";
import { STATIC_CARDS } from "../data/staticCards";

// Helper to shuffle array
const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateTabooCards = async (language: Language, difficulty: Difficulty, count: number = 10): Promise<TabooCard[]> => {
  // Simulate async delay for better UX (loading states)
  await new Promise(resolve => setTimeout(resolve, 600));

  const langCards = STATIC_CARDS[language] || STATIC_CARDS['AZ'];
  const availableCards = langCards[difficulty] || langCards['MEDIUM'];
  
  if (availableCards.length === 0) {
    console.warn(`No cards found for language ${language} and difficulty ${difficulty}`);
    return [];
  }

  // Shuffle and pick requested number
  const shuffled = shuffle(availableCards);
  return shuffled.slice(0, count);
};