import React, { useEffect } from 'react';

const api = import.meta.env.VITE_API_URL;

export default function CaseFiles({ cases, handleOpenCase, handleViewDetails }) {
  const [paginatedCases, setPaginatedCases] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    setPaginatedCases(cases.slice((currentPage - 1) * 5, currentPage * 5));
  }, [currentPage, cases]);

  return (
    <div className="caseFiles">
      <div className="cases">
        {cases.map((c) => (
          <div className="case" key={c._id}>
            <img src={api + c.imageURL} alt={c.name} width={100} />
            <div>
              <h3>{c.name}</h3>
              <p>{c.characters.length} Suspects involved</p>

              <button
                onClick={() => {
                  handleViewDetails(c._id);
                }}
              >
                View Details
              </button>
              <button
                onClick={() => {
                  handleOpenCase(c._id);
                }}
              >
                Work on case
              </button>
            </div>
          </div>
        ))}
        {paginatedCases.length > 1 && (
          <div className="pagination">
            <button
              onClick={() => {
                setCurrentPage(currentPage - 1);
              }}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => {
                setCurrentPage(currentPage + 1);
              }}
              disabled={currentPage * 5 >= cases.length}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
