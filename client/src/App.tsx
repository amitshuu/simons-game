import GameStatus from './components/GameStatus';
import SimonBoard from './components/SimonBoard';
import { useState } from 'react';
import './index.css';
const App = () => {
  const [score, setScore] = useState(0);

  const userFromLocalStorage =
    localStorage.getItem('user') &&
    JSON.parse(localStorage.getItem('user') ?? '');

  return (
    <main className='main-content'>
      <SimonBoard
        userFromLocalStorage={userFromLocalStorage}
        score={score}
        setScore={setScore}
      />
      <GameStatus userFromLocalStorage={userFromLocalStorage} score={score} />
    </main>
  );
};

export default App;
