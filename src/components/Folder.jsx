import React, { useEffect } from 'react';
import '../Folder.css';
import CaseFiles from './CaseFiles';
import CaseDetails from './CaseDetails';

const api = import.meta.env.VITE_API_URL;

export default function Folder({ setPuzzleID, puzzleID, setShouldRestart }) {
  const [openState, setOpenState] = React.useState('open');
  const folderHolder = React.useRef(null);
  const [cases, setCases] = React.useState([]);
  const [caseDetails, setCaseDetails] = React.useState(null);

  // Define the keyframes as an array of objects
  const keyframes = [
    { transform: 'translate(-5%, 2%) rotate(3deg)', zIndex: 0 },
    {
      transform: `translate(0, ${openState === 'open' ? '-105%' : '105%'}) rotate(0deg)`,
      zIndex: 0,
      offset: 0.3,
    },
    {
      transform: `translate(0, ${openState === 'open' ? '-105%' : '105%'}) rotate(0deg)`,
      zIndex: 1,
      offset: 0.7,
    },
    { transform: 'translate(0, 0) rotate(0deg)', zIndex: 1 },
  ];

  // Define the animation options as an object
  const keyframeOptions = {
    duration: 1500, // in milliseconds
    easing: 'ease-in-out', // or any other timing function
    iterations: 1, // or any other number or 'infinite'
    fill: 'forwards', // or any other option
    delay: openState === 'closed' ? 800 : 0,
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${api}/puzzles`);
      const data = await response.json();
      setCases(data);
    };
    fetchData();
  }, []);

  const handleClick = (e) => {
    if (!puzzleID) return; // should no be able to close when no puzzle is selected
    console.log(e.target.tagName);
    if (e.target.tagName !== 'DIV') return; // only close when clicking on the folder itself, not buttons
    setOpenState(openState === 'closed' ? 'open' : 'closed');
  };

  useEffect(() => {
    if (!folderHolder.current) return;
    folderHolder.current.animate(keyframes, {
      ...keyframeOptions,
      direction: openState === 'open' ? 'normal' : 'reverse',
    });
  }, [openState, folderHolder]);

  const handleOpenCase = (id) => {
    setPuzzleID(id);
    setOpenState('closed');
    setTimeout(() => {
      setShouldRestart(true);
    }, 1500);
  };

  const handleViewDetails = (id) => {
    setCaseDetails(cases.find((c) => c._id === id));
  };

  return (
    <div className={`folderHolder  ${openState}`} ref={folderHolder}>
      <div className="backdrop"></div>
      <div className={`folder`} onClick={handleClick}>
        <div className="left">
          <div className="cover">
            <h1>Case Files</h1>
          </div>
          <div className="inner">
            <CaseFiles
              cases={cases}
              handleOpenCase={handleOpenCase}
              handleViewDetails={handleViewDetails}
            />
          </div>
        </div>
        <div className="right">
          <CaseDetails caseDetails={caseDetails} openState={openState} />
        </div>
      </div>
    </div>
  );
}
