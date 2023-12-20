import { Navbar } from "../../components/NavBar";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { miContexto } from "../../context/AppContext";
import { Tabla } from "../../components/Tabla";
import { RegisterRutaPage } from "./Components/Modals/RegisterRutaModal";
import { TablaAdministradores } from "../../components/TablaAdministradores";
import { CrearClienteModal } from "./Components/Modals/CrearClientesModal/CrearClienteModal";
import { TablaClientes } from "../../components/TablaClientes";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

export const HomePage = () => {
  const [isLogouting, setIsLogouting] = useState(false);
  const [isModalCreateRuta, setIsModalCreateRuta] = useState(false);
  const [isModalCreateCliente, setisModalCreateCliente] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const {
    usersAdminData,
    userData,
    rutasData,
    usuarioRuta,
    infoClientes,
    setInfoClientes,
  } = useContext(miContexto);

  console.log(rutasData);

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
  }, []);

  const posicionArroba = userData?.email.indexOf("@");

  return (
    <>
      {isModalCreateRuta ? (
        <RegisterRutaPage setIsModalCreateRuta={setIsModalCreateRuta} />
      ) : null}

      {isModalCreateCliente ? (
        <CrearClienteModal
          setisModalCreateCliente={setisModalCreateCliente}
          usuarioRuta={usuarioRuta}
        />
      ) : null}

      <Navbar />
      <div className="w-full min-h-screen bg-gray-200 pt-16 px-4 md:px-8">
        {user?.email === "jeancenteno54@fastadmin.com" && (
          <button
            type="button"
            className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => navigate("/registerAdm")}
            disabled={isLogouting}
          >
            Crear Admn
          </button>
        )}

        {userData?.isAdmin && (
          <button
            type="button"
            className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => navigate("/registerAdm")}
            disabled={true}
          >
            Crear Supervisor
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
          <button
            type="button"
            className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => setisModalCreateCliente(true)}
          >
            Agregar cliente
          </button>
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
          <h2 className="text-center text-lg font-bold uppercase mt-4">
            {usuarioRuta.nombreRuta}
          </h2>
        )}

        {user?.email === "jeancenteno54@fastadmin.com" && (
          <div className="w-full px-2 overflow-x-auto py-2">
            <Tabla datos={usersAdminData || []} />
          </div>
        )}

        {userData?.isAdmin && (
          <div className="w-full px-2 overflow-x-auto py-2">
            <TablaAdministradores datos={rutasData || []} />
          </div>
        )}

        {infoClientes && (
          <div className="w-full px-2 overflow-x-auto py-2">
            <TablaClientes datos={infoClientes} usuarioRuta={usuarioRuta} />
          </div>
        )}
      </div>
    </>
  );
};
