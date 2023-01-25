type Props = {
  score: number;
  userFromLocalStorage: { id: string; highestScore: number };
};

const GameStatus = ({ score, userFromLocalStorage }: Props) => {
  return (
    <div className='game-status'>
      <h3>Score: {score}</h3>
      <h2>
        Highest Score:
        {score > userFromLocalStorage?.highestScore
          ? score
          : userFromLocalStorage?.highestScore ?? 0}
      </h2>
    </div>
  );
};

export default GameStatus;
