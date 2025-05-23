import "./dashboard.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const AdminDashboard = () => {
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [userTypes, setUserTypes] = useState({
    A: false,
    B: false,
    C: false,
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
  };

  //validar que el número de teléfono tenga 10 dígitos
  const handlePhoneBlur = () => {
    if (phone.length !== 10) {
      setMessage({
        text: "Número de teléfono inválido. Debe tener 10 dígitos.",
        type: "error",
      });
    } else {
      setMessage({ text: "", type: "" });
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setMessage({ text: "", type: "" });

    if (newRole !== "T") {
      setUserTypes({ A: false, B: false, C: false });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUserTypes((prev) => ({ ...prev, [name]: checked }));
    setMessage({ text: "", type: "" });
  };

  const validateForm = () => {
    if (!phone.match(/^\d{10}$/)) {
      setMessage({
        text: "Número de teléfono inválido. Debe tener 10 dígitos.",
        type: "error",
      });
      return false;
    }

    if (!role) {
      setMessage({
        text: "Por favor seleccione un rol para el usuario.",
        type: "error",
      });
      return false;
    }

    if (role === "T") {
      const hasSpecialty = Object.values(userTypes).some((v) => v);
      if (!hasSpecialty) {
        setMessage({
          text: "Los terapeutas deben tener al menos una especialidad seleccionada.",
          type: "error",
        });
        return false;
      }
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    let typeUser = role;

    if (role === "T") {
      typeUser = Object.entries(userTypes)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .sort()
        .join("");
    }

    const num_tel = phone.toString().trim();
    console.log(" numero_tel:", num_tel);

    console.log(" tipo_usuario:", typeUser);

    try {
      const response = await axios.post(
        "http://localhost:3001/expedientes/usuarios/new",
        {
          numero_tel: num_tel,
          tipo_usuario: typeUser,
        }
      );

      setMessage({
        text: "Usuario registrado correctamente.",
        type: "success",
      });

      // Reset form
      setPhone("");
      setRole("");
      setUserTypes({ A: false, B: false, C: false });
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message ||
          "Error al registrar el usuario. Por favor intente nuevamente.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AltaUsuariosContainer>
      <div className="form-container">
        <div className="form-box">
          <h2 className="form-title">Alta de Usuarios</h2>

          <form onSubmit={handleRegister} className="form-content">
            {/* Campo de Teléfono */}
            <div className="form-group">
              <label htmlFor="telefonoTutor">
                Número telefónico del nuevo usuario:
              </label>
              <div className="telefono-container">
                <select id="lada" name="lada" required className="lada-select">
                  <option value="+52">+52</option>
                  <option value="+1">+1</option>
                </select>
                <input
                  value={phone}
                  onChange={handlePhoneChange}
                  type="number"
                  placeholder="Número telefónico"
                  name="newuser"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  title="Ingrese 10 dígitos numéricos"
                  className="phone-input"
                />
              </div>
            </div>

            {/* Selección de Rol */}
            <div className="form-group">
              <label className="form-label">
                Tipo de Usuario <span className="required">*</span>
              </label>
              <div className="radio-group">
                <label
                  className={`radio-option ${role === "R" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="R"
                    checked={role === "R"}
                    onChange={handleRoleChange}
                    className="radio-input"
                  />
                  <div className="radio-content">
                    <span className="radio-title">Recepcionista</span>
                    <span className="radio-description">
                      Acceso al sistema de citas
                    </span>
                  </div>
                </label>

                <label
                  className={`radio-option ${role === "T" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="T"
                    checked={role === "T"}
                    onChange={handleRoleChange}
                    className="radio-input"
                  />
                  <div className="radio-content">
                    <span className="radio-title">Terapeuta</span>
                    <span className="radio-description">
                      Acceso según especialidades
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Especialidades para Terapeutas */}
            {role === "T" && (
              <div className="form-group specialties">
                <label className="form-label">
                  Especialidades <span className="required">*</span>
                </label>
                <div className="checkbox-group">
                  {Object.entries(userTypes).map(([key, value]) => (
                    <label key={key} className="checkbox-option">
                      <input
                        type="checkbox"
                        name={key}
                        checked={value}
                        onChange={handleCheckboxChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">Terapia {key}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Botón de Registro */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button">
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Procesando...
                  </>
                ) : (
                  "Registrar Usuario"
                )}
              </button>
            </div>

            {/* Mensajes de estado */}
            {message.text && (
              <div className={`message ${message.type}`}>{message.text}</div>
            )}
          </form>
        </div>
      </div>
    </AltaUsuariosContainer>
  );
};

export default AdminDashboard;

const AltaUsuariosContainer = styled.body`
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;
