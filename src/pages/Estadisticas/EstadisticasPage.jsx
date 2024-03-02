import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../../components/NavBar";
import { miContexto } from "../../context/AppContext";
import { TablaMovimientosModal } from "./components/TablaMovimientosModal";
import { ModalCambiarContrasena } from "../../components/ModalCambiarContrasena";
import { ModalNoAutorizado } from "../../components/ModalNoAutorizado";

export const EstadisticasPage = () => {
  const {
    usuarioRuta,
    formatDate,
    infoClientes,
    rutasData,
    userData,
    calcularPrestamoDelDia,
    formatDate2,
    calcularTotalAbonos,
  } = useContext(miContexto);
  const [mostrarMovimientos, setMostrarMovimientos] = useState(false);
  const [verCambiarContrasenaModal, setverCambiarContrasenaModal] =
    useState(false);
  const [gastosHoy, setGastosHoy] = useState(0);
  const [verModalNoautorizado, setVerModalNoautorizado] = useState(false);

  useEffect(() => {
    if (usuarioRuta && usuarioRuta.historialGastos) {
      // Obtener la fecha actual
      const fechaHoy = formatDate2(new Date());

      // Iterar sobre el historial de gastos y sumar los gastos de hoy
      const gastosHoyTotal = usuarioRuta.historialGastos.reduce(
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
  }, [formatDate2, usuarioRuta, usuarioRuta?.historialGastos]);

  // Función para verificar si dos fechas son del mismo día
  const esMismoDia = (fecha1, fecha2) => {
    return fecha1 === fecha2 && fecha1 === fecha2 && fecha1 === fecha2;
  };

  const saldoRutas = rutasData?.reduce(
    (total, ruta) => total + parseInt(ruta.saldoInicial),
    0
  );

  const ultimoSaldo = rutasData?.reduce(
    (total, ruta) => total + parseInt(ruta.historialSaldos),
    0
  );

  const gananciasRutas = saldoRutas - ultimoSaldo;

  const saldoMasNuevo = parseFloat(usuarioRuta?.historialSaldos) || null;

  const ganancias =
    parseInt(usuarioRuta?.saldoInicial) -
    parseInt(usuarioRuta?.historialSaldos);

  // Obtener el total de abonos llamando a la función
  const totalAbonos = calcularTotalAbonos();

  // Obtener el total de préstamos del día llamando a la función
  const prestamoDelDia = calcularPrestamoDelDia();

  const handleCambiarContrasenha = () => {
    if (usuarioRuta?.isAutorized || userData) {
      setverCambiarContrasenaModal(true);
    } else {
      setVerModalNoautorizado(true);
    }
  };

  return (
    <>
      {verCambiarContrasenaModal ? (
        <ModalCambiarContrasena
          setverCambiarContrasenaModal={setverCambiarContrasenaModal}
        />
      ) : null}

      {verModalNoautorizado ? (
        <ModalNoAutorizado setVerModalNoautorizado={setVerModalNoautorizado} />
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
              R$
              {usuarioRuta?.saldoInicial
                ? usuarioRuta?.saldoInicial
                : saldoRutas}
            </span>
          </p>

          <p>
            {userData ? "Total saldo invertido: " : "Ultimo saldo ingresado: "}
            <span className="font-bold">
              R${saldoMasNuevo ? saldoMasNuevo : ultimoSaldo}
            </span>
          </p>

          {userData ? (
            <p>
              Ganancias:
              <span className="font-bold ml-1">
                R${gananciasRutas >= 0 ? gananciasRutas : 0}
              </span>
            </p>
          ) : (
            <p>
              Ganancias:
              <span className="font-bold ml-1">
                R${ganancias >= 0 ? ganancias : 0}
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

          {userData ? null : (
            <>
              <p>
                Cobro del dia:{" "}
                <span className="font-bold">R${totalAbonos}</span>
              </p>
              <p>
                Prestamos del dia:{" "}
                <span className="font-bold">R${prestamoDelDia}</span>
              </p>
              <p>
                Gastos del dia: <span className="font-bold">R${gastosHoy}</span>
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

          <button
            type="button"
            className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={handleCambiarContrasenha}
          >
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </>
  );
};
