import { Line } from 'react-lineto';

const Yarn = ({ name }) => {
  const pinB = document.getElementsByClassName(`${name}-pin-b`)[0];
  const pinA = document.getElementsByClassName(`${name}-pin-a`)[0];
  const lineHolder = document.getElementsByClassName(`lineHolder${name}`)[0];

  if (!pinA || !pinB || !lineHolder) return null;
  const posA = pinA.getBoundingClientRect();
  const posB = pinB.getBoundingClientRect();
  const lineHolderRect = lineHolder.getBoundingClientRect();

  const fixedA = {
    x: posA.x - lineHolderRect.x,
    y: posA.y - lineHolderRect.y,
  };
  const fixedB = {
    x: posB.x - lineHolderRect.x,
    y: posB.y - lineHolderRect.y,
  };

  return (
    <div key={name}>
      <Line
        x0={fixedA.x + 7}
        y0={fixedA.y - 3}
        x1={fixedB.x + 8}
        y1={fixedB.y - 5}
        zIndex={0}
        borderColor="#c41e1e"
        borderWidth={4}
        within={`lineHolder${name}`}
        className={`line ${name}-line lineTo`}
      />
    </div>
  );
};

export default Yarn;
