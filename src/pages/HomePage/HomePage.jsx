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
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { CrearClienteModalNew } from "./Components/Modals/CrearClientesModal/CrearClienteModalNew";
import { CrearClienteExistenteModal } from "../../components/CrearClienteExistenteModal";
import { actualizarCuotas } from "./actualizarCuotas";
import { ModalRutasNoDisponibles } from "../../components/ModalRutasNoDisponibles";

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
  } = useContext(miContexto);
  const db = getFirestore();
  const adminData = usersAdminData?.filter((adm) => adm.uid === user?.uid);
  let adminInfo;

  if (adminData) {
    adminInfo = adminData[0];
  }

  let rutasDisponibles = parseInt(adminInfo?.cantidadRutas) - rutasData?.length;

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

  let sumaPagosDiarios = 0;

  for (let i = 0; i < infoClientes?.length; i++) {
    sumaPagosDiarios += infoClientes[i].pagoDiario;
  }

  const handleCrearRuta = () => {
    if (rutasDisponibles === 0) {
      setIsModalRutasNoDisponibles(true);
    } else {
      setIsModalCreateRuta(true);
    }
  };

  return (
    <>
      {isModalRutasNoDisponibles ? (
        <ModalRutasNoDisponibles
          setIsModalRutasNoDisponibles={setIsModalRutasNoDisponibles}
        />
      ) : null}

      {isModalCreateRuta ? (
        <RegisterRutaPage
          setIsModalCreateRuta={setIsModalCreateRuta}
          adminInfo={adminInfo}
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
                adminInfo?.cantidadRutas ? adminInfo?.cantidadRutas : "0"
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
                  ${usuarioRuta.saldoInicial}
                </span>
                <span className="text-xs md:text-base md:font-semibold font-bold">
                  SALDO DISPONIBLE
                </span>
              </div>
            </div>
            <div className="mt-2">
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
              <div className="flex w-fit items-center mt-3">
                <span className="text-xs md:text-sm mr-1 md:font-semibold font-bold uppercase">
                  cuotas por cobrar:
                </span>
                <span className="font-bold ">${sumaPagosDiarios}</span>
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
          <div className="w-full flex justify-center items-center relative mt-6">
            <div className="absolute left-0 flex ">
              {!isEditIndex ? (
                <button
                  type="button"
                  className="bg-white font-semibold  w-fit text-[#8131bd] px-2 py-1 rounded-md flex justify-center items-center min-w-[80px] shadow-lg"
                  onClick={() => setisEditIndex(true)}
                >
                  Ordenar lista
                </button>
              ) : null}

              {isEditIndex ? (
                <button
                  type="button"
                  className="bg-white font-semibold  w-fit text-[#8131bd] px-2 py-1 rounded-md flex justify-center items-center min-w-[80px] shadow-lg"
                  onClick={() => setisEditIndex(false)}
                >
                  Terminar
                </button>
              ) : null}
            </div>

            <h2 className="text-lg font-bold uppercase">
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
