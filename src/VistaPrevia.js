import React, { useState, useEffect } from "react";
import "./VistaPrevia.css";
import Horario from "./Horario";
import Filtrado from "./Filtrado";
import ListaExpedientes from "./ListaExpedientes";
import Header from "./Header";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getTerapeutaWithPatients, getCitasTerapeutaDia, getCitas } from "./rutasApi.js";

function VistaPrevia() {
  const location = useLocation();
  const navigate = useNavigate();

  // Inicialización segura desde localStorage
  const [token, setToken] = useState(() => location.state?.token || localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [nombreTerapeuta, setNombreTerapeuta] = useState("");
  const [citas, setCitas] = useState({ dia: "", horario: [] });

  // Escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user") {
        const updatedUser = JSON.parse(event.newValue);
        setUser(updatedUser);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Verificar autenticación e inactividad
  useEffect(() => {
    if (!token || !user) {
      navigate("/login-sign-in-up");
      return;
    }

    const handleInactivity = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login-sign-in-up");
    };

    const inactivityTimeout = 3600000;
    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(handleInactivity, inactivityTimeout);
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [token, user, navigate]);

  // Cargar pacientes y citas solo cuando user esté listo
  useEffect(() => {
    const fetchPacientes = async () => {
      if (!user || !user.num_tel) return;

      if (user.tipo !== "R") {
        try {
          const response = await axios.get(getTerapeutaWithPatients + user.num_tel);
          if (Array.isArray(response.data.pacientes)) {
            setPacientes(response.data.pacientes);
            setPacientesFiltrados(response.data.pacientes);
            setNombreTerapeuta(response.data.usuario.nombre);
          } else {
            console.error("La respuesta no es un array:", response.data.pacientes);
          }

          const citas_resp = await axios.get(getCitasTerapeutaDia + user.num_tel);

          const dia =
            new Date().toLocaleDateString("es-MX", { weekday: "long" }) +
            " " +
            new Date().getDate() +
            " de " +
            new Date().toLocaleDateString("es-MX", { month: "long" });

          let horario = [];
          if (Array.isArray(citas_resp.data)) {
            horario = [...citas_resp.data].sort((a, b) => {
              const [ah, am] = a.hora.split(":").map(Number);
              const [bh, bm] = b.hora.split(":").map(Number);
              return ah !== bh ? ah - bh : am - bm;
            });
          }

          setCitas({ dia, horario });
        } catch (error) {
          console.error("Error fetching data:", error);
          setCitas({
            dia:
              new Date().toLocaleDateString("es-MX", { weekday: "long" }) +
              " " +
              new Date().getDate() +
              " de " +
              new Date().toLocaleDateString("es-MX", { month: "long" }),
            horario: [],
          });

          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login-sign-in-up");
          }
        }
      } else {
        try {
          const response = await axios.get(getCitas);
          if (Array.isArray(response.data)) {
            setPacientes(response.data);
          } else {
            console.error("La respuesta no es un array:", response.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchPacientes();
  }, [user, navigate]);

  // Si el usuario aún no está cargado, no renderiza nada
  if (!user) return null;

  return (
    <div className="app-container">
      <Header
        num_tel={user?.num_tel}
        token={token}
        user={user}
        tipo_usuario={user?.tipo}
        nombreTerapeuta={user?.nombre}
      />
      <div className="main-content">
        {user?.tipo !== "R" && (
          <div className="left-section">
            <h1> Horario </h1>
            <Horario citas={citas} />
          </div>
        )}
        <div className="center-section">
          <h1> Pacientes Asignados </h1>
          <ListaExpedientes
            pacientes={pacientesFiltrados}
            usuario={user}
            token={token}
            tipo={user?.tipo}
          />
        </div>
        <div className="right-section">
          <Filtrado
            onFilteredPatients={setPacientesFiltrados}
            pacientes={pacientes}
            num_tel={user?.num_tel}
            token={token}
            tipo_usuario={user?.tipo}
          />
        </div>
      </div>
    </div>
  );
}

export default VistaPrevia;
