import React, { useContext, useState } from "react";
import { Navbar } from "../../components/NavBar";
import { miContexto } from "../../context/AppContext";
import { TablaMovimientosModal } from "./components/TablaMovimientosModal";

export const EstadisticasPage = () => {
  const { usuarioRuta, formatDate, infoClientes } = useContext(miContexto);
  const [mostrarMovimientos, setMostrarMovimientos] = useState(false);

  const compararFechas = (a, b) => {
    const fechaA = new Date(a.fecha.seconds * 1000 + a.fecha.nanoseconds / 1e6);
    const fechaB = new Date(b.fecha.seconds * 1000 + b.fecha.nanoseconds / 1e6);
    return fechaB - fechaA;
  };

  usuarioRuta?.historialSaldos.sort(compararFechas);
  const saldoMasNuevo =
    usuarioRuta?.historialSaldos.length > 0
      ? usuarioRuta.historialSaldos[0].saldo
      : null;
  const fechaDeSaldoMasNuevo =
    usuarioRuta?.historialSaldos.length > 0
      ? usuarioRuta?.historialSaldos[0].fecha
      : null;

  const ganancias =
    parseInt(usuarioRuta?.saldoInicial) - parseInt(saldoMasNuevo);

  return (
    <>
      {mostrarMovimientos ? (
        <TablaMovimientosModal
          formatDate={formatDate}
          usuarioRuta={usuarioRuta}
          setMostrarMovimientos={setMostrarMovimientos}
        />
      ) : null}

      <Navbar />
      <div className="w-full min-h-screen bg-gray-200 pt-16 px-4 md:px-8">
        <div>
          <p>
            Saldo Actual:{" "}
            <span className="font-bold">${usuarioRuta?.saldoInicial}</span>
          </p>
          <p>
            Ultimo saldo ingresado:{" "}
            <span className="font-bold">
              ${saldoMasNuevo ? saldoMasNuevo : ""}
            </span>
          </p>
          <p>
            Fecha:{" "}
            <span className="font-bold">
              {fechaDeSaldoMasNuevo ? formatDate(fechaDeSaldoMasNuevo) : null}
            </span>
          </p>
          <p>
            Ganancias:{" "}
            <span className="font-bold">${ganancias >= 0 ? ganancias : 0}</span>
          </p>
          <p>
            Total Clientes:{" "}
            <span className="font-bold">{infoClientes.length}</span>
          </p>
        </div>

        <button
          type="button"
          className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
          onClick={() => setMostrarMovimientos(true)}
        >
          Movimientos
        </button>
      </div>
    </>
  );
};
