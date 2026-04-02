import { useState } from 'react'
import { BoundingBox } from './components/BoundingBox'
import { useGameLoop } from './hooks/useGameLoop'
import './App.css'

function App() {
  const [ticks, setTicks] = useState(0)

  // Example game loop usage
  useGameLoop((deltaTime) => {
    // Game logic updates will go here!
  })

  return (
    <BoundingBox width={800} height={600}>
      <div style={{ width: '100%', height: '100%', backgroundColor: '#222', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' }}>
        <h1>Game Scaffolding Ready!</h1>
        <p>Using BoundingBox pattern (800x600).</p>
        <button 
          onClick={() => setTicks(ticks + 1)}
          style={{ padding: '12px 24px', fontSize: '18px', cursor: 'pointer', marginTop: '20px' }}
        >
          Interact ({ticks})
        </button>
      </div>
    </BoundingBox>
  )
}

export default App
