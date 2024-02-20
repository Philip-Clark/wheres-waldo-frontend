import React, { useEffect } from 'react';
import Speaker from './Speaker';

import PropTypes from 'prop-types';

const api = import.meta.env.VITE_API_URL;

Clock.propTypes = {
  restart: PropTypes.func,
  allowAudio: PropTypes.bool,
  gameOver: PropTypes.bool,
};

const getSessionID = async (wipe) => {
  if (wipe) window.sessionStorage.removeItem('sessionId');

  if (window.sessionStorage.getItem('sessionId')) return window.sessionStorage.getItem('sessionId');

  let sessionId = '';
  for (let i = 0; i < 5; i++) {
    sessionId += Math.random().toString(36).substring(2);
  }

  window.sessionStorage.setItem('sessionId', sessionId);

  return sessionId;
};

export default function Clock({
  restart,
  allowAudio,
  gameOver,
  shouldRestart,
  setShouldRestart,
  puzzleId,
}) {
  const [timer, setTimer] = React.useState(0);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [tickPlaying, setTickPlaying] = React.useState(false);
  const clock = React.useRef(null);

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
    setTimerRunning(false);
    setTimer(0);
    restart();
  };

  useEffect(() => {
    if (!shouldRestart) return;
    handleRestart();
    setShouldRestart(false);
  }, [shouldRestart]);

  useEffect(() => {
    if (gameOver) return;
    if (timerRunning) return;
    setTimerRunning(true);
  }, [gameOver, timerRunning]);

  useEffect(() => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (gameOver) {
      const endTime = async () => {
        const sessionId = await getSessionID();
        const response = await fetch(`${api}/time/end/${sessionId}`, options);
        const data = await response.json();
      };
      endTime();
      return;
    }

    if (timerRunning) return;
    const startTime = async () => {
      const sessionId = await getSessionID();
      const response = await fetch(`${api}/time/start/${sessionId}`, options);
      const data = await response.json();
    };
    startTime();
  }, [timerRunning, gameOver]);

  const handleSaveTime = async () => {
    const sessionId = await getSessionID();
    if (!gameOver) return alert('Game is not over!\nPlease finish the game to log your time.');

    const name = prompt('Enter your name');

    if (!name) return;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${api}/time/save/${sessionId}/${name}/${puzzleId}`, options);
    const data = await response.json();

    console.log(data);
    if (!data.duration) return alert(`Error saving time:\n\n ${data}`);
    getSessionID(true);
  };

  return (
    <div ref={clock}>
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
          <button className="log" onClick={handleSaveTime}>
            log
          </button>
        </div>
      </div>
    </div>
  );
}
