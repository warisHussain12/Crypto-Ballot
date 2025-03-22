import React, { useContext } from "react";
import { VotingContext } from "../context/VotingContext";
import { Link } from "react-router-dom";
import VoterCard from "./VoterCard";

const Home = () => {
  const { connectWallet, currentAccount, isRegistered, isCandidate } =
    useContext(VotingContext);

  return (
    <div className="Home">
      <h1 className="home__h1">Crypto Ballot</h1>
      <div className="home__buttons">
        {!currentAccount ? (
          <div className="home__if__div">
            <button className="home__button" onClick={connectWallet}>
              Connect Wallet
            </button>
            <button
              className="home__button"
              onClick={() => {
                alert("Connect Wallet");
              }}
            >
              Register
            </button>
          </div>
        ) : (
          <div className="home__else__div">
            <h1 className="home__walletConnectedMessage">
              You are connected with your wallet address:{" "}
              <span className="walletAddress">{currentAccount}</span>
            </h1>
            {isRegistered ? (
              <div>
                <h1 className="home__walletConnectedMessage">
                  {isCandidate
                    ? "You are a registered voter and candidate"
                    : "You are a registered voter"}
                </h1>
                {isRegistered && <VoterCard />}
              </div>
            ) : (
              <div>
                <h2 className="voterRegistration__h2">
                  You should to register to vote.
                </h2>
                <Link to="/voterRegistration" className="home__button register">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
