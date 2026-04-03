import { useEffect, useState } from 'react';
import { MainMenu } from './views/MainMenu';
import { GameBoard } from './views/GameBoard';
import { PauseMenu } from './views/PauseMenu';
import { GameOverModal } from './views/GameOverModal';
import { BoundingBox } from './components/BoundingBox';
import { useGameStore } from './store/gameStore';
import { fetchRemoteConfig } from './utils/remoteData';

import levelDesignData from './data/level-design.json';
import wordBankData from './data/word-bank.json';
import economyData from './data/economy.json';

const ASSETS_BASE_URL = 'https://raw.githubusercontent.com/ishanmanjrekar/yet-another-word-game/master/src/data/';

function App() {
  const gameState = useGameStore(state => state.gameState);
  const activeStage = useGameStore(state => state.activeStage);
  
  const [isHydrated, setIsHydrated] = useState(false);
  
  const setLevelDesign = useGameStore(state => state.setLevelDesign);
  const setWordBank = useGameStore(state => state.setWordBank);
  const setEconomy = useGameStore(state => state.setEconomy);

  useEffect(() => {
    async function hydrateStore() {
      // Fetch each config from GitHub, falling back to local files if it fails or times out
      const [remoteLevel, remoteWords, remoteEconomy] = await Promise.all([
        fetchRemoteConfig(`${ASSETS_BASE_URL}level-design.json`, levelDesignData),
        fetchRemoteConfig(`${ASSETS_BASE_URL}word-bank.json`, wordBankData),
        fetchRemoteConfig(`${ASSETS_BASE_URL}economy.json`, economyData)
      ]);

      setLevelDesign(remoteLevel as any);
      setWordBank(remoteWords as any);
      setEconomy(remoteEconomy as any);
      setIsHydrated(true);
    }
    
    hydrateStore();
  }, [setLevelDesign, setWordBank, setEconomy]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#161625] text-white">
        <div className="text-center font-body">
          <div className="mb-4 text-2xl font-bold tracking-widest opacity-80 animate-pulse">
            LOADING ASSETS
          </div>
          <div className="h-1 w-48 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-[loading-bar_2s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

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
