import React, { useState, useEffect } from "react";
import "./VistaPrevia.css";
import Horario from "./Horario";
import Filtrado from "./Filtrado";
import ListaExpedientes from "./ListaExpedientes";
import Header from "./Header";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const citas = [
  { hora: "09:00 - 10:00", paciente: "Paciente A" },
  { hora: "11:00 - 12:00", paciente: "Paciente B" },
  { hora: "14:00 - 15:00", paciente: "Paciente C" },
];

function VistaPrevia() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [nombreTerapeuta, setNombreTerapeuta] = useState("");
  const [token] = useState(
    location.state?.token || localStorage.getItem("token")
  );
  const [user] = useState(
    location.state?.user || JSON.parse(localStorage.getItem("user"))
  );

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    if (!token || !user) {
      navigate("/login-sign-in-up");
      return;
    }

    // Configurar axios para enviar el token en las peticiones
    //axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Cierre de sesión por inactividad
    const handleInactivity = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login-sign-in-up");
    };

    // Temporizador inactividad 1 min = 60000 ms
    const inactivityTimeout = 3600000;
    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(handleInactivity, inactivityTimeout);
    };

    // Eventos para resetear el temporizador
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    // Limpiar al desmontar el componente
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [token, user, navigate]);

  useEffect(() => {
    const fetchPacientes = async () => {
      if (!user) return; // Validar usuario definido

      console.log("user", user);
      console.log("user.tipo", user.tipo || localStorage.getItem("tipo"));
      console.log("user.num_tel", user.numero_tel);

      if (user.tipo !== "R") {
        try {
          const response = await axios.get(
            `http://localhost:3001/expedientes/vistaprevia/${user.numero_tel}`
          );
          if (Array.isArray(response.data.pacientes)) {
            setPacientes(response.data.pacientes);
            setPacientesFiltrados(response.data.pacientes);
            setNombreTerapeuta(response.data.usuario.nombre);
          } else {
            console.error(
              "La respuesta no es un array:",
              response.data.pacientes
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          if (error.response?.status === 401) {
            // Token inválido o expiro
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login-sign-in-up");
          }
        }
      } else {
        try {
          const response = await axios.get(
            `http://localhost:3001/expedientes/usuarios/pacientes`
          );
          if (Array.isArray(response.data)) {
            setPacientes(response.data);
          } else {
            console.error(
              "La respuesta no es un array:",
              response.data.pacientes
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchPacientes();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login-sign-in-up");
  };

  return (
    <div className="app-container">
      <Header
        onLogout={handleLogout}
        num_tel={user?.numero_tel}
        token={token}
        user={user}
        tipo_usuario={user?.tipo}
        nombreTerapeuta={nombreTerapeuta || user?.nombre}
      />
      <div className="main-content">
        {user?.tipo !== "R" && (
          <div className="left-section">
            <Horario citas={citas} />
          </div>
        )}
        <div className="center-section">
          <ListaExpedientes
            pacientes={pacientesFiltrados}
            usuario={user}
            token={token}
            tipo_usuario={user?.tipo}
          />
        </div>
        <div className="right-section">
          <Filtrado
            onFilteredPatients={setPacientesFiltrados}
            pacientes={pacientes}
            numero_tel={user?.numero_tel}
            token={token}
            tipo_usuario={user?.tipo}
          />
        </div>
      </div>
    </div>
  );
}

export default VistaPrevia;
