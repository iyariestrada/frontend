import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// components
import TableDropdown from "../../components/Dropdowns/TableDropdown.js";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function CardTable({
  color,
  users,
  onUserUpdate,
  onUserDelete,
}) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editedNumber, setEditedNumber] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getUserType = (tipo) => {
    switch (tipo) {
      case "ADM":
        return "Administrador";
      case "R":
        return "Recepcionista";
      case "A":
        return "Terapeuta Tipo A";
      case "B":
        return "Terapeuta Tipo B";
      case "C":
        return "Terapeuta Tipo C";
      case "AB":
        return "Terapeuta Tipo AB";
      case "AC":
        return "Terapeuta Tipo AC";
      case "BC":
        return "Terapeuta Tipo BC";
      case "ABC":
        return "Terapeuta Tipo ABC";
      default:
        return "No Aplica";
    }
  };

  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setEditedNumber(user.number);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCurrentUser(null);
    setEditedNumber("");
  };

  const handleOpenDeleteModal = (user) => {
    setCurrentUser(user);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentUser(null);
  };

  const handleUpdateNumber = async () => {
    if (!currentUser || !editedNumber) return;

    console.log("Updating user number:", currentUser.number, editedNumber);

    setIsUpdating(true);
    try {
      const response = await axios.put(
        `http://localhost:3001/expedientes/usuarios/updatephone/${currentUser.number}`,
        {
          numero_actual: currentUser.number,
          nuevo_numero: editedNumber,
        }
      );
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating user number:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;

    setIsDeleting(true);
    try {
      await onUserDelete(currentUser.id);
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }>
                Números autorizados
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }>
                  Nombre
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }>
                  Número
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }>
                  Tipo de usuario
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                    <span
                      className={
                        "ml-3 font-bold " +
                        (color === "light" ? "text-blueGray-600" : "text-white")
                      }>
                      {user.name}
                    </span>
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {user.number}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <i
                      style={{
                        color:
                          user.type === "ADM"
                            ? "rgb(226,35,26)"
                            : user.type === "R"
                            ? "rgb(255,209,0)"
                            : "rgb(55,93,157)",
                      }}
                      className="fas fa-circle mr-2"></i>
                    {getUserType(user.type)}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      style={{
                        borderColor: "#3b82f6",
                        color: "#3b82f6",
                        marginRight: "8px",
                      }}
                      sx={{
                        "&:hover": {
                          borderColor: "#1d4ed8",
                          backgroundColor: "#dbeafe",
                          color: "#1d4ed8",
                        },
                      }}
                      onClick={() => handleOpenEditModal(user)}>
                      Actualizar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      style={{
                        borderColor: "#ef4444",
                        color: "#ef4444",
                      }}
                      sx={{
                        "&:hover": {
                          borderColor: "#b91c1c",
                          backgroundColor: "#fee2e2",
                          color: "#b91c1c",
                        },
                      }}
                      onClick={() => handleOpenDeleteModal(user)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para editar número */}
      <Modal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-number-modal"
        aria-describedby="modal-to-edit-user-number">
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Editar número de {currentUser?.name}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Número"
            value={editedNumber}
            onChange={(e) => setEditedNumber(e.target.value)}
          />
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleCloseEditModal}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleUpdateNumber}
              disabled={isUpdating}>
              {isUpdating ? "Guardando..." : "Guardar"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-user-modal"
        aria-describedby="modal-to-confirm-user-deletion">
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmar eliminación
          </Typography>
          <Typography sx={{ mt: 2 }}>
            ¿Estás seguro que deseas eliminar a {currentUser?.name}?
          </Typography>
          <Typography sx={{ mt: 1, mb: 2, color: "error.main" }}>
            Esta acción es permanente. Las citas sin atender deberán ser
            reagendadas.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleCloseDeleteModal}>Cancelar</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteUser}
              disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Confirmar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
  users: [],
  onUserUpdate: () => {},
  onUserDelete: () => {},
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
  onUserUpdate: PropTypes.func,
  onUserDelete: PropTypes.func,
};
