import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { VotingContext } from "../context/VotingContext";

const CandidateRegistration = () => {
  const {
    currentAccount,
    isRegistered,
    isCandidate,
    setIsCandidate,
    canApplyForCandidate,
  } = useContext(VotingContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      // Create FormData object
      const formData = new FormData();

      // Add text fields to formData
      formData.append("party", data.party);
      formData.append("manifesto", data.manifesto);
      formData.append("wallet_address", currentAccount || null);

      // Add the document file
      if (data.document && data.document.length > 0) {
        formData.append("document", data.document[0]);
      }

      console.log("Current Account:", currentAccount);

      // Log formData entries for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch("http://localhost:3000/registerCandidate", {
        method: "POST",
        // Don't set Content-Type header when using FormData
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setIsCandidate(true);
        console.log(
          "Candidate registered successfully:",
          result.data,
          isCandidate
        );
        alert("Candidate registered successfully!");
        navigate("/");
      } else {
        console.error("Registration failed:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering the candidate.");
    }
  };

  return (
    <div className="CandidateRegistration">
      <h1 className="candidateRegistration__h1">Candidate Registration</h1>

      {isSubmitting && (
        <p className="candidateRegistration__loading">Loading...</p>
      )}
      {console.log("can apply?", canApplyForCandidate)}
      {canApplyForCandidate ? (
        <div>
          {currentAccount && isRegistered && !isCandidate ? (
            <form
              className={
                isSubmitting
                  ? "candidateRegistration__form__submitted"
                  : "candidateRegistration__form__unsubmitted"
              }
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              encType="multipart/form-data"
            >
              <input
                {...register("party", {
                  required: {
                    value: true,
                    message: "You can't leave this blank",
                  },
                  minLength: {
                    value: 3,
                    message: "Should be at least 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Maximum 20 characters allowed",
                  },
                })}
                className="candidateRegistration__input"
                type="text"
                placeholder="Party"
              />
              {errors.party && (
                <div className="registration__error__message">
                  {errors.party.message}
                </div>
              )}

              <input
                {...register("manifesto", {
                  required: {
                    value: true,
                    message: "You can't leave this blank",
                  },
                })}
                className="candidateRegistration__input manifesto"
                type="text"
                placeholder="Candidate Message"
              />
              {errors.manifesto && (
                <div className="registration__error__message">
                  {errors.manifesto.message}
                </div>
              )}
              <label style={{ color: "grey" }}>
                Please upload supporting document
              </label>
              <input
                {...register("document", {
                  required: {
                    value: true,
                    message: "You can't leave this blank",
                  },
                })}
                className="candidateRegistration__input"
                type="file"
                accept="application/pdf/*"
                // placeholder="Please upload supporting documents"
              />
              {errors.document && (
                <div className="registration__error__message">
                  {errors.document.message}
                </div>
              )}

              <input
                disabled={isSubmitting}
                className="candidateRegistration__button"
                type="submit"
                value={isSubmitting ? "Registering..." : "Register"}
              />
            </form>
          ) : (
            <h2 className="candidateRegistration__h2">
              You shouldn't be here. Go to Home Page.
            </h2>
          )}
        </div>
      ) : (
        <h2 className="candidateRegistration__h2">
          You must be atleast 25 years old.
        </h2>
      )}
    </div>
  );
};

export default CandidateRegistration;
