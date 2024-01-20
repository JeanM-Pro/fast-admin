import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { MoonLoader } from "react-spinners";
import { miContexto } from "../context/AppContext";
import { toast } from "react-toastify";

export const ModalActualizarPago = ({ setIsActualizarPago, selectedAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { setUsersAdminData } = useContext(miContexto);

  // Crear un nuevo objeto Date a partir de la fecha sumándole un mes
  const proximoPago = new Date();
  proximoPago.setMonth(proximoPago.getMonth() + 1);

  const actualizarPago = async () => {
    setIsEditing(true);

    try {
      const db = getFirestore();
      const adminRef = doc(db, "admin_users", selectedAdmin.uid);
      const adminSnapshot = await getDoc(adminRef);
      const adminData = adminSnapshot.data();

      await updateDoc(adminRef, {
        ...adminData,
        ultimoPago: new Date(),
        proximoPago: proximoPago,
      });
      setUsersAdminData((prevAdmin) =>
        prevAdmin.map((admin) =>
          admin.uid === adminData.uid
            ? { ...admin, ultimoPago: new Date(), proximoPago: proximoPago }
            : admin
        )
      );

      toast.success("Pago Actualizado");
      setIsActualizarPago(false);
      setIsEditing(false);
    } catch (error) {
      console.log("Error al actualizar pago", error);
    }
  };
  return (
    <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto text-sm">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setIsActualizarPago(false)}
        />
        <h2 className="text-center text-xl font-semibold uppercase">
          {selectedAdmin.nombre}
        </h2>
        <h2 className="text-center text-lg font-semibold">Actualizar pago</h2>
        <p className="text-center text-red-600">
          Al hacer Click en OK se actualizara la fecha de ultimo y proximo pago
          desde hoy.
        </p>

        <div className="mt-2 flex justify-between w-full">
          <button
            type="button"
            className="bg-[#8131bd] text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={actualizarPago}
            disabled={isEditing}
          >
            {isEditing ? <MoonLoader size={20} color="#ffffff" /> : "OK"}
          </button>

          <button
            type="button"
            className="bg-gray-500 text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => setIsActualizarPago(false)}
            disabled={isEditing}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
