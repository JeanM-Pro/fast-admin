import { toast } from "react-toastify";
import { Navbar } from "../../components/NavBar";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { MoonLoader } from "react-spinners";
import { miContexto } from "../../context/AppContext";
import { Tabla } from "../../components/Tabla";
import { RegisterRutaPage } from "./Components/Modals/RegisterRutaModal";
import { TablaAdministradores } from "../../components/TablaAdministradores";
import { CrearClienteModal } from "./Components/Modals/CrearClientesModal/CrearClienteModal";
import { TablaClientes } from "../../components/TablaClientes";

export const HomePage = () => {
  const [isLogouting, setIsLogouting] = useState(false);
  const [isModalCreateRuta, setIsModalCreateRuta] = useState(false);
  const [isModalCreateCliente, setisModalCreateCliente] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { usersAdminData, userData, rutasData, usuarioRuta, infoClientes } =
    useContext(miContexto);

  const handleLogout = async () => {
    setIsLogouting(true);
    try {
      await auth.signOut();
      toast.success("Sesión cerrada exitosamente.");
      navigate("/login");
      setIsLogouting(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

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
        <button
          type="button"
          className="bg-[#8131bd] w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
          onClick={handleLogout}
          disabled={isLogouting}
        >
          {isLogouting ? (
            <MoonLoader size={20} color="#ffffff" />
          ) : (
            "Cerrar Sesion"
          )}
        </button>

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

        {userData && <h2>{userData.email}</h2>}
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
