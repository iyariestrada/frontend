import React from "react";
import Paciente from "./Paciente";

const ListaExpedientes = ({ pacientes, usuario, token, tipo_usuario }) => {
  console.log("LISTA EXP Aqui esta el usuario", usuario);
  return (
    <main className="main">
      <h2>Pacientes Asignados</h2>
      <div className="patient-list">
        {pacientes.length > 0 ? (
          pacientes.map((paciente, index) => (
            <Paciente
              key={index}
              nombre={paciente.nombre}
              expediente={paciente.exp_num}
              tutor={paciente.numero_tel}
              estatus={paciente.estatus}
              usuario={usuario}
              token={token}
              tipo_usuario={tipo_usuario}
            />
          ))
        ) : (
          <p>No hay pacientes asignados</p>
        )}
      </div>
    </main>
  );
};

export default ListaExpedientes;
