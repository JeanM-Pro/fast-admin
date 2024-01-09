import React, { useContext, useState } from "react";
import { Navbar } from "../../components/NavBar";
import { miContexto } from "../../context/AppContext";
import { TablaMovimientosModal } from "./components/TablaMovimientosModal";
import { format } from "date-fns";

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

  const calcularTotalAbonos = () => {
    // infoClientes es el array de clientes que contiene la propiedad 'abono'
    if (!infoClientes || infoClientes?.length === 0) {
      return 0; // Si no hay clientes, el total de abonos es cero
    }

    // Sumar los abonos de todos los clientes
    const totalAbonos = infoClientes?.reduce(
      (acumulador, cliente) => acumulador + (cliente.abono || 0),
      0
    );

    return totalAbonos;
  };

  // Obtener el total de abonos llamando a la función
  const totalAbonos = calcularTotalAbonos();

  const fechaHoy = format(new Date(), "dd/MM/yyyy");

  const calcularPrestamoDelDia = () => {
    // infoClientes es el array de clientes que contiene la propiedad 'valorPrestamo'
    if (!infoClientes || infoClientes?.length === 0) {
      return 0; // Si no hay clientes, el total de préstamos es cero
    }

    // Filtrar los clientes cuya fecha sea igual a la fecha de hoy
    const clientesDelDia = infoClientes?.filter(
      (cliente) => cliente.fechaActual === fechaHoy
    );

    // Sumar los valores de 'valorPrestamo' de los clientes del día
    const prestamoDelDia = clientesDelDia?.reduce(
      (acumulador, cliente) => acumulador + (cliente.valorPrestamo || 0),
      0
    );

    return prestamoDelDia;
  };

  // Obtener el total de préstamos del día llamando a la función
  const prestamoDelDia = calcularPrestamoDelDia();

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
            </span>{" "}
            -{" "}
            <span className="font-semibold text-sm">
              {fechaDeSaldoMasNuevo ? formatDate(fechaDeSaldoMasNuevo) : null}
            </span>
          </p>
          <p>
            Ganancias:{" "}
            <span className="font-bold">${ganancias >= 0 ? ganancias : 0}</span>
          </p>
          <p>
            Total Clientes:{" "}
            <span className="font-bold">{infoClientes?.length}</span>
          </p>

          <p>
            Cobro del dia: <span className="font-bold">${totalAbonos}</span>
          </p>

          <p>
            Prestamos del dia:{" "}
            <span className="font-bold">${prestamoDelDia}</span>
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
