const api = import.meta.env.VITE_API_URL;

export const checkForCharacter = async (rect, character, puzzleID) => {
  //replace with api call to check coords
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: character.name, rect: rect }),
  };
  const match = await fetch(`${api}/puzzle/${puzzleID}/guess`, options).then((res) => res.json());
  return match.value;
};
