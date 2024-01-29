import { Navbar } from "../../components/NavBar";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { miContexto } from "../../context/AppContext";
import { Tabla } from "../../components/Tabla";
import { RegisterRutaPage } from "./Components/Modals/RegisterRutaModal";
import { TablaAdministradores } from "../../components/TablaAdministradores";
import { CrearClienteModal } from "../../components/CrearClienteModal";
import { TablaClientes } from "../../components/TablaClientes";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { CrearClienteModalNew } from "./Components/Modals/CrearClientesModal/CrearClienteModalNew";
import { CrearClienteExistenteModal } from "../../components/CrearClienteExistenteModal";
import { actualizarCuotas } from "./actualizarCuotas";
import { ModalRutasNoDisponibles } from "../../components/ModalRutasNoDisponibles";
import { ModalAvisoPago } from "../../components/ModalAvisoPago";
import { ModalAvisoBloqueo } from "../../components/ModalAvisoBloqueo";

export const HomePage = () => {
  const [isModalCreateRuta, setIsModalCreateRuta] = useState(false);
  const [isModalCreateClienteNew, setisModalCreateClienteNew] = useState(false);
  const [isModalCreateCliente, setisModalCreateCliente] = useState(false);
  const [isEditIndex, setisEditIndex] = useState(false);
  const [isModalCreateClienteExistente, setIsModalCreateClienteExistente] =
    useState(false);
  const [primerRender, setPrimerRender] = useState(true);
  const [isModalRutasNoDisponibles, setIsModalRutasNoDisponibles] =
    useState(false);
  const [isAvisoPago, setIsAvisoPago] = useState(false);
  const [isLockedAcount, setIsLockedAcount] = useState(false);
  const [sumaPagosDiarios, setSumaPagosDiarios] = useState(0);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const {
    usersAdminData,
    userData,
    usuarioRuta,
    setUsuarioRuta,
    infoClientes,
    setInfoClientes,
    setUsersAdminData,
    rutasData,
    formatDate2,
    setRutasData,
    calcularTotalAbonos,
  } = useContext(miContexto);
  const db = getFirestore();

  const totalAbonos = calcularTotalAbonos();

  let rutasDisponibles = parseInt(userData?.cantidadRutas) - rutasData?.length;

  const handleActualizarCuotas = async () => {
    const clientesActualizados = await actualizarCuotas({
      infoClientes,
      db,
      updateDoc,
      doc,
      usuarioRuta,
    });

    if (clientesActualizados) {
      setInfoClientes(clientesActualizados);
    }

    setPrimerRender(false);
  };

  useEffect(() => {
    if (infoClientes && primerRender) handleActualizarCuotas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primerRender, infoClientes]);

  const posicionArroba = userData?.email.indexOf("@");

  useEffect(() => {
    let sumaPagosDiarioscuenta = 0;

    if (infoClientes && infoClientes.length > 0) {
      console.log();
      for (let i = 0; i < infoClientes.length; i++) {
        sumaPagosDiarioscuenta += infoClientes[i].pagoDiario;
      }
    }

    setSumaPagosDiarios(sumaPagosDiarioscuenta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoClientes]);

  const handleCrearRuta = () => {
    if (rutasDisponibles === 0) {
      setIsModalRutasNoDisponibles(true);
    } else {
      setIsModalCreateRuta(true);
    }
  };

  useEffect(() => {
    if (userData) {
      const fechaMillis = userData.proximoPago.toMillis(); // Convertir a milisegundos
      const fechaProximoPago = userData.proximoPago;
      const proximoPago = formatDate2(fechaProximoPago);

      // Obtener la fecha de hoy en formato Date
      const fechaHoy = new Date();

      // Calcular la diferencia en milisegundos
      const diferenciaEnMillis = fechaHoy - fechaMillis;

      // Convertir la diferencia a días
      const diferenciaEnDias = Math.floor(
        diferenciaEnMillis / (1000 * 60 * 60 * 24)
      );

      if (
        proximoPago === formatDate2(fechaHoy) ||
        (diferenciaEnDias > 0 && diferenciaEnDias <= 2)
      ) {
        setIsAvisoPago(true);
      } else if (diferenciaEnDias >= 3) {
        setIsLockedAcount(true);
        setRutasData(null);
      }
    }
  }, [userData, formatDate2, setRutasData]);

  useEffect(() => {
    if (usuarioRuta) {
      const fechaMillis = usuarioRuta.proximoPago.toMillis(); // Convertir a milisegundos
      const fechaProximoPago = usuarioRuta.proximoPago;
      const proximoPago = formatDate2(fechaProximoPago);

      // Obtener la fecha de hoy en formato Date
      const fechaHoy = new Date();

      // Calcular la diferencia en milisegundos
      const diferenciaEnMillis = fechaHoy - fechaMillis;

      // Convertir la diferencia a días
      const diferenciaEnDias = Math.floor(
        diferenciaEnMillis / (1000 * 60 * 60 * 24)
      );

      if (
        proximoPago === formatDate2(fechaHoy) ||
        (diferenciaEnDias > 0 && diferenciaEnDias <= 2)
      ) {
        setIsAvisoPago(true);
      } else if (diferenciaEnDias >= 3) {
        setIsLockedAcount(true);
        setInfoClientes(null);
      }
    }
  }, [usuarioRuta, formatDate2, setInfoClientes]);

  useEffect(() => {
    const eliminarClientesPagados = async () => {
      if (infoClientes) {
        const fechaHoy = new Date();

        infoClientes.forEach(async (cliente) => {
          if (cliente.historialPagos) {
            const eliminarCliente =
              cliente.cuotasPactadas === cliente.cuotasPagadas &&
              cliente.historialPagos.some((pago) => {
                const fechaPago = pago.fecha.toDate();
                const fechaPagoMasUnDia = new Date(
                  fechaPago.getTime() + 24 * 60 * 60 * 1000
                ); // Añadir un día

                return (
                  fechaPagoMasUnDia.getDate() === fechaHoy.getDate() &&
                  fechaPagoMasUnDia.getMonth() === fechaHoy.getMonth() &&
                  fechaPagoMasUnDia.getFullYear() === fechaHoy.getFullYear()
                );
              });

            if (eliminarCliente) {
              const clienteRef = doc(
                db,
                "admin_users",
                usuarioRuta.adminUid,
                "rutas",
                usuarioRuta.uid,
                "clientes",
                cliente.uid
              );

              try {
                await deleteDoc(clienteRef);
              } catch (error) {
                console.error("Error al eliminar cliente", error);
              }
            }
          }
        });
      }
    };

    eliminarClientesPagados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoClientes]);

  return (
    <>
      {isModalRutasNoDisponibles ? (
        <ModalRutasNoDisponibles
          setIsModalRutasNoDisponibles={setIsModalRutasNoDisponibles}
        />
      ) : null}

      {isLockedAcount ? (
        <ModalAvisoBloqueo usuarioRuta={usuarioRuta} userData={userData} />
      ) : null}

      {isAvisoPago ? (
        <ModalAvisoPago
          setIsAvisoPago={setIsAvisoPago}
          userData={userData}
          usuarioRuta={usuarioRuta}
        />
      ) : null}

      {isModalCreateRuta ? (
        <RegisterRutaPage
          setIsModalCreateRuta={setIsModalCreateRuta}
          userData={userData}
        />
      ) : null}

      {isModalCreateCliente ? (
        <CrearClienteModal
          setisModalCreateClienteNew={setisModalCreateClienteNew}
          setisModalCreateCliente={setisModalCreateCliente}
          setIsModalCreateClienteExistente={setIsModalCreateClienteExistente}
        />
      ) : null}

      {isModalCreateClienteNew ? (
        <CrearClienteModalNew
          setisModalCreateClienteNew={setisModalCreateClienteNew}
          usuarioRuta={usuarioRuta}
          setUsuarioRuta={setUsuarioRuta}
        />
      ) : null}

      {isModalCreateClienteExistente ? (
        <CrearClienteExistenteModal
          setIsModalCreateClienteExistente={setIsModalCreateClienteExistente}
          usuarioRuta={usuarioRuta}
          setUsuarioRuta={setUsuarioRuta}
        />
      ) : null}

      <Navbar />
      <div className="w-full min-h-screen bg-gray-200 pt-16 px-4 md:px-8">
        {user?.email === "jeancenteno54@fastadmin.com" ||
        user?.email === "jeziel@fastadmin.com" ? (
          <button
            type="button"
            className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => navigate("/registerAdm")}
          >
            Crear Admn
          </button>
        ) : null}

        {userData?.isAdmin && (
          <>
            <p className="flex font-semibold">
              Rutas disponibles:
              <span className="ml-1">{`${
                rutasDisponibles ? rutasDisponibles : "0"
              }/${
                userData?.cantidadRutas ? userData?.cantidadRutas : "0"
              }`}</span>
            </p>
            <p className="flex font-semibold">
              Ultimo pago:
              <span className="ml-1">{`${
                userData.ultimoPago ? formatDate2(userData.ultimoPago) : ""
              }`}</span>
            </p>
            <p className="flex font-semibold">
              Proximo pago:
              <span className="ml-1">{`${
                userData.ultimoPago ? formatDate2(userData.proximoPago) : ""
              }`}</span>
            </p>
            <button
              type="button"
              className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
              onClick={handleCrearRuta}
            >
              Crear Ruta
            </button>
          </>
        )}

        {usuarioRuta && (
          <>
            <div className="w-full flex justify-between">
              <button
                type="button"
                className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
                onClick={() => setisModalCreateCliente(true)}
              >
                Agregar cliente
              </button>

              <div className="flex flex-col items-center mt-2">
                <span className="text-xl font-bold leading-3">
                  R${usuarioRuta.saldoInicial}
                </span>
                <span className="text-xs md:text-base md:font-semibold font-bold">
                  SALDO DISPONIBLE
                </span>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center">
                <div className="w-[20px] h-[20px] bg-blue-700 mr-1 border border-black"></div>
                <span>Clientes mensuales</span>
              </div>
              <div className="flex items-center">
                <div className="w-[20px] h-[20px] bg-orange-950 mr-1 border border-black"></div>
                <span>Clientes semanales</span>
              </div>
              <div className="flex items-center">
                <div className="w-[20px] h-[20px] bg-red-500 mr-1 border border-black"></div>
                <span>Clientes vencidos</span>
              </div>
              <div className="flex items-center">
                <div className="w-[20px] h-[20px] bg-yellow-500 mr-1 border border-black"></div>
                <span>+7 dias sin pagar</span>
              </div>
              <div className="flex items-center">
                <div className="w-[20px] h-[20px] bg-green-500 mr-1 border border-black"></div>
                <span>+2 dias sin pagar</span>
              </div>
              <div className="flex w-fit items-center mt-2">
                <span className="text-xs md:text-sm mr-1 md:font-semibold font-bold uppercase">
                  cuotas por cobrar:
                </span>
                <span className="font-bold ">R${sumaPagosDiarios}</span>
              </div>
              <div className="flex w-fit items-center">
                <span className="text-xs md:text-sm mr-1 md:font-semibold font-bold uppercase">
                  Cobrado hoy:
                </span>
                <span className="font-bold ">R${totalAbonos}</span>
              </div>
            </div>
          </>
        )}

        {userData && (
          <h2 className="text-center text-lg font-bold uppercase mt-4">
            {`Administrador: ${
              posicionArroba !== -1
                ? userData.email.substring(0, posicionArroba)
                : null
            }`}
          </h2>
        )}

        {usuarioRuta && (
          <div className="w-full flex justify-center items-center relative mt-6 ">
            <div className="absolute left-0 flex z-0">
              {!isEditIndex ? (
                <button
                  type="button"
                  className="bg-white font-semibold z-0 w-fit text-[#8131bd] px-2 py-1 rounded-md flex justify-center items-center min-w-[80px] shadow-lg"
                  onClick={() => setisEditIndex(true)}
                >
                  Ordenar lista
                </button>
              ) : null}

              {isEditIndex ? (
                <button
                  type="button"
                  className="bg-white font-semibold z-0 w-fit text-[#8131bd] px-2 py-1 rounded-md flex justify-center items-center min-w-[80px] shadow-lg"
                  onClick={() => setisEditIndex(false)}
                >
                  Terminar
                </button>
              ) : null}
            </div>

            <h2 className="text-lg font-bold uppercase z-0">
              {usuarioRuta.nombreRuta}
            </h2>
          </div>
        )}

        {user?.email === "jeancenteno54@fastadmin.com" ||
        user?.email === "jeziel@fastadmin.com" ? (
          <div className="w-full px-2 overflow-x-auto py-2">
            <Tabla
              datos={usersAdminData || []}
              setUsersAdminData={setUsersAdminData}
            />
          </div>
        ) : null}

        {userData?.isAdmin && (
          <div className="w-full px-2 overflow-x-auto py-2">
            <TablaAdministradores />
          </div>
        )}

        {infoClientes && (
          <div className="w-full overflow-x-auto py-2">
            <TablaClientes
              datos={infoClientes}
              usuarioRuta={usuarioRuta}
              setUsuarioRuta={setUsuarioRuta}
              isEditIndex={isEditIndex}
              setisEditIndex={setisEditIndex}
            />
          </div>
        )}
      </div>
    </>
  );
};
