import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
import { MdOutlineNumbers } from "react-icons/md";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";

export const ModalEditAdmin = ({
  setModalEdit,
  selectedAdmin,
  datos,
  setUsersAdminData,
}) => {
  const [email, setEmail] = useState(selectedAdmin.email);
  const [nombre, setNombre] = useState(selectedAdmin.nombre);
  const [rutas, setRutas] = useState(selectedAdmin.cantidadRutas);
  const [isEditing, setIsEditing] = useState(false);

  const editarAdmin = async () => {
    setIsEditing(true);
    try {
      const db = getFirestore();
      const adminRef = doc(db, "admin_users", selectedAdmin.uid);
      const adminSnapshot = await getDoc(adminRef);
      const adminData = adminSnapshot.data();

      await updateDoc(adminRef, {
        ...adminData,
        email: email,
        nombre: nombre,
        cantidadRutas: rutas,
      });

      const updateAdminsData = datos.map((admin) =>
        admin.uid === selectedAdmin.uid
          ? { ...admin, email, nombre, cantidadRutas: rutas }
          : admin
      );

      setUsersAdminData(updateAdminsData);
      setModalEdit(false);
      setIsEditing(false);
      toast.success("Admin editado con exito");
    } catch (error) {
      console.log("Error al editar admin", error);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
        <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto text-sm">
          <IoIosClose
            className="absolute right-0 top-0 cursor-pointer"
            size={40}
            onClick={() => setModalEdit(false)}
          />

          <h2 className="text-center text-xl font-semibold">
            Editar Administrador
          </h2>
          <div className="w-full flex flex-col gap-2 mt-2 items-center">
            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                <AiOutlineUser size={24} />
              </div>
              <input
                type="text"
                className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                placeholder="Usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                <AiOutlineUser size={24} />
              </div>
              <input
                type="text"
                className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                <MdOutlineNumbers size={24} />
              </div>
              <input
                type="number"
                className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                placeholder="Numero de Rutas"
                value={rutas}
                onChange={(e) => setRutas(e.target.value)}
                required
              />
            </div>

            <div className="flex w-full justify-between">
              <button
                type="button"
                className="bg-[#8131bd] w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
                onClick={editarAdmin}
                disabled={isEditing}
              >
                {isEditing ? (
                  <MoonLoader size={20} color="#ffffff" />
                ) : (
                  "Editar"
                )}
              </button>

              <button
                type="button"
                className="bg-gray-500 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
                onClick={() => setModalEdit(false)}
                disabled={isEditing}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
