import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { CiDollar } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { miContexto } from "../context/AppContext";
import { MoonLoader } from "react-spinners";

export const ModalEditRuta = ({ selectedRuta, setShowModalEdit }) => {
  const [responsable, setResponsable] = useState(selectedRuta.responsable);
  const [saldoInicial, setSaldoInicial] = useState(selectedRuta.saldoInicial);
  const [isEditing, setIsEditing] = useState(false);
  const { rutasData, setRutasData, userData } = useContext(miContexto);

  const editarRuta = async () => {
    setIsEditing(true);
    const db = getFirestore();
    const rutaRef = doc(
      db,
      "admin_users",
      userData.uid,
      "rutas",
      selectedRuta.uid
    );

    const rutaSnapshot = await getDoc(rutaRef);
    const rutaData = rutaSnapshot.data();

    await updateDoc(rutaRef, {
      ...rutaData,
      responsable: responsable,
      saldoInicial: saldoInicial,
    });

    const updatedRutasData = rutasData.map((ruta) =>
      ruta.uid === selectedRuta.uid
        ? { ...ruta, responsable, saldoInicial }
        : ruta
    );

    setRutasData(updatedRutasData);
    setShowModalEdit(false);
    setIsEditing(false);
  };

  return (
    <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto text-sm">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setShowModalEdit(false)}
        />

        <h2 className="text-center text-xl font-semibold">Editar Ruta</h2>
        <form className="w-full mt-2">
          <div className="w-full flex flex-col gap-6 items-center">
            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                <AiOutlineUser size={24} />
              </div>
              <input
                type="text"
                className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                placeholder="Nombre del responsable"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                required
              />
            </div>
            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                <CiDollar size={24} />
              </div>
              <input
                type="number"
                className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                placeholder="Saldo Nuevo"
                value={saldoInicial}
                onChange={(e) => setSaldoInicial(e.target.value)}
                required
              />
            </div>
            <div className="mt-2 flex justify-between w-full">
              <button
                type="button"
                className="bg-[#8131bd] text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
                onClick={editarRuta}
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
                className="bg-gray-500 text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
                onClick={() => setShowModalEdit(false)}
                disabled={isEditing}
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
