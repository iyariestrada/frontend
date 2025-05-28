import React, { useState } from 'react';
import "./LineaDelTiempo.css";
import Header from '../Header.js';
import {citas, citasGetEtapa, citasPrimeraCita, getCheckCitaPrevia} from "../rutasApi.js"
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from 'axios';

const LineaDelTiempo = () => {
  const [mode, setMode] = useState('left');
  
  const location = useLocation();
  const navigate = useNavigate();

  const num_tel = JSON.parse(localStorage.getItem("user")).num_tel;
  const nombre = JSON.parse(localStorage.getItem("user")).nombre;

  const { exp_num } = location.state || {};

  const SiguienteCitaHandler = async () => {
    try {
      const uri = citasGetEtapa + exp_num;
      const response = await axios.get(uri);
      const etapa = response.data;
      await axios.post(citasPrimeraCita, {
        exp_num: exp_num,
        numero_tel_terapeuta: num_tel,
        tipo: etapa
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
    navigate("/seleccionarterapeuta", { state: { exp_num: exp_num, tipo: etapa } });
  } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert("Error al asignar la cita: " + error.response.data.error);
      } else {
        alert("Error al asignar la cita: " + error.message);
      }
  }
  };

  const onChange = e => {
    setMode(e.target.value);
  };
  return (
    <div className="main-container">
      <Header nombreTerapeuta={nombre} />
      <div className="timeline-container">
        <button onClick={SiguienteCitaHandler} >Agendar siguiente cita</button>
        <button onClick={SiguienteEtapaHandler}>Elegir siguiente terapeuta</button>
      </div>
      
  </div>
  );
};
export default LineaDelTiempo;