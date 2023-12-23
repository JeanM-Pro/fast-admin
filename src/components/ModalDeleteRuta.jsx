import React, { useContext, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { miContexto } from "../context/AppContext";
import { getFirestore, deleteDoc, doc } from "firebase/firestore";
import { TbRulerMeasure } from "react-icons/tb";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";

export const ModalDeleteRuta = ({ setShowModalDelete, selectedRuta }) => {
  const { rutasData, setRutasData, userData } = useContext(miContexto);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteRuta = async () => {
    setIsDeleting(TbRulerMeasure);
    const db = getFirestore();
    const rutaRef = doc(
      db,
      "admin_users",
      userData.uid,
      "rutas",
      selectedRuta.uid
    );

    try {
      // Eliminar la ruta de Firebase
      await deleteDoc(rutaRef);

      // Eliminar la ruta localmente
      const updatedRutasData = rutasData.filter(
        (ruta) => ruta.uid !== selectedRuta.uid
      );
      setRutasData(updatedRutasData);

      // Cerrar el modal
      setShowModalDelete(false);
      setIsDeleting(false);
      toast.success("Ruta Eliminada con exito");

      console.log("Ruta eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar la ruta:", error);
    }
  };

  return (
    <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto text-sm">
        <div className="absolute right-2 top-2 cursor-pointer bg-white rounded-[50%] p-[1px]">
          <IoIosClose size={40} onClick={() => setShowModalDelete(false)} />
        </div>

        <p className="text-center font-semibold text-base mt-8 text-red-600">
          Al eliminar esta ruta perdera todos los datos guardados en ella.
        </p>
        <p className="text-center font-semibold text-lg">
          Esta seguro que desea eliminar la ruta {selectedRuta.nombreRuta}?
        </p>

        <div className="flex w-full justify-between mt-2">
          <button
            type="button"
            className="bg-red-500 text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={deleteRuta}
            disabled={isDeleting}
          >
            {isDeleting ? <MoonLoader size={20} color="#ffffff" /> : "Eliminar"}
          </button>

          <button
            type="button"
            className="bg-gray-500 text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => setShowModalDelete(false)}
            disabled={isDeleting}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
