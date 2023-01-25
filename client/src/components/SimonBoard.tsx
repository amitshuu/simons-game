import { useState, useEffect, useRef } from 'react';
import SimonButtons from './SimonButtons';
type Props = {
  setScore: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  userFromLocalStorage: { id: string; highestScore: number };
};

const SimonBoard = ({ setScore, score, userFromLocalStorage }: Props) => {
  const colors = ['red', 'yellow', 'blue', 'green'];

  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComputerPlaying, setIsComputerPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(0);

  const displayText = !isPlaying
    ? 'Start'
    : isComputerPlaying
    ? 'Simons turn'
    : 'Your turn';

  const onStartHandler = async () => {
    if (isPlaying) return;
    if (!userFromLocalStorage) {
      try {
        const data = await fetch('http://localhost:5000/register', {
          method: 'GET',
        });
        const res = await data.json();
        localStorage.setItem('user', JSON.stringify(res));
      } catch (error) {
        console.log(error);
      }
    }
    generateNewColor();
    setIsPlaying(true);
  };

  const generateNewColor = () => {
    const color = colors[Math.floor(Math.random() * 4)];
    setColorSequence((prevState) => [...prevState, color]);
  };

  const greenRef = useRef<HTMLButtonElement>(null);
  const redRef = useRef<HTMLButtonElement>(null);
  const yellowRef = useRef<HTMLButtonElement>(null);
  const blueRef = useRef<HTMLButtonElement>(null);

  const generateRefs = (clr: string) => {
    if (clr === 'red') return redRef;
    if (clr === 'green') return greenRef;
    if (clr === 'yellow') return yellowRef;
    if (clr === 'blue') return blueRef;
    return blueRef;
  };

  const updateHighestScore = async (score: number) => {
    try {
      const userUpdate = {
        id: userFromLocalStorage.id,
        highestScore: score,
      };
      await fetch('http://localhost:5000/updateScore', {
        method: 'POST',
        body: JSON.stringify(userUpdate),
        headers: { 'Content-Type': 'application/json' },
      });
      localStorage.setItem('user', JSON.stringify(userUpdate));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (clr: string, e: React.ChangeEvent<any>) => {
    if (isComputerPlaying) return;
    e.target.classList.add('opcaity');
    if (isPlaying) {
      setTimeout(() => {
        if (colorSequence[playingIndex] === clr) {
          e.target.classList.remove('opcaity');
          if (playingIndex === colorSequence.length - 1) {
            setTimeout(() => {
              setPlayingIndex(0);
              generateNewColor();
              setScore((prevState) => prevState + 1);
            }, 250);
          } else {
            setPlayingIndex(playingIndex + 1);
          }
        } else {
          alert('You Lost!');
          e.target.classList.remove('opcaity');
          if (score > userFromLocalStorage?.highestScore)
            return updateHighestScore(score);
          resetGame();
        }
      }, 250);
    }
  };

  const resetGame = () => {
    setColorSequence([]);
    setIsPlaying(false);
    setScore(0);
  };

  useEffect(() => {
    const displaySequence = (simonsIndex = 0) => {
      if (colorSequence.length > 0) {
        setIsComputerPlaying(true);
        const ref = generateRefs(colorSequence[simonsIndex]);
        setTimeout(() => {
          ref.current?.classList?.add('simons-turn');
        }, 250);
        setTimeout(() => {
          ref.current?.classList?.remove('simons-turn');
          if (simonsIndex < colorSequence.length - 1)
            displaySequence(simonsIndex + 1);
          if (simonsIndex === colorSequence.length - 1) {
            setIsComputerPlaying(false);
          }
        }, 500);
      }
    };
    displaySequence();
  }, [colorSequence]);

  return (
    <div className='simon-board-container'>
      <div className='simon-board'>
        <div className='buttons-container'>
          {colors.map((color) => {
            return (
              <SimonButtons
                key={color}
                handleClick={(e: React.ChangeEvent<any>) =>
                  handleClick(color, e)
                }
                color={color}
                ref={generateRefs(color)}
                isComputerPlaying={isComputerPlaying}
                isPlaying={isPlaying}
              />
            );
          })}
        </div>
        <div className='simon-text' onClick={onStartHandler} id='simon-text'>
          {displayText}
        </div>
      </div>
    </div>
  );
};

export default SimonBoard;
