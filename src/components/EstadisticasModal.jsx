import React, { useContext, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { miContexto } from "../context/AppContext";
import { TablaMovimientosModal } from "../pages/Estadisticas/components/TablaMovimientosModal";
import { format } from "date-fns";

export const EstadisticasModal = ({
  setVerEstadisticas,
  selectedRuta,
  clientes,
}) => {
  const { formatDate } = useContext(miContexto);
  const [mostrarMovimientos, setMostrarMovimientos] = useState(false);

  const compararFechas = (a, b) => {
    const fechaA = new Date(a.fecha.seconds * 1000 + a.fecha.nanoseconds / 1e6);
    const fechaB = new Date(b.fecha.seconds * 1000 + b.fecha.nanoseconds / 1e6);
    return fechaB - fechaA;
  };

  selectedRuta?.historialSaldos.sort(compararFechas);
  const saldoMasNuevo =
    selectedRuta?.historialSaldos.length > 0
      ? selectedRuta.historialSaldos[0].saldo
      : null;
  const fechaDeSaldoMasNuevo =
    selectedRuta?.historialSaldos.length > 0
      ? selectedRuta?.historialSaldos[0].fecha
      : null;

  const ganancias =
    parseInt(selectedRuta?.saldoInicial) - parseInt(saldoMasNuevo);

  const calcularTotalAbonos = () => {
    // infoClientes es el array de clientes que contiene la propiedad 'abono'
    if (!clientes || clientes?.length === 0) {
      return 0; // Si no hay clientes, el total de abonos es cero
    }

    // Sumar los abonos de todos los clientes
    const totalAbonos = clientes?.reduce(
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
    if (!clientes || clientes?.length === 0) {
      return 0; // Si no hay clientes, el total de préstamos es cero
    }

    // Filtrar los clientes cuya fecha sea igual a la fecha de hoy
    const clientesDelDia = clientes?.filter(
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
          usuarioRuta={selectedRuta}
          setMostrarMovimientos={setMostrarMovimientos}
        />
      ) : null}

      <div className="w-full min-h-screen h-screen z-30 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
        <div className="bg-gray-200 w-[400px] md:w-full p-4 md:h-full rounded-md relative max-h-[90%] overflow-y-auto">
          <div className="absolute right-2 top-2 cursor-pointer bg-white rounded-[50%] p-[1px]">
            <IoIosClose size={40} onClick={() => setVerEstadisticas(false)} />
          </div>
          <div>
            <p>
              Saldo Actual:{" "}
              <span className="font-bold">${selectedRuta?.saldoInicial}</span>
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
              Fecha:{" "}
              <span className="font-bold">
                {fechaDeSaldoMasNuevo ? formatDate(fechaDeSaldoMasNuevo) : null}
              </span>
            </p>
            <p>
              Ganancias:{" "}
              <span className="font-bold">
                ${ganancias >= 0 ? ganancias : 0}
              </span>
            </p>
            <p>
              Total Clientes:{" "}
              <span className="font-bold">{clientes.length}</span>
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
      </div>
    </>
  );
};
