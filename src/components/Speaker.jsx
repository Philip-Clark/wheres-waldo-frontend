import React, { useEffect, useState } from 'react';

export default function Speaker({ src, volume, playing, allowAudio, loop, onended }) {
  const [audio, setAudio] = useState(false);

  useEffect(() => {
    const newAudio = new Audio(src);
    newAudio.volume = volume;
    newAudio.loop = loop;

    newAudio.onended = () => {
      onended();
    };
    setAudio(newAudio);
  }, [src]);

  useEffect(() => {
    if (!audio) return;
    if (allowAudio && playing) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [allowAudio, audio, playing]);

  useEffect(() => {
    if (!audio) return;
    if (typeof src == 'object') {
      const newsrc = src[Math.floor(Math.random() * src.length)];
      audio.src = newsrc;
    }

    if (playing) {
      try {
        audio.play();
      } catch (error) {}
    } else {
      audio.pause();
    }
  }, [playing, audio]);
}
