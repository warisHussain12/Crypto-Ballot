import React, { useContext, useEffect } from "react";
import { VotingContext } from "../context/VotingContext";

const VoterCard = () => {
  const { isRegistered, voterData, fetchVoterData } = useContext(VotingContext);
  useEffect(() => {
    if (isRegistered && !voterData) {
      fetchVoterData();
    }
  }, [isRegistered]);

  if (!voterData) {
    return <div className="loading-card">Loading voter details...</div>;
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <div className="gov-card">
      <div className="gov-card__image-container">
        {voterData.profile_photo ? (
          <img
            src={`http://localhost:3000/${voterData.profile_photo}`}
            alt="Profile"
            className="gov-card__image"
          />
        ) : (
          <div className="gov-card__image">No image available</div>
        )}
      </div>

      <div className="gov-card__content">
        <div className="gov-card__watermark">VERIFIED</div>
        <div className="gov-card__header">
          <h3 className="gov-card__title">Electoral Identity Card</h3>
          <p className="gov-card__subtitle">
            <strong>Election Commission of India</strong>
          </p>
        </div>

        <div className="gov-card__details">
          <div className="gov-card__row">
            <span className="gov-card__label">Name:</span>
            <span className="gov-card__value">{voterData.name}</span>
          </div>

          <div className="gov-card__row">
            <span className="gov-card__label">Date of Birth:</span>
            <span className="gov-card__value">
              {voterData.dob ? formatDate(voterData.dob) : "N/A"}
            </span>
          </div>

          <div className="gov-card__row">
            <span className="gov-card__label">Email:</span>
            <span className="gov-card__value">{voterData.email}</span>
          </div>

          <div className="gov-card__row">
            <span className="gov-card__label">Voter ID:</span>
            <span className="gov-card__value">{voterData.voter_id}</span>
          </div>

          <div className="gov-card__row">
            <span className="gov-card__label">Aadhar Number:</span>
            <span className="gov-card__value">{voterData.aadhar_number}</span>
          </div>

          <div className="gov-card__row">
            <span className="gov-card__label">Address:</span>
            <span className="gov-card__value">{voterData.address}</span>
          </div>
        </div>

        <div className="gov-card__footer">
          <div className="gov-card__signature">
            <div className="gov-card__sign-line"></div>
            <div className="gov-card__sign-title">Electoral Officer</div>
          </div>
          <div className="gov-card__stamp">
            Registered
            <br />
            Voter
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterCard;
