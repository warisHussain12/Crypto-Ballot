// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Elections {
    mapping(address => uint256) public candidateVoteCount;
    mapping(address => bool) public hasVoted;
    mapping(address => uint8) private voterVotes;

    event Voted(address voter, address candidate);

    // Function to vote for a candidate
    function vote(address candidate) public {
        require(
            !hasVoted[msg.sender] && voterVotes[msg.sender] == 0,
            "You have already voted."
        );

        candidateVoteCount[candidate] += 1;
        voterVotes[msg.sender] += 1;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, candidate);
    }
}
