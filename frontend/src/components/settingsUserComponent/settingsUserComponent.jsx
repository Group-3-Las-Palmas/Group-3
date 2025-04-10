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

const FRONTEND_DEFAULT_IMAGE_PATH = "/uploads/without_image.webp"; // Asumiendo que esta es tu ruta por defecto

const SettingsUserComponent = () => {
  // Estados generales
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Estados para edición username
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editableUsername, setEditableUsername] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [usernameUpdateError, setUsernameUpdateError] = useState(null);

  // Estados para subida/manejo de imagen
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [deleteImageError, setDeleteImageError] = useState(null);
  const fileInputRef = useRef(null);

  // Estado para confirmación inline
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // --- Función Logout CORREGIDA ---
  const handleLogout = useCallback(() => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentActivity"); // <-- LÍNEA AÑADIDA
    navigate("/"); // Navegar al login después de limpiar todo
  }, [navigate]);
  // --- Fin Función Logout ---

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
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
          // Si hay error de autenticación o datos, forzar logout
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [handleLogout]); // Incluir handleLogout como dependencia

  // Determinar si alguna acción está en progreso
  const isBusy =
    isUpdatingUsername ||
    isUploadingImage ||
    isDeletingImage ||
    isConfirmingDelete;


  // --- Resto de Handlers (handleEditUsernameClick, handleSaveUsernameClick, etc.) ---
  // (No necesitan cambios para esta tarea)
  const handleEditUsernameClick = () => {
    if (isBusy) return;
    setEditableUsername(userData?.username || "");
    setIsEditingUsername(true);
    setUsernameUpdateError(null);
    setIsConfirmingDelete(false);
    // Resetear estado de imagen si se estaba previsualizando
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUploadError(null);
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
      localStorage.setItem("user", JSON.stringify(updatedUserResponse)); // Actualizar user en localStorage
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
      setIsEditingUsername(false); // Salir de edición de nombre si se selecciona archivo
      setUsernameUpdateError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = ""; // Resetear input file
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
    formData.append("profileImage", selectedFile); // Asegúrate que el nombre del campo coincida con el middleware ('profileImage')
    try {
      const updatedUserResponse = await updateUserProfile(
        userData.user_id,
        formData
      );
      setUserData(updatedUserResponse);
      localStorage.setItem("user", JSON.stringify(updatedUserResponse)); // Actualizar user en localStorage
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
    setSelectedFile(null); // Quitar previsualización si la había
    setPreviewUrl(null);
  };

  const confirmDeleteImage = async () => {
    if (!userData || !userData.user_id || isBusy) return;
    setIsDeletingImage(true);
    setDeleteImageError(null);
    setImageUploadError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      // Llamar a updateUser con profile_image_url: null
      const updatedUserResponse = await updateUser(userData.user_id, {
        profile_image_url: null,
      });
      setUserData(updatedUserResponse);
      localStorage.setItem("user", JSON.stringify(updatedUserResponse)); // Actualizar user en localStorage
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

  // --- Fin Handlers ---


  // Renderizado de Loading / Error inicial / No data
  if (loading) return <SettingsUserContainer><p>Loading...</p></SettingsUserContainer>;
  if (error && !userData) return <SettingsUserContainer><p style={{color: 'red'}}>{error}</p></SettingsUserContainer>;
  if (!userData) return <SettingsUserContainer><p>User data not found.</p></SettingsUserContainer>;

  // Determinar URL a mostrar y si es la imagen por defecto
  const actualImageUrl = userData.profile_image_url;
  const displayImageUrl = previewUrl || (actualImageUrl ? `${SERVER_BASE_URL}${actualImageUrl.startsWith("/") ? "" : "/"}${actualImageUrl}` : null);
  const isDefaultImage = !actualImageUrl || actualImageUrl === FRONTEND_DEFAULT_IMAGE_PATH;


  // Renderizado principal del componente
  return (
    <SettingsUserContainer>
      {/* Input File oculto */}
      <FileInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        disabled={isBusy}
      />

      {/* Wrapper de Imagen */}
      <div
        onClick={!selectedFile && !isConfirmingDelete && !isEditingUsername ? handleImageClick : undefined}
        title={!selectedFile && !isConfirmingDelete && !isEditingUsername ? "Click to change photo" : ""}
        style={{ cursor: selectedFile || isBusy || isEditingUsername ? "default" : "pointer", marginBottom: '0.5rem' }} // Añadido marginBottom aquí
      >
        {displayImageUrl ? (
          <ProfileImage
            src={displayImageUrl}
            alt={`${userData?.username}'s profile`}
            // Añadir onError para el caso de que falle la carga de la imagen real
             onError={(e) => {
               console.warn(`Failed to load image: ${displayImageUrl}. Falling back to default.`);
               e.target.onerror = null; // Evita bucles
               e.target.src = `${SERVER_BASE_URL}${FRONTEND_DEFAULT_IMAGE_PATH}`; // Usa la ruta por defecto completa
             }}
          />
        ) : (
          <ImagePlaceholder>
            <span>No photo</span>
          </ImagePlaceholder>
        )}
      </div>

      {/* Contenedor de Botones para Imagen */}
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
        {!selectedFile && !isDefaultImage && !isConfirmingDelete && !isEditingUsername && (
           <DeleteButton onClick={handleDeleteImageClick} disabled={isBusy}>
            Delete Photo
          </DeleteButton>
        )}
      </UploadButtonsContainer>

      {/* Bloque de Confirmación de Borrado */}
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

      {/* Muestra errores de Imagen (solo si no se está confirmando borrado) */}
       {!isConfirmingDelete && (
         <ErrorText>
            {imageUploadError || deleteImageError || "\u00A0"} {/* Muestra error o espacio en blanco */}
         </ErrorText>
       )}


      {/* Edición de Username */}
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
          {/* Muestra error de username */}
          <ErrorText>{usernameUpdateError || "\u00A0"}</ErrorText>
          <EditButtonsContainer>
            <ActionButton
              onClick={handleSaveUsernameClick}
              disabled={isBusy || editableUsername.trim() === "" || editableUsername.trim() === userData.username} // Deshabilitar si no hay cambios
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

      {/* Espacio antes de los botones inferiores si no se está editando nombre ni confirmando borrado */}
      {!isEditingUsername && !isConfirmingDelete && <div style={{height: '1.5rem'}}></div>}

      {/* Contenedor con botones Back y Log out */}
      <BottomButtonsContainer>
        <LogoutButton onClick={() => navigate("/profilePage")} disabled={isBusy}>
          Back
        </LogoutButton>
        <LogoutButton onClick={handleLogout} disabled={isBusy}>
          Log out
        </LogoutButton>
      </BottomButtonsContainer>
    </SettingsUserContainer>
  );
};

export default SettingsUserComponent;