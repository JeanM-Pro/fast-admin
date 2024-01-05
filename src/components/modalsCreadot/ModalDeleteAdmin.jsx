import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";

export const ModalDeleteAdmin = ({
  setModalDelete,
  selectedAdmin,
  datos,
  setUsersAdminData,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAdmin = async () => {
    setIsDeleting(true);
    const db = getFirestore();
    const adminRef = doc(db, "admin_users", selectedAdmin.uid);
    try {
      // Eliminar la ruta de Firebase
      await deleteDoc(adminRef);

      // Eliminar la ruta localmente
      const updatedAdminsData = datos.filter(
        (admin) => admin.uid !== selectedAdmin.uid
      );
      setUsersAdminData(updatedAdminsData);

      // Cerrar el modal
      setModalDelete(false);
      setIsDeleting(false);
      toast.success("Administrador eliminado con exito");

      console.log("Ruta eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar administrador:", error);
    }
  };
  return (
    <>
      <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
        <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto text-sm">
          <IoIosClose
            className="absolute right-0 top-0 cursor-pointer"
            size={40}
            onClick={() => setModalDelete(false)}
          />

          <p className="text-center font-semibold text-base mt-8 text-red-600">
            Al eliminar este Administrador perdera todos los datos guardados en
            el.
          </p>
          <p className="text-center font-semibold text-lg">
            Esta seguro que desea eliminar el Administrador{" "}
            <span className="uppercase">{selectedAdmin.nombre}</span>?
          </p>
          <div className="flex w-full justify-between mt-2">
            <button
              type="button"
              className="bg-red-500 text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
              onClick={deleteAdmin}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <MoonLoader size={20} color="#ffffff" />
              ) : (
                "Eliminar"
              )}
            </button>

            <button
              type="button"
              className="bg-gray-500 text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
              onClick={() => setModalDelete(false)}
              disabled={isDeleting}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
