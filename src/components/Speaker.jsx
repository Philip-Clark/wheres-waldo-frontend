import React, { useEffect, useState } from 'react';

export default function Speaker({ src, volume, playing, allowAudio, loop, onended }) {
  let audioSrc = src;
  if (typeof src == 'object') {
    const newSrc = src[Math.floor(Math.random() * src.length)];
    audioSrc = newSrc;
  }

  const [audio, setAudio] = useState(new Audio(audioSrc));

  audio.volume = volume;
  audio.loop = loop;

  audio.onended = () => {
    onended();
  };

  useEffect(() => {
    if (allowAudio && playing) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [allowAudio, audio]);

  useEffect(() => {
    if (typeof src == 'object') {
      const newsrc = src[Math.floor(Math.random() * src.length)];
      audio.src = newsrc;
    }

    if (playing) {
      try {
        audio.play();
      } catch (error) {
        console.log(error);
      }
    } else {
      audio.pause();
    }
  }, [playing, audio]);
}
