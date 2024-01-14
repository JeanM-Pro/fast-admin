import React, { useContext, useState } from "react";
import { Navbar } from "../../components/NavBar";
import { miContexto } from "../../context/AppContext";
import { TablaMovimientosModal } from "./components/TablaMovimientosModal";
import { format } from "date-fns";
import { ModalCambiarContrasena } from "../../components/ModalCambiarContrasena";

export const EstadisticasPage = () => {
  const { usuarioRuta, formatDate, infoClientes, rutasData, userData } =
    useContext(miContexto);
  const [mostrarMovimientos, setMostrarMovimientos] = useState(false);
  const [verCambiarContrasenaModal, setverCambiarContrasenaModal] =
    useState(false);

  const saldoRutas = rutasData?.reduce(
    (total, ruta) => total + ruta.saldoInicial,
    0
  );

  const ultimoSaldo = rutasData?.reduce((total, ruta) => {
    // Verifica si hay algún historial de saldos
    if (ruta.historialSaldos && ruta.historialSaldos.length > 0) {
      // Ordena el historial de saldos por fecha de forma descendente
      const historialOrdenado = ruta.historialSaldos.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );

      // Toma el saldo más reciente
      const saldoMasReciente = historialOrdenado[0].saldo;

      // Suma el saldo más reciente al total
      return total + parseFloat(saldoMasReciente); // Convierte a número
    }

    // Si no hay historial de saldos, retorna el total sin cambios
    return total;
  }, 0);

  const gananciasRutas = saldoRutas - ultimoSaldo;

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
      {verCambiarContrasenaModal ? (
        <ModalCambiarContrasena
          setverCambiarContrasenaModal={setverCambiarContrasenaModal}
        />
      ) : null}

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
            <span className="font-bold">
              $
              {usuarioRuta?.saldoInicial
                ? usuarioRuta?.saldoInicial
                : saldoRutas}
            </span>
          </p>

          <p>
            Ultimo saldo ingresado:{" "}
            <span className="font-bold">
              ${saldoMasNuevo ? saldoMasNuevo : ultimoSaldo}
            </span>
            {saldoMasNuevo ? " - " : null}
            <span className="font-semibold text-sm">
              {fechaDeSaldoMasNuevo ? formatDate(fechaDeSaldoMasNuevo) : null}
            </span>
          </p>

          {userData ? (
            <p>
              Ganancias:
              <span className="font-bold ml-1">
                ${gananciasRutas >= 0 ? gananciasRutas : 0}
              </span>
            </p>
          ) : (
            <p>
              Ganancias:
              <span className="font-bold ml-1">
                ${ganancias >= 0 ? ganancias : 0}
              </span>
            </p>
          )}

          {userData ? (
            <p>
              Total rutas:
              <span className="font-bold ml-1">{rutasData?.length}</span>
            </p>
          ) : (
            <p>
              Total Clientes:
              <span className="font-bold ml-1">{infoClientes?.length}</span>
            </p>
          )}

          {userData ? (
            <button
              type="button"
              className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
              onClick={() => setverCambiarContrasenaModal(true)}
            >
              Cambiar Contraseña
            </button>
          ) : (
            <>
              <p>
                Cobro del dia: <span className="font-bold">${totalAbonos}</span>
              </p>
              <p>
                Prestamos del dia:{" "}
                <span className="font-bold">${prestamoDelDia}</span>
              </p>
              <button
                type="button"
                className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
                onClick={() => setMostrarMovimientos(true)}
              >
                Movimientos
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
