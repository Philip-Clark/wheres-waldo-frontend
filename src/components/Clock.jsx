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
    setTimerRunning(false);
    setTimer(0);
    restart();
  };

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
    console.log(timerRunning);

    if (gameOver) {
      const endTime = async () => {
        const sessionId = await getSessionID();
        console.log('🚀 ~ endTime ~ sessionId:', sessionId);
        const response = await fetch(`${api}/time/end/${sessionId}`, options);
        const data = await response.json();
        console.log('🚀 ~ endTime ~ data:', data);
      };
      endTime();
      return;
    }

    if (timerRunning) return;
    const startTime = async () => {
      const sessionId = await getSessionID();
      console.log('🚀 ~ useEffect ~ sessionId:', sessionId);
      const response = await fetch(`${api}/time/start/${sessionId}`, options);
      const data = await response.json();
      console.log('🚀 ~ useEffect ~ data:', data);
    };
    startTime();
  }, [timerRunning, gameOver]);

  const handleSaveTime = async () => {
    console.log('handleSaveTime');

    const sessionId = await getSessionID();
    console.log('sessionId', sessionId);

    const name = prompt('Enter your name');
    console.log('name', name);

    if (!name) return;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${api}/time/save/${sessionId}/${name}`, options);
    const data = await response.json();

    console.log(data);

    getSessionID(true);
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
          <button className="log" onClick={handleSaveTime}>
            log
          </button>
        </div>
      </div>
    </div>
  );
}
