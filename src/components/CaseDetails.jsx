import React, { useEffect } from 'react';
const api = import.meta.env.VITE_API_URL;
export default function CaseDetails({ caseDetails, openState }) {
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
          <h1>Case Details</h1>
          <p>
            Case ID: #
            {parseInt(Math.random().toPrecision(8) * 100000)
              .toString()
              .padStart(5, '0')}
          </p>
          <p>Case Name: {caseDetails.name}</p>
          <p>Suspects involved: </p>
          <ul>
            {caseDetails.characters.map((c) => (
              <li key={c._id}>{c.name}</li>
            ))}
          </ul>
          <h2>Top Detectives on the case</h2>
          <ul className="times">
            {bestTimes &&
              bestTimes.slice(0, 10).map((time, i) => (
                <li className="timeLog" key={i}>
                  <h3>{formatTime(time.duration)}</h3>
                  <p> | </p>
                  <h3>{time.name}</h3>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
