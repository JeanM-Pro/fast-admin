import { useContext, useState } from "react";
import { AbonoModal } from "./AbonoModal";
import { DetallesClienteModal } from "./DetallesClienteModal";
import { miContexto } from "../context/AppContext";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { EditarClienteModal } from "./EditarClienteModal";
import { ModalDeleteCliente } from "./ModalDeleteCliente";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";
import { parse } from "date-fns";

export const TablaClientes = ({ datos, usuarioRuta, setUsuarioRuta }) => {
  const [isAbono, setIsAbono] = useState(false);
  const [selectedAbono, setSelectedAbono] = useState(null);
  const [verDetallesCliente, setVerDetallesCliente] = useState(false);
  const [selectedDetallesCliente, setSelectedDetallesCliente] = useState(null);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [clientes, setClientes] = useState(datos);
  const { userData, rutasData } = useContext(miContexto);
  const [isMovingClient, setIsMovingClient] = useState(false);

  const rutasFiltradas = rutasData?.filter(
    (ruta) => ruta.uid !== usuarioRuta.uid
  );

  const convertirFechaEnMilisegundos = (fecha) => {
    const fechaFormateada = parse(fecha, "dd/MM/yyyy", new Date());
    const milisegundos = fechaFormateada.getTime();
    return milisegundos;
  };

  const fechaActualEnMilisegundos = new Date().getTime();

  const handleMoveCliente = async (cliente, nuevaRutaUid) => {
    setIsMovingClient(true);
    const db = getFirestore();

    try {
      // Obtener referencia al cliente en la ruta original

      const rutaOriginalRef = doc(
        db,
        "admin_users",
        userData.uid,
        "rutas",
        usuarioRuta.uid,
        "clientes",
        cliente.uid
      );

      const clienteSnapshot = await getDoc(rutaOriginalRef);

      const clienteData = clienteSnapshot.data();

      // Obtener referencia a la nueva ruta

      const nuevoClienteRef = doc(
        db,
        "admin_users",
        userData.uid,
        "rutas",
        nuevaRutaUid,
        "clientes",
        cliente.uid
      );

      // Agregar el cliente a la nueva ruta

      await setDoc(nuevoClienteRef, clienteData);

      // Eliminar el cliente de la ruta original
      await deleteDoc(rutaOriginalRef);

      const clientesNuevos = clientes.filter(
        (client) => client.uid !== cliente.uid
      );

      setClientes(clientesNuevos);
      setIsMovingClient(false);
      toast.success("Cliente movido con exito");
    } catch (error) {
      console.error("Error al mover el cliente:", error.message);
    }
  };

  const handleEditClick = (cliente) => {
    if (!userData.isAdmin) {
      return;
    } else {
      setIsModalEdit(true);
      setSelectedCliente(cliente);
    }
  };

  const handleDeleteClick = (cliente) => {
    if (!userData.isAdmin) {
      return;
    } else {
      setIsModalDelete(true);
      setSelectedCliente(cliente);
    }
  };

  const handleAbono = (cliente) => {
    setSelectedAbono(cliente);
    setIsAbono(true);
  };

  const handleDetallesCliente = (cliente) => {
    setSelectedDetallesCliente(cliente);
    setVerDetallesCliente(true);
  };

  return (
    <>
      {isModalDelete ? (
        <ModalDeleteCliente
          setIsModalDelete={setIsModalDelete}
          selectedCliente={selectedCliente}
          userData={userData}
          usuarioRuta={usuarioRuta}
          setClientes={setClientes}
          clientes={clientes}
        />
      ) : null}

      {isModalEdit ? (
        <EditarClienteModal
          setIsModalEdit={setIsModalEdit}
          selectedCliente={selectedCliente}
          setSelectedCliente={setSelectedCliente}
          userData={userData}
          usuarioRuta={usuarioRuta}
          setClientes={setClientes}
        />
      ) : null}

      {isAbono ? (
        <AbonoModal
          setIsAbono={setIsAbono}
          selectedAbono={selectedAbono}
          usuarioRuta={usuarioRuta}
          setUsuarioRuta={setUsuarioRuta}
          setSelectedAbono={(updatedAbono) => {
            setSelectedAbono(updatedAbono);
            // Actualiza localmente los datos en la tabla
            setClientes((prevClientes) =>
              prevClientes.map((cliente) =>
                cliente.uid === updatedAbono.uid ? updatedAbono : cliente
              )
            );
          }}
        />
      ) : null}

      {verDetallesCliente ? (
        <DetallesClienteModal
          setVerDetallesCliente={setVerDetallesCliente}
          selectedDetallesCliente={selectedDetallesCliente}
        />
      ) : null}

      {isMovingClient ? (
        <div className="w-full flex-col top-0 left-0 min-h-screen h-screen z-30 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed ">
          <MoonLoader size={48} color="#ffffff" />
          <p className="text-white font-semibold text-base">
            Moviendo Cliente...
          </p>
        </div>
      ) : null}
      <table className="min-w-full mt-2 bg-white">
        <thead>
          <tr className="bg-[#8131bd] uppercase text-sm text-white">
            <th className="border border-black w-6 px-2 py-1">#</th>
            <th className="border border-black min-w-fit px-2 py-1">Cliente</th>
            <th className="border border-black min-w-fit px-2 py-1 whitespace-nowrap">
              abonó hoy
            </th>
            <th className="border border-black w-fit px-2 py-1">cuota</th>
            <th className="border border-black w-fit px-2 py-1">c.pag</th>
            <th className="border border-black w-fit px-2 py-1">c.res</th>
            {userData?.isAdmin && (
              <>
                <th className="border border-black w-10 px-2 py-1">Editar</th>
                <th className="border border-black w-10 px-2 py-1">Eliminar</th>
              </>
            )}

            <th className="border border-black w-fit px-2 py-1">detalles</th>
            {userData && rutasFiltradas.length >= 1 ? (
              <th className="border border-black w-[200px] md:w-fit px-10 md:px-2 py-1">
                mover
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(clientes) && clientes.length > 0 ? (
            clientes.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"
                } border border-black text-sm font-semibold py-2`}
              >
                <td
                  className={`${
                    item.cuotasAtrasadas >= 2 && item.cuotasAtrasadas <= 7
                      ? "bg-green-500"
                      : null
                  } ${
                    item.cuotasAtrasadas >= 8 &&
                    item.cuotasAtrasadas <= item.cuotasPactadas
                      ? "bg-yellow-500"
                      : null
                  } border border-black text-center px-2 py-2 ${
                    convertirFechaEnMilisegundos(item.fechaFinal) <
                    fechaActualEnMilisegundos
                      ? "bg-red-500"
                      : null
                  }`}
                >
                  {index + 1}
                </td>

                <td className="items-center uppercase border-black min-w-max flex justify-center px-1 py-2">
                  {item.nombreCliente}
                </td>

                <td
                  className="border border-black px-2 w-fit text-center py-2"
                  onClick={() => handleAbono(item)}
                >
                  ${item.abono}
                </td>

                <td className="border border-black px-2 w-fit text-center py-2">
                  {`$${item.pagoDiario}`}
                </td>

                <td className="border border-black px-2 w-fit text-center py-2">
                  {item.cuotasPagadas}
                </td>

                <td className="border border-black px-2 w-fit text-center py-2">
                  {item.cuotasPactadas - item.cuotasPagadas}
                </td>

                {userData?.isAdmin && (
                  <>
                    <td className="border border-black w-10 text-center px-2 py-1 font-semibold">
                      <AiOutlineEdit
                        onClick={() => handleEditClick(item)}
                        className="cursor-pointer my-0 mx-auto"
                      />
                    </td>

                    <td className="border border-black w-10  px-2 py-1 font-semibold">
                      <AiOutlineDelete
                        className="cursor-pointer my-0 mx-auto"
                        onClick={() => handleDeleteClick(item)}
                      />
                    </td>
                  </>
                )}

                <td
                  onClick={() => handleDetallesCliente(item)}
                  className="border border-black px-2 w-fit text-center py-2 underline uppercase cursor-pointer"
                >
                  ver
                </td>

                {userData && rutasFiltradas.length >= 1 ? (
                  <td className="border border-black px-2 w-fit text-center py-2 underline uppercase cursor-pointer">
                    <select
                      className="flex-1 rounded-r-md w-full px-1 focus:border-transparent focus:outline-none"
                      defaultValue="Seleccionar"
                      onChange={(e) => {
                        const nuevaRutaUid = e.target.value;
                        if (nuevaRutaUid !== "Seleccionar") {
                          handleMoveCliente(item, nuevaRutaUid);
                        }
                      }}
                    >
                      <option value="Seleccionar" disabled>
                        Seleccionar
                      </option>
                      {rutasFiltradas.map((ruta) => (
                        <option value={ruta.uid} key={ruta.uid}>
                          {ruta.nombreRuta}
                        </option>
                      ))}
                    </select>
                  </td>
                ) : null}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No hay datos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};
