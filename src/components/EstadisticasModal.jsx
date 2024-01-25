import React, { useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { miContexto } from "../context/AppContext";
import { TablaMovimientosModal } from "../pages/Estadisticas/components/TablaMovimientosModal";
import { format } from "date-fns";

export const EstadisticasModal = ({
  setVerEstadisticas,
  selectedRuta,
  clientes,
}) => {
  const { formatDate, formatDate2 } = useContext(miContexto);
  const [mostrarMovimientos, setMostrarMovimientos] = useState(false);
  const [gastosHoy, setGastosHoy] = useState(0);

  useEffect(() => {
    if (selectedRuta && selectedRuta.historialGastos) {
      // Obtener la fecha actual
      const fechaHoy = formatDate2(new Date());

      // Iterar sobre el historial de gastos y sumar los gastos de hoy
      const gastosHoyTotal = selectedRuta.historialGastos.reduce(
        (total, gasto) => {
          const gastoFecha = formatDate2(gasto.fecha);

          // Verificar si el gasto es de hoy
          if (esMismoDia(gastoFecha, fechaHoy)) {
            return total + gasto.valor;
          } else {
            return total;
          }
        },
        0
      );

      // Actualizar el estado con la suma de los gastos de hoy
      setGastosHoy(gastosHoyTotal);
    }
  }, [formatDate2, selectedRuta, selectedRuta?.historialGastos]);

  // Función para verificar si dos fechas son del mismo día
  const esMismoDia = (fecha1, fecha2) => {
    return fecha1 === fecha2 && fecha1 === fecha2 && fecha1 === fecha2;
  };

  const saldoMasNuevo = parseFloat(selectedRuta?.historialSaldos) || null;

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
              <span className="font-bold">R${selectedRuta?.saldoInicial}</span>
            </p>
            <p>
              Ultimo saldo ingresado:{" "}
              <span className="font-bold">
                R${saldoMasNuevo ? saldoMasNuevo : ""}
              </span>
            </p>

            <p>
              Ganancias:{" "}
              <span className="font-bold">
                R${ganancias >= 0 ? ganancias : 0}
              </span>
            </p>
            <p>
              Total Clientes:{" "}
              <span className="font-bold">{clientes.length}</span>
            </p>

            <p>
              Cobro del dia: <span className="font-bold">R${totalAbonos}</span>
            </p>

            <p>
              Prestamos del dia:{" "}
              <span className="font-bold">R${prestamoDelDia}</span>
            </p>
            <p>
              Gastos del dia: <span className="font-bold">R${gastosHoy}</span>
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
