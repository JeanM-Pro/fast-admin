import React from "react";
import { IoIosClose } from "react-icons/io";

export const FotoDeTiendaModal = ({ setVerFotoDeTienda, imagen }) => {
  return (
    <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-90 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[98%] p-1 rounded-md relative max-h-[90%] overflow-y-auto text-sm">
        <div className="absolute right-2 top-2 cursor-pointer bg-white rounded-[50%] p-[1px]">
          <IoIosClose size={40} onClick={() => setVerFotoDeTienda(false)} />
        </div>
        <img src={imagen} alt="imagen de perfil" className="w-full h-auto" />
      </div>
    </div>
  );
};
