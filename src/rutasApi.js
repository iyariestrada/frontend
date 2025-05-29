const host = "http://localhost:3001/";

// Rutas citas
const citas = host + "citas";
const citasPrimeraCita = citas + "/primera-cita";
const citasSiguienteCita = citas + "/siguiente-cita";
const citasSiguienteEtapa = citas + "/siguiente-etapa";
const citasGetEtapa = citas + "/etapa/";
const getCheckCitaPrevia = citas + "/check-cita-previa/";

// Rutas expedientes/usuarios
const usuarios = host + "expedientes/usuarios";
// Settings Card
const getUsuario = (numeroTel) => `${usuarios}/${numeroTel}`;
const updateUserData = (numeroTel) => `${usuarios}/${numeroTel}`;
const updatePassword = (numeroTel) => `${usuarios}/updatePassword/${numeroTel}`;
// Card Table
const updateUserPhone = (numeroTel) => `${usuarios}/updatephone/${numeroTel}`;
const deleteUsuario = (numeroTel) => `${usuarios}/${numeroTel}`;
// Header stats
const getAllUsuarios = usuarios + "/all";
const getPacientes = usuarios + "/pacientes";
// AltaUsuarios
const createUsuario = usuarios + "/new";

export {
  citas,
  citasPrimeraCita,
  citasSiguienteCita,
  citasSiguienteEtapa,
  citasGetEtapa,
  getCheckCitaPrevia,
  getUsuario,
  updateUserData,
  updatePassword,
  updateUserPhone,
  deleteUsuario,
  getAllUsuarios,
  getPacientes,
  createUsuario,
};
