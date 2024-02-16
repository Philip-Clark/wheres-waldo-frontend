import React, { useEffect } from 'react';
import '../Folder.css';

const api = import.meta.env.VITE_API_URL;

export default function Folder() {
  const [openState, setOpenState] = React.useState('closed');
  const [cases, setCases] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${api}/puzzles`);
      const data = await response.json();
      setCases(data);
    };
    fetchData();
  }, []);

  const handleClick = () => {
    setOpenState(openState === 'closed' ? 'open' : 'closed');
  };

  return (
    <div className="folderHolder">
      <div className="backdrop"></div>
      <div className={`folder ${openState}`} onClick={handleClick}>
        <div className="left">
          <p>Left page</p>
          <div className="caseFiles">
            <div className="cases">
              {cases.map((c) => (
                <div className="case" key={c._id}>
                  <img src={api + c.imageURL} alt={c.name} width={100} />
                  <div>
                    <h3>{c.name}</h3>
                    <p>{c.characters.length} Suspects involved</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="right">
          <p>Right page</p>
        </div>
      </div>
    </div>
  );
}
