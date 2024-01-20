import React from "react";
import { IoIosClose } from "react-icons/io";

export const ModalRutasNoDisponibles = ({ setIsModalRutasNoDisponibles }) => {
  return (
    <div className="w-full min-h-screen z-10 bg-black bg-opacity-50 pt-16 px-2 md:px-8 flex justify-center items-center fixed ">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setIsModalRutasNoDisponibles(false)}
        />
        <h2 className="text-center text-xl font-semibold text-red-600">
          No tienes rutas disponibles
        </h2>
        <p className="text-center">
          Has alcanzado el número máximo de rutas que puedes crear. Si desea
          agregar mas rutas, comuníquese con su proveedor.
        </p>
      </div>
    </div>
  );
};
