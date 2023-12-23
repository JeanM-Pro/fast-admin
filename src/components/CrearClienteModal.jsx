import React from "react";
import { IoIosClose } from "react-icons/io";

export const CrearClienteModal = ({
  setisModalCreateCliente,
  setisModalCreateClienteNew,
  setIsModalCreateClienteExistente,
}) => {
  const nuevoCliente = () => {
    setisModalCreateClienteNew(true);
    setisModalCreateCliente(false);
  };

  const clienteExistente = () => {
    setIsModalCreateClienteExistente(true);
    setisModalCreateCliente(false);
  };

  return (
    <div className="w-full min-h-screen h-screen z-10 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed ">
      <div className="bg-gray-200 w-[400px] py-4 px-8 rounded-md relative max-h-[90%] overflow-y-auto">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setisModalCreateCliente(false)}
        />

        <h2 className="text-center font-semibold text-lg">Agregar Cliente</h2>
        <div className="w-full flex justify-between mt-5">
          <button
            onClick={nuevoCliente}
            className="bg-[#8131bd] w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
          >
            Cliente Nuevo
          </button>

          <button
            onClick={clienteExistente}
            type="submit"
            className="bg-[#8131bd] w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
          >
            Cliente Existente
          </button>
        </div>
      </div>
    </div>
  );
};
