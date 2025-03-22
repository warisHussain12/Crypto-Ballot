import React, { useState, useContext, useEffect } from "react";
import { VotingContext } from "../context/VotingContext";

const Results = () => {
  const { allCandidates, fetchAllCandidates, getCandidateVoteCount } =
    useContext(VotingContext);

  const [candidatesWithVotes, setCandidatesWithVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch all candidates if not already loaded
      if (!allCandidates || allCandidates.length === 0) {
        await fetchAllCandidates();
      }

      if (allCandidates && allCandidates.length > 0) {
        // First filter candidates with valid party information
        const validCandidates = allCandidates.filter(
          (candidate) =>
            candidate.party !== null && candidate.party !== undefined
        );

        // Then fetch vote counts for filtered candidates only
        const candidatesData = await Promise.all(
          validCandidates.map(async (candidate) => {
            const voteCount = await getCandidateVoteCount(
              candidate.wallet_address
            );
            return {
              ...candidate,
              voteCount: voteCount ? parseInt(voteCount.toString()) : 0,
            };
          })
        );

        // Sort candidates by vote count in descending order
        const sortedCandidates = candidatesData.sort(
          (a, b) => b.voteCount - a.voteCount
        );
        setCandidatesWithVotes(sortedCandidates);
      }

      setLoading(false);
    };

    fetchData();
  }, [allCandidates]);

  if (loading) {
    return <div className="loading-card">Loading election results...</div>;
  }

  return (
    <div className="Results">
      {/* <h1 className="results__h1">Voting has not started yet.</h1> */}

      <h1 className="results__h1">Election Results</h1>
      <div className="results__table__container">
        <table className="results__table">
          <thead className="results__table__thead">
            <tr className="results__table__tr">
              <th className="results__table__th">Candidate</th>
              <th className="results__table__th">Party</th>
              <th className="results__table__th">Candidate Message</th>
              <th className="results__table__th">Vote Count</th>
            </tr>
          </thead>
          <tbody className="results__table__tbody">
            {candidatesWithVotes.map((candidate) => (
              <tr
                className={`results__table__tr ${
                  candidate.isWinner ? "results__table__tr--winner" : ""
                }`}
                key={candidate.id}
              >
                <td className="results__table__td results__table__td--candidate">
                  {candidate.profile_photo ? (
                    <div className="results__candidate__image__container">
                      <img
                        src={`http://localhost:3000/${candidate.profile_photo}`}
                        alt="Profile"
                        className="results__candidate__image"
                      />
                      <p className="results__candidate__image__footer">
                        {candidate.name}
                      </p>
                    </div>
                  ) : (
                    <div className="results__candidate__image">
                      No image available
                    </div>
                  )}
                </td>
                <td
                  className="results__table__td results__table__td--party"
                  data-party={candidate.party}
                >
                  {candidate.party}
                </td>
                <td className="results__table__td results__table__td--manifesto">
                  {candidate.manifesto}
                </td>
                <td className="results__table__td results__table__td--votes">
                  {candidate.voteCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
