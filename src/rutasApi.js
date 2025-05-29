
const host = "http://localhost:3001/";

//TEST 
const QCHAT_test =
  "https://docs.google.com/forms/d/e/1FAIpQLSd9SgHqVPBoTbqz5ZQ6f9UDdIAJhSfoshkgFdRUjsYv0lYsnA/viewform";
const SCQ_test =
  "https://docs.google.com/forms/d/e/1FAIpQLSfvTRcdS-ncsvY2zIhvE3x0qmlhqBQ3BeoBHoPiaWg-qHgsAw/viewform";

//Rutas citas
const citas = host + "citas/";
const createPrimeraCita = citas + "primera-cita";
const getEtapaCita = citas + "etapa/";
const getCheckCitaPrevia = citas + "check-cita-previa/";

//Rutas Observaciones 
const observaciones = host + "observaciones/";

const getObservacionesCita = observaciones + "cita/"
const createObservacionCita = observaciones + "cita";

//Rutas PacienteEstado
const pacienteEstado = host + "estado/";

const createPacienteEstado = pacienteEstado;
const updatePacienteEstado = pacienteEstado;
const deletePacienteEstado = pacienteEstado;
const getPacienteEstadosByTerapeuta = pacienteEstado + "terapeuta/";
const getAllPacienteEstados = pacienteEstado;

//Rutas Expedientes -- Vista previa
const expedientes = host + "expedientes/";
const getTerapeutaWithPatients = expedientes + "vistaprevia/";

//Rutas Expedientes -- Horario
const getCitasTerapeutaDia = expedientes + "horario/";
const getCitasTerapeutaDiaByDia = expedientes + "horario/";
const getCitasTerapeutaSemana = expedientes + "horario/semana/";
const getCitasByPaciente = expedientes + "citas/paciente/";

//Rutas Expedientes -- Citas
const getCitasSinFechaNiHora = expedientes + "citas/sinfecha/sinhora"; 


export {
  QCHAT_test,
  SCQ_test,
  citas,
  createPrimeraCita,
  getEtapaCita,
  getCheckCitaPrevia,
  getObservacionesCita,
  createObservacionCita,
  createPacienteEstado,
  updatePacienteEstado,
  deletePacienteEstado,
  getPacienteEstadosByTerapeuta,
  getAllPacienteEstados,
  getTerapeutaWithPatients,
  getCitasTerapeutaDia,
  getCitasTerapeutaDiaByDia,
  getCitasTerapeutaSemana,
  getCitasByPaciente,
  getCitasSinFechaNiHora,
};
