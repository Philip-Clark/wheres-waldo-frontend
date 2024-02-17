import React, { useEffect, useRef } from 'react';
import './App.css';
import './clock.css';
import CharacterPopUp from './components/CharacterPopUp';
import Magnifier from 'react-magnifier';
import Speaker from './components/Speaker';
import { Line } from 'react-lineto';
import Pin from './components/Pin';
import SuspectList from './components/SuspectList';
import Yarn from './components/Yarn';
import AddYarn from './components/Yarn';
import Clock from './components/Clock';
import music from '/audio/music2.mp3';
import ac from '/audio/ac.mp3';
import city from '/audio/city.mp3';
import clock from '/audio/clock.mp3';
import pencilSound1 from '/audio/pencil1.mp3';
import pencilSound2 from '/audio/pencil2.mp3';
import pencilSound3 from '/audio/pencil3.mp3';
import Folder from './components/Folder';

const api = import.meta.env.VITE_API_URL;

const App = () => {
  const [characters, setCharacters] = React.useState([]);
  const image = useRef(null);
  const [foundCharacters, setFoundCharacters] = React.useState([]);
  const [foundCharacterCoords, setFoundCharacterCoords] = React.useState([]);
  const [puzzle, setPuzzle] = React.useState(null);
  const [selectingCharacter, setSelectingCharacter] = React.useState(false);
  const [waldoImage, setWaldoImage] = React.useState(null);
  const [puzzleID, setPuzzleID] = React.useState(null);
  const [imageSize, setImageSize] = React.useState({ x: 0, y: 0 });
  const [allowAudio, setAllowAudio] = React.useState(false);
  const [pencilSoundsPlay, setPencilSoundsPlay] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(true);
  const [zoom, setZoom] = React.useState(2);
  const [shouldRestart, setShouldRestart] = React.useState(false);

  useEffect(() => {
    const handleZoom = (e) => {
      setZoom(Math.min(Math.max(zoom + e.wheelDelta / 300, 0.7), 5));
    };
    window.addEventListener('wheel', handleZoom);

    return () => {
      window.removeEventListener('wheel', handleZoom);
    };
  }, [zoom]);

  const handleRestart = () => {
    setFoundCharacters([]);
    setFoundCharacterCoords([]);
    setGameOver(false);
  };

  const handleAllowAudio = () => {
    setAllowAudio(!allowAudio);
  };

  useEffect(() => {
    async function fetchData() {
      if (!puzzleID) return;
      const puzzle = await fetch(`${api}/puzzle/${puzzleID}`).then((res) => res.json());
      setPuzzle(puzzle);
      const waldoImage = await fetch(`${api}/puzzle/${puzzle._id}/imageURL`).then((res) =>
        res.json()
      );
      setPuzzleID(puzzle._id);
      setWaldoImage(waldoImage);

      setCharacters(puzzle.characters.sort(() => (Math.random() > 0.5 ? 1 : -1)));

      const imageSize = await fetch(`${api}/puzzle/${puzzle._id}/imageSize`).then((res) =>
        res.json()
      );

      setImageSize(imageSize);
      setGameOver(false);
    }
    fetchData();
  }, [puzzleID]);

  useEffect(() => {
    if (foundCharacters.length === 0) return;
    setPencilSoundsPlay(true);
    if (foundCharacters.length === characters.length) setGameOver(true);
  }, [foundCharacters]);

  const pencilSounds = [pencilSound1, pencilSound2, pencilSound3];

  return (
    <div className="App">
      <div className="dataArea">
        <div className="notepad">
          <h1>Suspects to find</h1>
          <SuspectList characters={characters} foundCharacters={foundCharacters} />
        </div>
      </div>
      <Folder
        setPuzzleID={setPuzzleID}
        puzzleID={puzzleID}
        restart={handleRestart}
        setShouldRestart={setShouldRestart}
      />

      <div className="searchArea">
        <div id="polaroid" className="polaroid">
          <Magnifier
            src={waldoImage}
            ref={image}
            width={'auto'}
            height={'100%'}
            className="image"
            mgShowOverflow={true}
            zoomFactor={zoom}
            mgBorderWidth={0}
          />
          <p>{puzzle?.name}</p>

          {foundCharacterCoords.map(({ name, x, y }) => {
            return (
              <Pin classToAdd={`absolute ${name}-pin-a`} key={name} position={{ x: x, y: y }} />
            );
          })}
          {foundCharacterCoords.map(({ name, x, y }) => {
            return (
              <div
                key={name}
                className={`lineHolder${name}`}
                style={{
                  transform: '',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              ></div>
            );
          })}

          {foundCharacterCoords.map(({ name }) => {
            return <Yarn key={name} name={name} />;
          })}
        </div>
      </div>
      <CharacterPopUp
        image={image}
        characters={characters}
        setSelectingCharacter={setSelectingCharacter}
        style={{ zIndex: 100 }}
        foundCharacters={foundCharacters}
        setFoundCharacters={setFoundCharacters}
        setFoundCharacterCoords={setFoundCharacterCoords}
        foundCharacterCoords={foundCharacterCoords}
        imageSize={imageSize}
        puzzleID={puzzleID}
      />

      <video className="grain" src="./grain.mp4" autoPlay loop muted controls={false} />
      <Speaker src={music} volume={0.02} playing={true} allowAudio={allowAudio} loop />
      <Speaker src={ac} volume={0.05} playing={true} allowAudio={allowAudio} loop />
      <Speaker src={clock} volume={0.2} playing={true} allowAudio={allowAudio} loop />
      <Speaker src={city} volume={0.1} playing={true} allowAudio={allowAudio} loop />

      <Speaker
        src={pencilSounds[Math.floor(Math.random() * pencilSounds.length)]}
        volume={1}
        playing={pencilSoundsPlay}
        onended={() => {
          setPencilSoundsPlay(false);
        }}
        allowAudio={allowAudio}
      />

      <Clock
        restart={handleRestart}
        allowAudio={allowAudio}
        gameOver={gameOver}
        shouldRestart={shouldRestart}
        setShouldRestart={setShouldRestart}
      />

      <button onClick={handleAllowAudio} className="toggleAudio">
        {allowAudio ? 'pause' : 'play'} Audio
      </button>
    </div>
  );
};

export default App;
