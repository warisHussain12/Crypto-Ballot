import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import { contractAddress, contractABI } from "../utils/constants";
import { VotingContext } from "./VotingContext";

const { ethereum } = window;

export const VotingContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isRegistered, setIsRegistered] = useState(null);
  const [voterData, setVoterData] = useState(null);
  const [candidateData, setCandidateData] = useState(null);
  const [isCandidate, setIsCandidate] = useState(null);
  const [allCandidates, setAllCandidates] = useState([]);
  const [canApplyForCandidate, setCanApplyForCandidate] = useState(false);

  async function connectWallet() {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      }
    } catch (err) {
      if (err.code === 4001) {
        console.log("Please connect to MetaMask.");
      } else {
        console.error(err);
      }
    }
  }

  const checkWalletExists = async () => {
    if (!currentAccount) return;

    try {
      const response = await fetch(
        `http://localhost:3000/check-wallet/${currentAccount}`
      );
      const data = await response.json();

      if (data.exists) {
        setIsRegistered(true);
        console.log("Wallet exists in DB:", data.voter);
      } else {
        setIsRegistered(false);
        console.log("Wallet does not exist in DB.");
      }
    } catch (error) {
      console.error("Error checking wallet:", error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return;

      // This gets accounts without prompting
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initializeContract = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const votingContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    return votingContract;
  };

  const getCandidateVoteCount = async (candidateAddress) => {
    const contract = await initializeContract();
    const voteCount = await contract.candidateVoteCount(candidateAddress);
    return voteCount;
  };

  const checkIfVoterHasVoted = async (voterAddress) => {
    const contract = await initializeContract();
    const hasVoted = await contract.hasVoted(voterAddress); // Assuming your contract has a `hasVoted` mapping
    console.log("Did you vote?", hasVoted);
    return hasVoted;
  };

  const fetchVoterData = async () => {
    if (!currentAccount) return;

    try {
      const response = await fetch(
        `http://localhost:3000/voter/${currentAccount}`
      );
      const data = await response.json();

      if (data.success) {
        setVoterData(data.voter);
        if (data.voter.dob) {
          const dob = new Date(data.voter.dob);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
          ) {
            age--;
          }

          // Set canApplyForCandidate based on age requirement (25+)
          setCanApplyForCandidate(age >= 25);
        }
      }
    } catch (error) {
      console.error("Error fetching voter data:", error);
    }
  };

  const fetchCandidateData = async () => {
    if (!currentAccount) return;

    try {
      const response = await fetch(
        `http://localhost:3000/candidate/${currentAccount}`
      );
      const data = await response.json();

      if (data.success) {
        setCandidateData(data.candidate); // Changed from data.voter
        setIsCandidate(true);
      } else {
        setIsCandidate(false); // Added this line to handle case when not a candidate
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
      setIsCandidate(false); // Set to false on error
    }
  };

  const fetchAllCandidates = async () => {
    try {
      const response = await fetch("http://localhost:3000/candidates");
      const data = await response.json();

      if (data.success) {
        setAllCandidates(data.candidates);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (currentAccount) {
      checkWalletExists();
      fetchVoterData();
      fetchCandidateData();
    }
  }, [currentAccount]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          // Don't reload the page - React will handle updates
        } else {
          // Wallet disconnected or locked
          setCurrentAccount(null);
          setIsRegistered(null);
          setIsCandidate(null);
        }
      });

      return () => {
        window.ethereum.removeListener("accountsChanged", () => {});
      };
    }
  }, []);

  useEffect(() => {
    if (isRegistered) {
      fetchVoterData();
    }
  }, [isRegistered]);

  const contextValue = {
    currentAccount,
    connectWallet,
    checkIfWalletIsConnected,
    isRegistered,
    setIsRegistered,
    isCandidate,
    setIsCandidate,
    voterData,
    candidateData,
    fetchVoterData,
    fetchCandidateData,
    allCandidates,
    fetchAllCandidates,
    getCandidateVoteCount,
    checkIfVoterHasVoted,
    initializeContract,
    canApplyForCandidate,
    setCanApplyForCandidate,
  };

  return (
    <VotingContext.Provider value={contextValue}>
      {children}
    </VotingContext.Provider>
  );
};
