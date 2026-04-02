import { useEffect } from 'react';
import { MainMenu } from './views/MainMenu';
import { GameBoard } from './views/GameBoard';
import { BoundingBox } from './components/BoundingBox';
import { useGameStore } from './store/gameStore';

import levelDesignData from './data/level-design.json';
import wordBankData from './data/word-bank.json';

function App() {
  const gameState = useGameStore(state => state.gameState);
  const setLevelDesign = useGameStore(state => state.setLevelDesign);
  const setWordBank = useGameStore(state => state.setWordBank);

  useEffect(() => {
    // Populate store once at app launch
    setLevelDesign(levelDesignData as any);
    setWordBank(wordBankData as any);
  }, [setLevelDesign, setWordBank]);

  return (
    <div className="flex h-screen w-screen bg-surface-lowest overflow-hidden">
      <BoundingBox width={390} height={844}>
        {gameState === 'menu' && <MainMenu />}
        {gameState === 'playing' && <GameBoard />}
      </BoundingBox>
    </div>
  );
}

export default App;
