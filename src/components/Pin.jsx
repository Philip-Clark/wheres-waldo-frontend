import React from 'react';
const pins = ['/pins/pin-06.png', '/pins/pin-15.png'];

export default function Pin({ classToAdd, position }) {
  const [pin] = React.useState(pins[Math.floor(Math.random() * pins.length)]);
  return (
    <div className={`pin ${classToAdd}`} style={{ top: position.y, left: position.x }}>
      <img src={pin} alt="" width={'50'} height={'50'} />
    </div>
  );
}
