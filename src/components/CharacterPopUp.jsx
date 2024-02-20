import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Highlighter from './Highlighter';
import { checkForCharacter } from '../helpers/CharacterChecker';

const screenSpaceToImageSpace = (event, cursorPosition, image, originalImageSize) => {
  if (image == null) return;

  const bounds = image.getBoundingClientRect();
  var left = bounds.left;
  var top = bounds.top;
  var x = event.pageX - left;
  var y = event.pageY - top;
  var cw = image.clientWidth;
  var ch = image.clientHeight;
  var iw = image.naturalWidth;
  var ih = image.naturalHeight;
  var px = (x / cw) * iw;
  var py = (y / ch) * ih;

  const point = { x: px, y: py };

  return point;
};

const getPinPosition = (point, image) => {
  if (image == null) return;
  const polariod = document.getElementById('polaroid');
  const transform = polariod.style.transform;

  polariod.style.transform = 'none';

  const bounds = image.getBoundingClientRect();
  const left = bounds.left;
  const top = bounds.top;
  const cw = image.clientWidth;
  const ch = image.clientHeight;
  const iw = image.naturalWidth;
  const ih = image.naturalHeight;
  const px = point.x;
  const py = point.y;
  const x = (px / iw) * cw;
  const y = (py / ih) * ch;

  const screenPoint = { x: x + left, y: y + top };
  const polariodBounds = polariod.getBoundingClientRect();
  const polariodLeft = polariodBounds.left;
  const polariodTop = polariodBounds.top;
  const relativeX = screenPoint.x - polariodLeft;
  const relativeY = screenPoint.y - polariodTop;
  polariod.style.transform = transform;

  return { x: relativeX, y: relativeY };
};

export default function CharacterPopUp({
  guessCharacter,
  image,
  characters,
  setSelectingCharacter,
  setFoundCharacters,
  foundCharacters,
  imageSize,
  puzzleID,
  setFoundCharacterCoords,
  foundCharacterCoords,
}) {
  const [rect, setRect] = React.useState({ top: 0, left: 0, bottom: 0, right: 0 });

  const [displayPopUp, setDisplayPopUp] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState({ x: 0, y: 0 });

  const handleCharacterGuess = async (character) => {
    const result = await checkForCharacter(rect, character, puzzleID);
    if (result === false) return;
    setFoundCharacters([...foundCharacters, character.name]);
    const rectCenter = { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 };
    const screenSpaceCenter = getPinPosition(rectCenter, image.current.img);
    setFoundCharacterCoords([
      ...foundCharacterCoords,
      { name: character.name, x: screenSpaceCenter.x, y: screenSpaceCenter.y },
    ]);
  };

  const updateRect = (e, pos, image) => {
    const position = screenSpaceToImageSpace(e, pos, image, imageSize);
    const rect = {
      top: position.y - 80,
      left: position.x - 80,
      bottom: position.y + 80,
      right: position.x + 80,
    };
    setRect(rect);
    return rect;
  };

  useEffect(() => {
    setSelectingCharacter(false);
    if (!image.current.img) return;
    image.current.img.addEventListener('click', (event) => {
      setDisplayPopUp(true);
      setSelectingCharacter(true);
      updateRect(event, { x: event.clientX, y: event.clientY }, image.current.img);
      setCursorPosition({ x: event.clientX, y: event.clientY });
    });
  }, [image, imageSize]);

  const handleCharacterSelect = (character) => {
    setDisplayPopUp(false);
    handleCharacterGuess(character);
    setSelectingCharacter(false);
  };

  return (
    displayPopUp && (
      <div
        className="characterPopUp"
        style={{ top: `${cursorPosition.y - 60}px`, left: `${cursorPosition.x + 60}px` }}
      >
        {characters
          .filter((character) => !foundCharacters.includes(character.name))
          .map((character, index) => {
            if (index == 0)
              return (
                <button onClick={() => handleCharacterSelect(character)} key={index} autoFocus>
                  <h2>{character.name}</h2>
                </button>
              );

            return (
              <button onClick={() => handleCharacterSelect(character)} key={index}>
                <h2>{character.name}</h2>
              </button>
            );
          })}
        {characters.filter((character) => !foundCharacters.includes(character)).length > 0 && (
          <button onClick={() => setDisplayPopUp(false)}>Close</button>
        )}
      </div>
    )
  );
}
