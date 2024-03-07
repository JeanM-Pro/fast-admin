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
import { ModalPreguntaRenovacion } from "./ModalPreguntaRenovacion";

export const TablaClientes = ({
  datos,
  usuarioRuta,
  setUsuarioRuta,
  isEditIndex,
  searchTerm,
  setIsModalCreateClienteExistente,
  setSearchTermExis,
}) => {
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
  const [orderValues, setOrderValues] = useState({});
  const [isModalPreguntaRenovacion, setIsModalPreguntaRenovacion] =
    useState(false);
  const initialInputValues = {};
  const [inputValues, setInputValues] = useState(initialInputValues);

  const handleChangeOrder = (clienteUid, newOrder) => {
    // Actualiza el estado de orderValues y el valor del input
    setOrderValues((prevOrderValues) => ({
      ...prevOrderValues,
      [clienteUid]: newOrder,
    }));
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [clienteUid]: newOrder + 1,
    }));
  };

  const handleButtonClick = async () => {
    try {
      // Actualiza la posición de los clientes en Firebase
      const db = getFirestore();
      const rutaRef = doc(
        db,
        "admin_users",
        usuarioRuta.adminUid,
        "rutas",
        usuarioRuta.uid
      );

      // Almacena todas las promesas de actualización en un array
      const updatePromises = Object.keys(orderValues).map(
        async (clienteUid) => {
          const newOrder = orderValues[clienteUid];
          const clienteRef = doc(rutaRef, "clientes", clienteUid);

          // Actualiza la posición del cliente en Firebase
          await setDoc(clienteRef, { posicion: newOrder + 1 }, { merge: true });
        }
      );

      // Espera a que todas las promesas de actualización se completen
      await Promise.all(updatePromises);

      // Actualiza el orden de los clientes basado en orderValues
      const newClientes = [...clientes];

      Object.keys(orderValues).forEach((clienteUid) => {
        const newOrder = orderValues[clienteUid];
        const clienteIndex = newClientes.findIndex(
          (client) => client.uid === clienteUid
        );

        if (clienteIndex !== -1) {
          // Actualiza localmente el valor de posicion del cliente
          newClientes[clienteIndex] = {
            ...newClientes[clienteIndex],
            posicion: newOrder + 1,
          };
        }

        if (clienteIndex !== -1) {
          newClientes.splice(
            newOrder,
            0,
            newClientes.splice(clienteIndex, 1)[0]
          );
        }
      });

      // Actualiza el estado de clientes con el nuevo orden
      setClientes(newClientes);

      // Limpia los valores de los inputs y orderValues
      setInputValues({});
      setOrderValues({});
      window.location.reload();
    } catch (error) {
      console.error(
        "Error al actualizar la posición del cliente:",
        error.message
      );
    }
  };

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
    setSearchTermExis(cliente.nombreCliente);
  };

  const handleDetallesCliente = (cliente) => {
    setSelectedDetallesCliente(cliente);
    setVerDetallesCliente(true);
  };

  // Filtrar recetas segun el input de buscar recetas

  const filteredClients = datos?.filter(
    (cliente) =>
      cliente &&
      cliente.nombreCliente &&
      cliente.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          setUsuarioRuta={setUsuarioRuta}
          setClientes={setClientes}
        />
      ) : null}

      {isAbono ? (
        <AbonoModal
          setIsModalPreguntaRenovacion={setIsModalPreguntaRenovacion}
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

      {isModalPreguntaRenovacion ? (
        <ModalPreguntaRenovacion
          setIsModalPreguntaRenovacion={setIsModalPreguntaRenovacion}
          setIsModalCreateClienteExistente={setIsModalCreateClienteExistente}
        />
      ) : null}

      <table className="min-w-full mt-2 bg-white">
        <thead>
          <tr className="bg-[#8131bd] uppercase text-sm text-white ">
            {isEditIndex ? (
              <th className="border border-black w-6 px-2 py-1 whitespace-nowrap">
                Orden
              </th>
            ) : null}
            {isEditIndex ? (
              <th className="border border-black w-6 px-2 py-1 whitespace-nowrap">
                cambiar
              </th>
            ) : null}
            <th className="border border-black w-6 px-2 py-1 whitespace-nowrap">
              #
            </th>
            <th className="border border-black min-w-fit px-2 py-1 whitespace-nowrap">
              Cliente
            </th>
            <th className="border border-black min-w-fit px-2 py-1 whitespace-nowrap">
              abonó hoy
            </th>
            <th className="border border-black w-fit px-2 py-1 whitespace-nowrap">
              cuota
            </th>
            <th className="border border-black w-fit px-2 py-1 whitespace-nowrap">
              c.pag
            </th>
            <th className="border border-black w-fit px-2 py-1 whitespace-nowrap">
              c.res
            </th>
            {userData?.isAdmin && (
              <>
                <th className="border border-black w-10 px-2 py-1 whitespace-nowrap">
                  Editar
                </th>
                <th className="border border-black w-10 px-2 py-1 whitespace-nowrap">
                  Eliminar
                </th>
              </>
            )}

            <th className="border border-black w-fit px-2 py-1 whitespace-nowrap">
              detalles
            </th>
            {userData && rutasFiltradas.length >= 1 ? (
              <th className="border border-black w-[200px] md:w-fit px-10 md:px-2 py-1 whitespace-nowrap">
                mover
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredClients) && filteredClients.length > 0 ? (
            filteredClients.map((item, index) => (
              <tr
                key={item.uid}
                className={`${
                  index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"
                } border border-black text-sm font-semibold py-2`}
              >
                {isEditIndex ? (
                  <td className="items-center uppercase border-black flex justify-center px-1 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      placeholder={item.posicion}
                      className="w-full text-center border border-black focus:outline-none"
                      value={inputValues[item.uid] || ""}
                      onChange={(e) =>
                        handleChangeOrder(
                          item.uid,
                          parseInt(e.target.value, 10) - 1
                        )
                      }
                    />
                  </td>
                ) : null}

                {isEditIndex ? (
                  <td className="px-2 py-2 border border-black whitespace-nowrap">
                    <button
                      onClick={handleButtonClick}
                      className="border w-full border-black bg-green-500 rounded-md"
                    >
                      OK
                    </button>
                  </td>
                ) : null}

                <td
                  className={`whitespace-nowrap ${
                    item.cuotasAtrasadas >= 2 && item.cuotasAtrasadas <= 7
                      ? "bg-green-500"
                      : null
                  } ${
                    item.cuotasAtrasadas >= 8 ? "bg-yellow-500" : null
                  } border border-black text-center px-2 py-2 ${
                    convertirFechaEnMilisegundos(item.fechaFinal) <
                    fechaActualEnMilisegundos
                      ? "bg-red-500"
                      : null
                  } ${
                    item.formaDePago === "semanal"
                      ? "bg-orange-950 text-white"
                      : null
                  } ${
                    item.formaDePago === "mensual"
                      ? "bg-blue-700 text-white"
                      : null
                  }`}
                >
                  {index + 1}
                </td>

                <td className="whitespace-nowrap items-center uppercase border-black min-w-max flex justify-center px-1 py-2">
                  {item.nombreCliente}
                </td>

                <td
                  className={`${
                    item.abono >= item.pagoDiario ? "bg-green-300" : null
                  } ${
                    item.abono < item.pagoDiario && item.abono > 0
                      ? "bg-yellow-200"
                      : null
                  } whitespace-nowrap border border-black px-2 w-fit text-center py-2`}
                  onClick={() => handleAbono(item)}
                >
                  R${item.abono}
                </td>

                <td className="whitespace-nowrap border border-black px-2 w-fit text-center py-2">
                  {`R$${item.pagoDiario}`}
                </td>

                <td className="whitespace-nowrap border border-black px-2 w-fit text-center py-2">
                  {Math.floor(item.totalAbono / item.pagoDiario)}
                </td>

                <td className="whitespace-nowrap border border-black px-2 w-fit text-center py-2">
                  {item.cuotasPactadas -
                    Math.floor(item.totalAbono / item.pagoDiario)}
                </td>

                {userData?.isAdmin && (
                  <>
                    <td className="whitespace-nowrap border border-black w-10 text-center px-2 py-1 font-semibold">
                      <AiOutlineEdit
                        onClick={() => handleEditClick(item)}
                        className="cursor-pointer my-0 mx-auto"
                      />
                    </td>

                    <td className="whitespace-nowrap border border-black w-10  px-2 py-1 font-semibold">
                      <AiOutlineDelete
                        className="cursor-pointer my-0 mx-auto"
                        onClick={() => handleDeleteClick(item)}
                      />
                    </td>
                  </>
                )}

                <td
                  onClick={() => handleDetallesCliente(item)}
                  className="border whitespace-nowrap border-black px-2 w-fit text-center py-2 underline uppercase cursor-pointer"
                >
                  ver
                </td>

                {userData && rutasFiltradas.length >= 1 ? (
                  <td className="border whitespace-nowrap border-black px-2 w-fit text-center py-2 underline uppercase cursor-pointer">
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
