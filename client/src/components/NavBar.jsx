import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { VotingContext } from "../context/VotingContext";

export const NavBar = () => {
  const { isRegistered, isCandidate } = useContext(VotingContext);

  return (
    <div className="NavBar">
      <nav className="navbar">
        <ul className="navbar__ul">
          <li className="navbar__ul__li">
            <Link to="/">Home</Link>
          </li>
          <li className="navbar__ul__li">
            {isRegistered && <Link to="/vote">Vote</Link>}
          </li>
          {isRegistered && isCandidate === false && (
            <li className="navbar__ul__li">
              <Link to="/candidateRegistration">Become a Candidate</Link>
            </li>
          )}
          <li className="navbar__ul__li">
            <Link to="/results">Results</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
