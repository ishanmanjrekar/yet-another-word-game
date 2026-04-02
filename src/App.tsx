import { useEffect } from 'react';
import { MainMenu } from './views/MainMenu';
import { GameBoard } from './views/GameBoard';
import { PauseMenu } from './views/PauseMenu';
import { GameOverModal } from './views/GameOverModal';
import { BoundingBox } from './components/BoundingBox';
import { useGameStore } from './store/gameStore';

import levelDesignData from './data/level-design.json';
import wordBankData from './data/word-bank.json';
import economyData from './data/economy.json';

function App() {
  const gameState = useGameStore(state => state.gameState);
  const activeStage = useGameStore(state => state.activeStage);
  
  const setLevelDesign = useGameStore(state => state.setLevelDesign);
  const setWordBank = useGameStore(state => state.setWordBank);
  const setEconomy = useGameStore(state => state.setEconomy);

  useEffect(() => {
    // Populate store once at app launch
    setLevelDesign(levelDesignData as any);
    setWordBank(wordBankData as any);
    setEconomy(economyData as any);
  }, [setLevelDesign, setWordBank, setEconomy]);

  return (
    <div className="flex h-[100dvh] w-screen bg-surface-lowest overflow-hidden">
      <BoundingBox width={390} height={844}>
        {gameState === 'menu' && <MainMenu />}
        
        {gameState !== 'menu' && (
          <div className="relative w-full h-full bg-[#161625] overflow-hidden">
             <GameBoard key={activeStage} />
             {gameState === 'paused' && <PauseMenu />}
             {gameState === 'gameover' && <GameOverModal />}
          </div>
        )}
      </BoundingBox>
    </div>
  );
}

export default App;
