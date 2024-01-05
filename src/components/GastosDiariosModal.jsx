import React from "react";
import { IoIosClose } from "react-icons/io";
import { TablaGastos } from "./TablaGastos";

export const GastosDiariosModal = ({ setVerGastos, selectedRuta }) => {
  return (
    <div className="w-full min-h-screen h-screen z-30 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] md:w-full p-4 md:h-full rounded-md relative max-h-[90%] overflow-y-auto">
        <div className="absolute right-2 top-2 cursor-pointer bg-white rounded-[50%] p-[1px]">
          <IoIosClose size={40} onClick={() => setVerGastos(false)} />
        </div>
        <TablaGastos datos={selectedRuta.historialGastos} />
      </div>
    </div>
  );
};
