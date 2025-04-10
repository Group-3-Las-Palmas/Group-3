// Group-3/frontend/src/components/settingsUserComponent/settingsUserComponent.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  SettingsUserContainer,
  ProfileImage,
  ImagePlaceholder,
  UsernameBox,
  LogoutButton,
  EditUsernameForm,
  UsernameInput,
  EditButtonsContainer,
  ActionButton,
  EditIcon,
  ErrorText,
  FileInput,
  UploadButtonsContainer,
  DeleteButton,
  DeleteConfirmContainer,
  BottomButtonsContainer,
} from "./settingsUserStyled.js";
import {
  getUserById,
  updateUser,
  updateUserProfile,
} from "../../services/userServices.js";
import { SERVER_BASE_URL } from "../../services/apiServices.js";

const FRONTEND_DEFAULT_IMAGE_PATH = "/uploads/without_image.webp";

const SettingsUserComponent = () => {
  //General states
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Edition states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editableUsername, setEditableUsername] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [usernameUpdateError, setUsernameUpdateError] = useState(null);

  // Image states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [deleteImageError, setDeleteImageError] = useState(null);
  const fileInputRef = useRef(null);

  // Confirm state
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // --- Handlers ---

  const handleLogout = useCallback(() => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }, [navigate]);

  // Initial info state
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      // Reset all states
      setIsEditingUsername(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setImageUploadError(null);
      setUsernameUpdateError(null);
      setIsDeletingImage(false);
      setDeleteImageError(null);
      setIsConfirmingDelete(false);
      let userId = null;

      try {
        const storedUserString = localStorage.getItem("user");
        if (!storedUserString)
          throw new Error("No user info found. Please log in.");
        const storedUser = JSON.parse(storedUserString);
        userId = storedUser?.user_id;
        if (!userId) throw new Error("User ID not found. Please log in again.");

        const freshUserData = await getUserById(userId);
        setUserData(freshUserData);
        setEditableUsername(freshUserData.username);
      } catch (err) {
        console.error("Error fetching user data:", err);
        const errorMessage = err.message || "Could not load user data.";
        setError(errorMessage);
        if (
          errorMessage.includes("401") ||
          errorMessage.includes("403") ||
          errorMessage.includes("log in") ||
          errorMessage.includes("ID not found")
        ) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [handleLogout]);

  const handleEditUsernameClick = () => {
    if (isBusy) return;
    setEditableUsername(userData?.username || "");
    setIsEditingUsername(true);
    setUsernameUpdateError(null);
    setIsConfirmingDelete(false);
  };

  const handleCancelUsernameClick = () => {
    setIsEditingUsername(false);
    setUsernameUpdateError(null);
  };

  const handleUsernameChange = (event) => {
    setEditableUsername(event.target.value);
  };

  const handleSaveUsernameClick = async () => {
    if (isBusy || editableUsername.trim() === "") return;
    const newUsername = editableUsername.trim();
    if (newUsername === userData.username) {
      console.log("Username hasn't changed, cancelling save visually.");
      setIsEditingUsername(false);
      setUsernameUpdateError(null);
      return;
    }
    setIsUpdatingUsername(true);
    setUsernameUpdateError(null);
    try {
      const updatedUserResponse = await updateUser(userData.user_id, {
        username: newUsername,
      });
      setUserData(updatedUserResponse);
      localStorage.setItem("user", JSON.stringify(updatedUserResponse));
      setIsEditingUsername(false);
    } catch (err) {
      console.error("Error updating username:", err);
      setUsernameUpdateError(err.message || "Could not update username.");
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleImageClick = () => {
    if (isBusy) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    if (isBusy) return;
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageUploadError("Please select an image file.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setImageUploadError("Image is too large (max 5MB).");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setSelectedFile(file);
      setImageUploadError(null);
      setDeleteImageError(null);
      setIsConfirmingDelete(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveUpload = async () => {
    if (!selectedFile || !userData || !userData.user_id || isBusy) return;
    setIsUploadingImage(true);
    setImageUploadError(null);
    setDeleteImageError(null);
    const formData = new FormData();
    formData.append("profileImage", selectedFile);
    try {
      const updatedUserResponse = await updateUserProfile(
        userData.user_id,
        formData
      );
      setUserData(updatedUserResponse);
      localStorage.setItem("user", JSON.stringify(updatedUserResponse));
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      setImageUploadError(err.message || "Could not upload image.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImageClick = () => {
    if (!userData || !userData.user_id || isBusy) return;
    setIsConfirmingDelete(true);
    setDeleteImageError(null);
    setImageUploadError(null);
    setIsEditingUsername(false);
    setUsernameUpdateError(null);
  };

  const confirmDeleteImage = async () => {
    if (
      !userData ||
      !userData.user_id ||
      isUploadingImage ||
      isUpdatingUsername ||
      isDeletingImage
    )
      return;
    setIsDeletingImage(true);
    setDeleteImageError(null);
    setImageUploadError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      const updatedUserResponse = await updateUser(userData.user_id, {
        profile_image_url: null,
      });
      setUserData(updatedUserResponse);
      localStorage.setItem("user", JSON.stringify(updatedUserResponse));
    } catch (err) {
      console.error("Error deleting profile image:", err);
      setDeleteImageError(err.message || "Could not delete photo.");
    } finally {
      setIsDeletingImage(false);
      setIsConfirmingDelete(false);
    }
  };

  const cancelDeleteImage = () => {
    setIsConfirmingDelete(false);
    setDeleteImageError(null);
  };

  // --- End Handlers ---

  // Action in progress
  const isBusy =
    isUpdatingUsername ||
    isUploadingImage ||
    isDeletingImage ||
    isConfirmingDelete;

  // Render Loading
  if (loading)
    return (
      <SettingsUserContainer>
        <p>Loading...</p>
      </SettingsUserContainer>
    );
  if (error && !userData) {
    return (
      <SettingsUserContainer>
        <p>{error}</p>
      </SettingsUserContainer>
    );
  }
  if (!userData) {
    return (
      <SettingsUserContainer>
        <p>User data not found.</p>
      </SettingsUserContainer>
    );
  }

  // Verify url and default image
  const actualImageUrl = userData.profile_image_url;
  const displayImageUrl =
    previewUrl ||
    (actualImageUrl
      ? `${SERVER_BASE_URL}${
          actualImageUrl.startsWith("/") ? "" : "/"
        }${actualImageUrl}`
      : null);
  const isDefaultImage =
    !actualImageUrl || actualImageUrl === FRONTEND_DEFAULT_IMAGE_PATH;

  return (
    <SettingsUserContainer>
      {/*Hidden input file*/}
      <FileInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        disabled={isBusy}
      />

      {/* Image Wrapper*/}
      <div
        onClick={
          !selectedFile && !isConfirmingDelete ? handleImageClick : undefined
        }
        title={
          !selectedFile && !isConfirmingDelete ? "Click to change photo" : ""
        }
        style={{ cursor: selectedFile || isBusy ? "default" : "pointer" }}
      >
        {displayImageUrl ? (
          // Alt name shows user
          <ProfileImage
            src={displayImageUrl}
            alt={`${userData?.username}'s profile`}
          />
        ) : (
          <ImagePlaceholder>
            <span>No photo</span>
          </ImagePlaceholder>
        )}
      </div>

      {/* Buttons container */}
      <UploadButtonsContainer>
        {selectedFile && !isConfirmingDelete && (
          <>
            <ActionButton onClick={handleSaveUpload} disabled={isBusy}>
              {isUploadingImage ? "Uploading..." : "Save photo"}
            </ActionButton>
            <ActionButton
              className="cancel"
              onClick={handleCancelUpload}
              disabled={isBusy}
            >
              Cancel
            </ActionButton>
          </>
        )}
        {!selectedFile && !isDefaultImage && !isConfirmingDelete && (
          <DeleteButton onClick={handleDeleteImageClick} disabled={isBusy}>
            Delete Photo
          </DeleteButton>
        )}
      </UploadButtonsContainer>

      {/* Delete warning*/}
      {isConfirmingDelete && (
        <DeleteConfirmContainer>
          <p>Are you sure you want to delete your photo?</p>
          <div>
            <ActionButton
              onClick={confirmDeleteImage}
              disabled={isDeletingImage}
            >
              {isDeletingImage ? "Deleting..." : "Yes, delete"}
            </ActionButton>
            <ActionButton
              className="cancel"
              onClick={cancelDeleteImage}
              disabled={isDeletingImage}
            >
              No
            </ActionButton>
          </div>
        </DeleteConfirmContainer>
      )}

      {/* Image errors*/}
      {!isConfirmingDelete && (
        <ErrorText>
          {imageUploadError || deleteImageError || "\u00A0"}
        </ErrorText>
      )}

      {/* Username edit*/}
      {!isEditingUsername ? (
        <UsernameBox>
          <h3>{userData.username}</h3>
          <EditIcon
            onClick={!isBusy ? handleEditUsernameClick : undefined}
            title="Edit name"
            style={{
              cursor: isBusy ? "not-allowed" : "pointer",
              opacity: isBusy ? 0.5 : 1,
            }}
          >
            ✏️
          </EditIcon>
        </UsernameBox>
      ) : (
        <EditUsernameForm>
          <UsernameInput
            value={editableUsername}
            onChange={handleUsernameChange}
            disabled={isBusy}
          />
          <ErrorText>{usernameUpdateError || "\u00A0"}</ErrorText>
          <EditButtonsContainer>
            <ActionButton
              onClick={handleSaveUsernameClick}
              disabled={isBusy || editableUsername.trim() === ""}
            >
              {isUpdatingUsername ? "Saving..." : "Save"}
            </ActionButton>
            <ActionButton
              className="cancel"
              onClick={handleCancelUsernameClick}
              disabled={isBusy}
            >
              Cancel
            </ActionButton>
          </EditButtonsContainer>
        </EditUsernameForm>
      )}

      {/* --- BACK Y LOG OUT BUTTONS CONTAINER --- */}
      <BottomButtonsContainer>
        {/* Back button */}
        <LogoutButton onClick={() => navigate("/profilePage")} disabled={isBusy}>
          Back
        </LogoutButton>
        {/* Log out button */}
        <LogoutButton onClick={handleLogout} disabled={isBusy}>
          Log out
        </LogoutButton>
      </BottomButtonsContainer>
    </SettingsUserContainer>
  );
};

export default SettingsUserComponent;
