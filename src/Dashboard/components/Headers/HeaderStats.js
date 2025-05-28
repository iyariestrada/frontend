import React from "react";
import axios from "axios";

import CardStats from "../Cards/CardStats.js";

export default function HeaderStats() {
  const [numUsuarios, setNumUsuarios] = React.useState(0);
  const [numPacientes, setNumPacientes] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/expedientes/usuarios/all"
        );
        setNumUsuarios(response.data.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/expedientes/usuarios/pacientes"
        );
        //contar el número de pacientes de la respuesta
        setNumPacientes(
          Array.isArray(response.data) ? response.data.length : 0
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="USUARIOS REGISTRADOS"
                  statTitle={numUsuarios}
                  /*statArrow="up"
                  statPercent="3.48"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last month"*/
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="PACIENTES REGISTRADOS"
                  statTitle={numPacientes}
                  /*statArrow="down"
                  statPercent="3.48"
                  statPercentColor="text-red-500"
                  statDescripiron="En esta semana"*/
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
