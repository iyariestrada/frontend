import React, { useState, useEffect } from "react";
import "./LineaDelTiempo.css";
import Header from "../Header.js";
import ObservacionesModal from "./ObservacionesModal.js";
import {
  citasGetEtapa,
  citasPrimeraCita,
  getCheckCitaPrevia,
} from "../rutasApi.js";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { Timeline } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";

import { Modal } from "antd";

const LineaDelTiempo = () => {
  const [timelineItems, setTimelineItems] = useState([]);
  const [nombrePaciente, setNombrePaciente] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const num_tel = JSON.parse(localStorage.getItem("user")).num_tel;
  const nombre = JSON.parse(localStorage.getItem("user")).nombre;
  const { exp_num } = location.state || {};

  const abrirModalObservaciones = (cita) => {
    setCitaSeleccionada(cita);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setCitaSeleccionada(null);
  };

  const obtenerDatosCitas = async () => {
    try {
      const pacienteResponse = await axios.get(
        `http://localhost:3001/expedientes/${exp_num}`
      );
      setNombrePaciente(pacienteResponse.data.nombre);
      const citasResponse = await axios.get(
        `http://localhost:3001/expedientes/citas/paciente/${exp_num}`
      );
      const citas = citasResponse.data;

      const citasOrdenadas = citas.sort((a, b) => {
        if (!a.fecha && !b.fecha) return 0;
        if (!a.fecha) return 1; // Citas sin fecha van al final
        if (!b.fecha) return -1; // Con fecha va primero

        // Ordenar cronologicamente las que tienen fecha
        const fechaA = new Date(`${a.fecha} ${a.hora || "00:00:00"}`);
        const fechaB = new Date(`${b.fecha} ${b.hora || "00:00:00"}`);
        return fechaA - fechaB;
      });

      const items = [];
      for (let i = 0; i < citasOrdenadas.length; i++) {
        const cita = citasOrdenadas[i];

        let nombreTerapeuta = "Por asignar";
        if (cita.numero_tel_terapeuta) {
          try {
            const terapeutaResponse = await axios.get(
              `http://localhost:3001/expedientes/usuarios/${cita.numero_tel_terapeuta}`
            );
            nombreTerapeuta = terapeutaResponse.data.nombre;
          } catch (error) {
            nombreTerapeuta = "Terapeuta no encontrado";
          }
        }

        // estado de la cita
        let estado, dot, color, label, descripcion;

        if (!cita.fecha || !cita.hora) {
          // Si no hay fecha o hora la cita esta pendiente
          estado = "pendiente";
          dot = (
            <CheckSquareOutlined
              style={{ fontSize: "16px", color: "#faad14" }}
            />
          );
          color = "orange";
          label = "Fecha por asignar";
          descripcion = `Cita Pendiente - Etapa ${
            cita.etapa || "A"
          }: Por agendar fecha y hora`;
        } else {
          const ahora = new Date();
          const fechaCita = new Date(`${cita.fecha} ${cita.hora}`);

          if (fechaCita < ahora) {
            // Cita completada
            estado = "completada";
            dot = (
              <CheckSquareOutlined
                style={{ fontSize: "16px", color: "#52c41a" }}
              />
            );
            color = "green";
            descripcion =
              i === 0
                ? `Primera Cita - Etapa ${
                    cita.etapa || "A"
                  }: Evaluación inicial del paciente`
                : `Sesión ${i + 1} - Etapa ${
                    cita.etapa || "A"
                  }: Sesión de terapia completada`;
          } else if (fechaCita.toDateString() === ahora.toDateString()) {
            // Cita actual (hoy)
            estado = "actual";
            dot = (
              <CheckSquareOutlined
                style={{ fontSize: "16px", color: "#1890ff" }}
              />
            );
            color = "blue";
            descripcion = `Cita Actual - Etapa ${
              cita.etapa || "A"
            }: Sesión en progreso`;
          } else {
            estado = "programada";
            dot = (
              <CheckSquareOutlined
                style={{ fontSize: "16px", color: "#d9d9d9" }}
              />
            );
            color = "gray";
            descripcion = `Cita Programada - Etapa ${
              cita.etapa || "A"
            }: Próxima sesión`;
          }

          const fechaPartes = cita.fecha.split("-");
          const fechaObj = new Date(
            fechaPartes[0],
            fechaPartes[1] - 1,
            fechaPartes[2]
          );
          const fechaFormateada = fechaObj.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          const horaFormateada = cita.hora.substring(0, 5);
          label = `${fechaFormateada} - ${horaFormateada}`;
        }

        const item = {
          label: label,
          children: (
            <div className="timeline-item-content">
              <span>
                {descripcion}. Terapeuta: {nombreTerapeuta}
              </span>
              <button
                className="btn-observaciones"
                onClick={() => abrirModalObservaciones(cita)}>
                Observaciones
              </button>
            </div>
          ),
          dot: dot,
          color: color,
        };

        items.push(item);
      }

      setTimelineItems(items);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      setTimelineItems([]);
    }
  };

  const SiguienteCitaHandler = async () => {
    try {
      const uri = citasGetEtapa + exp_num;
      const response = await axios.get(uri);
      const etapa = response.data;
      await axios.post(citasPrimeraCita, {
        exp_num: exp_num,
        numero_tel_terapeuta: num_tel,
        tipo: etapa,
      });
      navigate("/");
    } catch (error) {
      // Si el backend responde con un error personalizado
      if (error.response && error.response.data && error.response.data.error) {
        alert("Error al asignar la cita: " + error.response.data.error);
      } else {
        alert("Error al asignar la cita: " + error.message);
      }
    }
  };

  const SiguienteEtapaHandler = async () => {
    try {
      await axios.get(getCheckCitaPrevia + exp_num);
      const uri = citasGetEtapa + exp_num;
      const response = await axios.get(uri);
      const etapaAnterior = response.data;
      const etapa = String.fromCharCode(etapaAnterior.charCodeAt(0) + 1);
      navigate("/seleccionarterapeuta", {
        state: { exp_num: exp_num, tipo: etapa },
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert("Error al asignar la cita: " + error.response.data.error);
      } else {
        alert("Error al asignar la cita: " + error.message);
      }
    }
  };

  /*const handleProcesoInterrumpido = () => {
    Modal.confirm({
      title:
        "¿Estás seguro de que quieres interrumpir el proceso? Considera realizar esto solo si el paciente no puede continuar con el tratamiento.",
      okText: "Sí, interrumpir",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        navigate("/");
      },
    });
  };*/

  const handleProcesoInterrumpido = () => {
    Modal.confirm({
      title:
        "¿Estás seguro de que quieres interrumpir el proceso? Considera realizar esto solo si el paciente no puede continuar con el tratamiento.",
      okText: "Sí, interrumpir",
      okType: "danger",
      cancelText: "Cancelar",
      async onOk() {
        try {
          await axios.put(`http://localhost:3001/estado/${exp_num}`, {
            estado: "I",
          });
          Modal.success({
            title: "Tratamiento interrumpido",
            content: "El estado del paciente ha sido actualizado.",
            onOk: () => navigate("/"),
          });
        } catch (error) {
          Modal.error({
            title: "Error",
            content:
              error.response?.data?.message ||
              "No se pudo interrumpir el tratamiento.",
          });
        }
      },
    });
  };

  useEffect(() => {
    if (exp_num) {
      obtenerDatosCitas();
    }
  }, [exp_num]);

  return (
    <div className="main-container">
      <Header nombreTerapeuta={nombre} />
      <div className="timeline-container">
        <h2 className="titulo-linea-tiempo">
          Línea del Tiempo - Expediente {exp_num}
          {nombrePaciente && ` - ${nombrePaciente}`}
        </h2>

        {timelineItems.length > 0 ? (
          <Timeline
            mode="left"
            items={timelineItems}
            className="timeline-box"
          />
        ) : (
          <div className="timeline-box">
            <p>No se encontraron citas para este paciente.</p>
          </div>
        )}

        <div className="botones-container">
          <button onClick={SiguienteCitaHandler} className="btn-agendar">
            Agendar siguiente cita
          </button>
          <button onClick={SiguienteEtapaHandler} className="btn-siguiente">
            Elegir siguiente terapeuta
          </button>
        </div>

        <div className="botones-container">
          <button
            onClick={handleProcesoInterrumpido}
            className="btn-interrumpido">
            Marcar tratamiento como interrumpido
          </button>
        </div>

        <ObservacionesModal
          visible={modalVisible}
          onClose={cerrarModal}
          citaSeleccionada={citaSeleccionada}
          numeroTelTerapeuta={num_tel}
        />
      </div>
    </div>
  );
};
export default LineaDelTiempo;
