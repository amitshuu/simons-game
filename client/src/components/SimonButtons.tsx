import React, { forwardRef, Ref } from 'react';

type Props = {
  color: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  isComputerPlaying: boolean;
  isPlaying: boolean;
};

const SimonButtons = forwardRef(
  (
    { color, handleClick, isComputerPlaying, isPlaying }: Props,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        onClick={handleClick}
        className={`btn ${color}`}
        ref={ref}
        disabled={isComputerPlaying || !isPlaying}
      />
    );
  }
);

export default SimonButtons;
