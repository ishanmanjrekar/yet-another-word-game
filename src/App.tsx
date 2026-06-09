import { useEffect, useState } from 'react';
import { MainMenu } from './views/MainMenu';
import { GameBoard } from './views/GameBoard';
import { PauseMenu } from './views/PauseMenu';
import { GameOverModal } from './views/GameOverModal';
import { BoundingBox } from './components/BoundingBox';
import { useGameStore } from './store/gameStore';
import type { LevelDesign, WordBank, EconomyConfig } from './store/gameStore';
import { fetchRemoteConfig } from './utils/remoteData';

import levelDesignData from './data/level-design.json';
import wordBankData from './data/word-bank.json';
import economyData from './data/economy.json';

const ASSETS_BASE_URL = 'https://raw.githubusercontent.com/ishanmanjrekar/yet-another-word-game/master/src/data/';

function App() {
  const gameState = useGameStore(state => state.gameState);
  const activeStage = useGameStore(state => state.activeStage);
  const theme = useGameStore(state => state.theme);
  
  const [isHydrated, setIsHydrated] = useState(false);
  
  const setLevelDesign = useGameStore(state => state.setLevelDesign);
  const setWordBank = useGameStore(state => state.setWordBank);
  const setEconomy = useGameStore(state => state.setEconomy);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    async function hydrateStore() {
      // Fetch each config from GitHub, falling back to local files if it fails or times out
      const [remoteLevel, remoteWords, remoteEconomy] = await Promise.all([
        fetchRemoteConfig(`${ASSETS_BASE_URL}level-design.json`, levelDesignData),
        fetchRemoteConfig(`${ASSETS_BASE_URL}word-bank.json`, wordBankData),
        fetchRemoteConfig(`${ASSETS_BASE_URL}economy.json`, economyData)
      ]);

      setLevelDesign(remoteLevel as unknown as LevelDesign);
      setWordBank(remoteWords as unknown as WordBank);
      setEconomy(remoteEconomy as unknown as EconomyConfig);
      setIsHydrated(true);
    }
    
    hydrateStore();
  }, [setLevelDesign, setWordBank, setEconomy]);

  if (!isHydrated) {
    return (
      <div className="flex h-[100dvh] w-screen bg-surface-lowest overflow-hidden">
        <BoundingBox width={480} height={880}>
          <div className="flex flex-col h-full w-full items-center justify-center bg-surface-low text-on-surface px-6">
            <div className="flex flex-col items-center justify-center gap-10">
              <img 
                src="/splash-cover.png" 
                alt="YAWG Splash Cover" 
                className="select-none pointer-events-none" 
              />
              <div className="flex flex-col items-center gap-4 w-64">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-[loading-bar_1.5s_infinite]" />
                </div>
                <div className="text-sm font-bold tracking-widest text-primary/80 animate-pulse font-body uppercase">
                  Loading Assets...
                </div>
              </div>
            </div>
          </div>
        </BoundingBox>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-screen bg-surface-lowest overflow-hidden">
      <BoundingBox width={480} height={880}>
        {gameState === 'menu' && <MainMenu />}
        
        {gameState !== 'menu' && (
          <div className="relative w-full h-full bg-surface-low overflow-hidden">
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
