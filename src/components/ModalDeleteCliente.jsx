import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";
import { miContexto } from "../context/AppContext";

export const ModalDeleteCliente = ({
  setIsModalDelete,
  selectedCliente,
  userData,
  usuarioRuta,
  clientes,
  setClientes,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { setRutasData } = useContext(miContexto);

  const deleteCliente = async () => {
    setIsDeleting(true);
    const db = getFirestore();
    const clienteRef = doc(
      db,
      "admin_users",
      userData.uid,
      "rutas",
      usuarioRuta.uid,
      "clientes",
      selectedCliente.uid
    );

    const clienteSnapshot = await getDoc(clienteRef);
    const clienteData = clienteSnapshot.data();

    const rutaRef = doc(
      db,
      "admin_users",
      userData.uid,
      "rutas",
      usuarioRuta.uid
    );

    const rutaSnapshot = await getDoc(rutaRef);
    const rutaData = rutaSnapshot.data();

    if (clienteData.cuotasPagadas === 0) {
      await updateDoc(rutaRef, {
        ...rutaData,
        saldoInicial: rutaData.saldoInicial + clienteData.valorPrestamo,
        movimientos: [
          {
            monto: clienteData.valorPrestamo,
            fecha: new Date(),
            responsable: "Admin",
            descripcion: "Cliente eliminado",
          },
          ...rutaData.movimientos,
        ],
      });
    }

    try {
      // Eliminar cliente de Firebase
      await deleteDoc(clienteRef);

      // Eliminar cliente  localmente
      const updatedClienteData = clientes.filter(
        (cliente) => cliente.uid !== selectedCliente.uid
      );
      setClientes(updatedClienteData);

      setRutasData((prevRutas) =>
        prevRutas.map((ruta) =>
          ruta.uid === rutaData.uid
            ? {
                ...ruta,
                saldoInicial: rutaData.saldoInicial + clienteData.valorPrestamo,
                movimientos: [
                  {
                    monto: clienteData.valorPrestamo,
                    fecha: new Date(),
                    responsable: "Admin",
                    descripcion: "Cliente eliminado",
                  },
                  ...ruta.movimientos,
                ],
              }
            : ruta
        )
      );

      // Cerrar el modal
      setIsModalDelete(false);
      setIsDeleting(false);
      toast.success("Cliente Eliminado con exito");
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  return (
    <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto text-sm">
        <div className="absolute right-2 top-2 cursor-pointer bg-white rounded-[50%] p-[1px]">
          <IoIosClose size={40} onClick={() => setIsModalDelete(false)} />
        </div>

        <p className="text-center font-semibold text-base mt-8 text-red-600">
          Al eliminar este cliente perdera todos los datos relacionados con el
          mismo.
        </p>
        <p className="text-center font-semibold text-lg">
          Esta seguro que desea eliminar al Cliente{" "}
          {selectedCliente.nombreCliente}?
        </p>

        <div className="flex w-full justify-between mt-2">
          <button
            type="button"
            className="bg-red-500 text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={deleteCliente}
            disabled={isDeleting}
          >
            {isDeleting ? <MoonLoader size={20} color="#ffffff" /> : "Eliminar"}
          </button>

          <button
            type="button"
            className="bg-gray-500 text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => setIsModalDelete(false)}
            disabled={isDeleting}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
