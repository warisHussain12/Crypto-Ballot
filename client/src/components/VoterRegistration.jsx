import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { VotingContext } from "../context/VotingContext";

const VoterRegistration = () => {
  const { currentAccount, isRegistered, setIsRegistered } =
    useContext(VotingContext);
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

      // Add all text fields to formData
      Object.keys(data).forEach((key) => {
        if (key !== "profile_photo") {
          formData.append(key, data[key]);
        }
      });

      // Add file separately - handle it differently because it's a FileList
      if (data.profile_photo && data.profile_photo.length > 0) {
        formData.append("profile_photo", data.profile_photo[0]);
      }

      // Add wallet address
      if (currentAccount) {
        formData.append("wallet_address", currentAccount);
      }

      console.log("Current Account:", currentAccount);

      // Log formData entries for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        // Important: Do NOT set Content-Type header when sending FormData
        // The browser will automatically set it with the correct boundary
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Voter registered successfully:", result.data);
        alert("Voter registered successfully!");
        setIsRegistered(true);
        navigate("/");
      } else {
        console.error("Registration failed:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering the voter.");
    }
  };

  return (
    <div className="VoterRegistration">
      <h1 className="voterRegistration__h1">Voter Registration</h1>

      {isSubmitting && <p className="voterRegistration__loading">Loading...</p>}
      {currentAccount && !isRegistered ? (
        <form
          className={
            isSubmitting
              ? "voterRegistration__form__submitted"
              : "voterRegistration__form__unsubmitted"
          }
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          {errors.name && (
            <div className="registration__error__message">
              {errors.name.message}
            </div>
          )}
          <input
            {...register("name", {
              required: { value: true, message: "You can't leave this blank" },
              minLength: {
                value: 3,
                message: "Should be at least 3 characters",
              },
              maxLength: {
                value: 20,
                message: "Maximum 20 characters allowed",
              },
            })}
            className="voterRegistration__input"
            type="text"
            placeholder="Name"
          />

          {errors.dob && (
            <div className="registration__error__message">
              {errors.dob.message}
            </div>
          )}
          <input
            {...register("dob", {
              required: { value: true, message: "You can't leave this blank" },
              validate: (value) => {
                const dob = new Date(value);
                const today = new Date();
                let age = today.getFullYear() - dob.getFullYear();
                const monthDiff = today.getMonth() - dob.getMonth();
                if (
                  monthDiff < 0 ||
                  (monthDiff === 0 && today.getDate() < dob.getDate())
                ) {
                  age--;
                }
                return age >= 18 || "You must be at least 18 years old.";
              },
            })}
            className="voterRegistration__input"
            type="date"
            placeholder="Date of Birth"
          />
          {errors.email && (
            <div className="registration__error__message">
              {errors.email.message}
            </div>
          )}

          <input
            {...register("email", {
              required: { value: true, message: "You can't leave this blank" },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
            className="voterRegistration__input"
            type="email"
            placeholder="Email"
          />

          {errors.voter_id && (
            <div className="registration__error__message">
              {errors.voter_id.message}
            </div>
          )}
          <input
            {...register("voter_id", {
              required: { value: true, message: "You can't leave this blank" },
              minLength: {
                value: 10,
                message: "Should be of 10 characters",
              },
              maxLength: {
                value: 10,
                message: "Maximum 10 characters allowed",
              },
            })}
            className="voterRegistration__input"
            type="text"
            placeholder="Voter ID"
          />
          {errors.aadhar_number && (
            <div className="registration__error__message">
              {errors.aadhar_number.message}
            </div>
          )}

          <input
            {...register("aadhar_number", {
              required: { value: true, message: "You can't leave this blank" },
              minLength: { value: 12, message: "Should be 12 digits" },
              maxLength: { value: 12, message: "Should be 12 digits" },
            })}
            className="voterRegistration__input"
            type="number"
            placeholder="Aadhar Number"
          />

          {errors.address && (
            <div className="registration__error__message">
              {errors.address.message}
            </div>
          )}
          <input
            {...register("address", {
              required: { value: true, message: "You can't leave this blank" },
              minLength: {
                value: 3,
                message: "Should be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Maximum 100 characters allowed",
              },
            })}
            className="voterRegistration__input"
            type="text"
            placeholder="Address"
          />
          {errors.profile_photo && (
            <div className="registration__error__message">
              {errors.profile_photo.message}
            </div>
          )}
          <label style={{ color: "grey" }}>
            Please upload your profile picture
          </label>
          <input
            {...register("profile_photo", {
              required: { value: true, message: "You can't leave this blank" },
            })}
            className="voterRegistration__input"
            type="file"
            placeholder="Profile Photo"
          />
          <input
            disabled={isSubmitting}
            className="voterRegistration__button"
            type="submit"
            value={isSubmitting ? "Registering..." : "Register"}
          />
        </form>
      ) : (
        <h2 className="voterRegistration__h2">Go to Home Page</h2>
      )}
    </div>
  );
};

export default VoterRegistration;
