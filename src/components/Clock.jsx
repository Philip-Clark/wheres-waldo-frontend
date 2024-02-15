import React, { useEffect } from 'react';
import Speaker from './Speaker';

import PropTypes from 'prop-types';

Clock.propTypes = {
  restart: PropTypes.func,
  allowAudio: PropTypes.bool,
  gameOver: PropTypes.bool,
};

export default function Clock({ restart, allowAudio, gameOver }) {
  const [timer, setTimer] = React.useState(0);
  const [timerRunning, setTimerRunning] = React.useState(true);
  const [tickPlaying, setTickPlaying] = React.useState(false);

  useEffect(() => {
    if (gameOver) {
      setTimerRunning(false);
    }
  }, [gameOver]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer + 1);
      setTickPlaying(true);
    }, 1000);

    if (!timerRunning) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer, timerRunning]);

  const handleRestart = () => {
    setTimer(0);
    setTimerRunning(true);
    setTimer(0);
    restart();
  };

  return (
    <div>
      <Speaker
        src="./audio/tick.mp3"
        volume={0.05}
        playing={tickPlaying}
        onended={() => {
          setTickPlaying(false);
        }}
        allowAudio={allowAudio}
      />

      <div className="clock">
        <div className="display">
          <div className="hours">{String(Math.floor(timer / 3600)).padStart(2, '0')}</div>:
          <div className="minutes">{String(Math.floor((timer % 3600) / 60)).padStart(2, '0')}</div>:
          <div className="seconds">{String(Math.floor(timer % 60)).padStart(2, '0')}</div>
        </div>
        <div className="buttons">
          <button className="restart" onClick={handleRestart}>
            restart
          </button>
          <button className="log">log</button>
        </div>
      </div>
    </div>
  );
}
