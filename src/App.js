import React from "react";
//import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import VistaPrevia from "./VistaPrevia.js";
import CompFormularioRegistro from "./FormularioRegistro.js";
import SeleccionarTerapeuta from "./SeleccionarTerapeuta.js";
import AgendarCita from "./AgendarCita.js";
import LoginView from "./Login/LoginView.js";
import AgregarUsuarios from "./Dashboard/DashComponent.js";
import Dashboard from "./Dashboard/Dashboard.js";

import Admin from "./Dashboard/layouts/Admin.js";
import Auth from "./Dashboard/layouts/Auth.js";
import Landing from "./Dashboard/views/Landing.js";
import Profile from "./Dashboard/views/Profile.js";
import Index from "./Dashboard/views/Index.js";

import Settings from "./Dashboard/views/admin/Settings.js";

import LineaDelTiempo from "./linea/LineaDelTiempo.js";
import HorarioSemanal from "./HorarioSemanal.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VistaPrevia />} />
        <Route path="/agregar-registro" element={<CompFormularioRegistro />} />
        <Route
          path="/seleccionarterapeuta"
          element={<SeleccionarTerapeuta />}
        />
        <Route path="/agendar-cita" element={<AgendarCita />} />
        <Route path="/login-sign-in-up" element={<LoginView />} />
        <Route path="/new-user" element={<AgregarUsuarios />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/index" element={<Index />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/linea-del-tiempo" element={<LineaDelTiempo/>} />
        <Route
          path="/ver-horario" 
          element={<HorarioSemanal/>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
