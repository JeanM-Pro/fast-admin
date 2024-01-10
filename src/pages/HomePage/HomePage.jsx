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

export const HomePage = () => {
  const [isModalCreateRuta, setIsModalCreateRuta] = useState(false);
  const [isModalCreateClienteNew, setisModalCreateClienteNew] = useState(false);
  const [isModalCreateCliente, setisModalCreateCliente] = useState(false);
  const [isEditIndex, setisEditIndex] = useState(false);
  const [isModalCreateClienteExistente, setIsModalCreateClienteExistente] =
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
  } = useContext(miContexto);

  useEffect(() => {
    const actualizarCuotas = async () => {
      if (infoClientes) {
        const db = getFirestore();
        const batch = [];

        // Utilizar una variable temporal para acumular los cambios
        let infoClientesActualizado = infoClientes.map((cliente) => {
          const { abono, fechaUltimoAbono } = cliente;
          const fechaActual = new Date();
          const fechaUltimoAbonoDate = new Date(fechaUltimoAbono);
          fechaActual.setHours(0, 0, 0, 0);
          fechaUltimoAbonoDate.setHours(0, 0, 0, 0);

          if (abono === 0 && fechaUltimoAbonoDate < fechaActual) {
            const cuotasAtrasadasActualizadas = cliente.cuotasAtrasadas + 1;
            batch.push(
              updateDoc(
                doc(
                  db,
                  "admin_users",
                  usuarioRuta.adminUid,
                  "rutas",
                  usuarioRuta.uid,
                  "clientes",
                  cliente.uid
                ),
                {
                  cuotasAtrasadas: cuotasAtrasadasActualizadas,
                }
              )
            );
            return { ...cliente, cuotasAtrasadas: cuotasAtrasadasActualizadas };
          } else if (abono > 0 && fechaUltimoAbonoDate < fechaActual) {
            batch.push(
              updateDoc(
                doc(
                  db,
                  "admin_users",
                  usuarioRuta.adminUid,
                  "rutas",
                  usuarioRuta.uid,
                  "clientes",
                  cliente.uid
                ),
                {
                  abono: 0,
                }
              )
            );
            return { ...cliente, abono: 0 };
          }

          return cliente;
        });

        // Actualizar localmente solo después de completar el bucle
        setInfoClientes(infoClientesActualizado);

        // Actualizar en Firebase
        await Promise.all(batch);
      }
    };

    actualizarCuotas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const posicionArroba = userData?.email.indexOf("@");

  return (
    <>
      {isModalCreateRuta ? (
        <RegisterRutaPage setIsModalCreateRuta={setIsModalCreateRuta} />
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
        {user?.email === "jeancenteno54@fastadmin.com" && (
          <button
            type="button"
            className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => navigate("/registerAdm")}
          >
            Crear Admn
          </button>
        )}

        {userData?.isAdmin && (
          <button
            type="button"
            className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => setIsModalCreateRuta(true)}
          >
            Crear Ruta
          </button>
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

        {user?.email === "jeancenteno54@fastadmin.com" && (
          <div className="w-full px-2 overflow-x-auto py-2">
            <Tabla
              datos={usersAdminData || []}
              setUsersAdminData={setUsersAdminData}
            />
          </div>
        )}

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
