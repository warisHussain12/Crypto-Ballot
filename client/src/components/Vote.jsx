import React, { useState, useContext, useEffect } from "react";
import { VotingContext } from "../context/VotingContext";

const Vote = () => {
  const {
    currentAccount,
    candidateData,
    isRegistered,
    allCandidates,
    fetchAllCandidates,
    checkIfVoterHasVoted,
    initializeContract,
  } = useContext(VotingContext);

  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [votedFor, setVotedFor] = useState(null);

  useEffect(() => {
    const checkVoterStatus = async () => {
      if (currentAccount && isRegistered) {
        const voted = await checkIfVoterHasVoted(currentAccount); // Pass currentAccount to the function
        setHasVoted(voted);
      }
    };

    fetchAllCandidates();
    checkVoterStatus();
  }, [currentAccount, candidateData]);

  // Filter candidates to exclude those with a null or undefined party field
  const filteredCandidates = allCandidates
    ? allCandidates.filter(
        (candidate) => candidate.party !== null && candidate.party !== undefined
      )
    : [];

  const handleVoteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowConfirmation(true);
  };

  const confirmVote = async () => {
    try {
      const contract = await initializeContract();
      const tx = await contract.vote(selectedCandidate.wallet_address);
      await tx.wait();

      setHasVoted(true);
      setVotedFor(selectedCandidate);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error voting:", error);
      setShowConfirmation(false);
    }
  };

  const cancelVote = () => {
    setSelectedCandidate(null);
    setShowConfirmation(false);
    setHasVoted(false);
  };

  if (!allCandidates || allCandidates.length === 0) {
    return <div className="loading-card">Loading candidates...</div>;
  }

  return (
    <div className="Vote">
      {isRegistered ? (
        <div>
          <h1 className="vote__h1">Voting Area</h1>
          <h2 className="vote__h2">Candidate List</h2>
          {isRegistered && showConfirmation ? (
            <div className="vote-confirmation">
              <p className="vote-confirmation__text">
                Are you sure you want to vote for {selectedCandidate.name}? This
                action cannot be undone.
              </p>
              <div className="vote-confirmation__buttons">
                <button
                  className="vote__table__button vote__table__button--confirm"
                  onClick={confirmVote}
                >
                  Confirm
                </button>
                <button
                  className="vote__table__button vote__table__button--cancel"
                  onClick={cancelVote}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="vote__table__container">
              <table className="vote__table">
                <thead className="vote__table__thead">
                  <tr className="vote__table__tr">
                    <th className="vote__table__th">Candidate</th>
                    <th className="vote__table__th">Party</th>
                    <th className="vote__table__th">Candidate Message</th>
                    <th className="vote__table__th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="vote__table__tr">
                      <td className="vote__table__td">
                        {candidate.profile_photo ? (
                          <div className="vote__table__candidate__image__container">
                            <img
                              src={`http://localhost:3000/${candidate.profile_photo}`}
                              alt="Profile"
                              className="vote__table__candidate__image"
                            />
                            <p className="vote__table__candidate__image__footer">
                              {candidate.name}
                            </p>
                          </div>
                        ) : (
                          <div className="vote__table__candidate__image">
                            No image available
                          </div>
                        )}
                      </td>
                      <td className="vote__table__td">{candidate.party}</td>
                      <td className="vote__table__td">{candidate.manifesto}</td>
                      <td className="vote__table__td">
                        {hasVoted ? (
                          votedFor && votedFor.id === candidate.id ? (
                            <span className="voted-for">
                              You voted for this candidate
                            </span>
                          ) : (
                            <span className="not-selected">
                              You can't vote now
                            </span>
                          )
                        ) : (
                          <button
                            className="vote__table__button"
                            onClick={() => handleVoteClick(candidate)}
                          >
                            Vote
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <h1 className="vote__h1">You shouldn't be here</h1>
      )}
    </div>
  );
};

export default Vote;
