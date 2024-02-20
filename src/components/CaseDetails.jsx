import React, { useEffect } from 'react';
const api = import.meta.env.VITE_API_URL;
export default function CaseDetails({ caseDetails, openState, handleOpenCase }) {
  const [bestTimes, setBestTimes] = React.useState([]);

  useEffect(() => {
    if (openState === 'closed') return;
    if (!caseDetails) return;
    const fetchData = async () => {
      return await fetch(`${api}/time/top/${caseDetails._id}`).then((res) => res.json());
    };
    fetchData().then((data) => setBestTimes(data.topTimes));
  }, [caseDetails, openState]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="caseDetails">
      {caseDetails && (
        <div>
          <p>
            Case Name: {caseDetails.name} ---- Case ID: #
            {parseInt(Math.random().toPrecision(8) * 100000)
              .toString()
              .padStart(5, '0')}
          </p>
          <p>Suspects involved: </p>
          <ul>
            {caseDetails.characters.map((c) => (
              <li key={c._id}>{c.name}</li>
            ))}
          </ul>
          <hr />
          <h3>Top Detectives on the case</h3>
          <ul className="times">
            {bestTimes &&
              bestTimes.slice(0, 5).map((time, i) => (
                <li className="timeLog" key={i}>
                  <p>{formatTime(time.duration)}</p>
                  <p> | </p>
                  <p>{time.name}</p>
                </li>
              ))}
          </ul>

          <div className="openCase">
            <button
              onClick={() => {
                handleOpenCase(caseDetails._id);
              }}
            >
              Work on Case
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
