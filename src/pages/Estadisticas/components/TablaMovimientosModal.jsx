import React from "react";
import { TablaMovimientos } from "./TablaMovimientos";
import { IoIosClose } from "react-icons/io";

export const TablaMovimientosModal = ({
  formatDate,
  usuarioRuta,
  setMostrarMovimientos,
}) => {
  return (
    <div className="w-full min-h-screen h-screen z-10 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed ">
      <div className="bg-gray-200 w-[400px] md:w-full py-4 px-1 rounded-md relative max-h-[90%] overflow-y-auto">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setMostrarMovimientos(false)}
        />
        <span className="font-bold text-lg ml-2">Movimientos</span>
        <div className="w-full overflow-x-auto py-2">
          <TablaMovimientos formatDate={formatDate} usuarioRuta={usuarioRuta} />
        </div>
      </div>
    </div>
  );
};
