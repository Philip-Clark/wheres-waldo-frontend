import Pin from './Pin';

const SuspectList = ({ characters, foundCharacters }) => {
  return (
    <ul>
      {characters.map((character) => (
        <li
          key={character.name}
          className={
            foundCharacters.includes(character.name) ? 'suspect found' : 'suspect notFound'
          }
        >
          <img src={character.image} alt={character.name} />
          <div>
            <h3>{character.name}</h3>
            <p>{character?.details}</p>
          </div>
          {foundCharacters.includes(character.name) ? (
            <Pin
              classToAdd={`${character.name}-pin-b`}
              key={character.name}
              position={{ x: 0, y: 0 }}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
};

export default SuspectList;
