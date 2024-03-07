import React from "react";
import { IoIosClose } from "react-icons/io";

export const ModalPreguntaRenovacion = ({
  setIsModalPreguntaRenovacion,
  setIsModalCreateClienteExistente,
}) => {
  const renovarPrestamo = () => {
    setIsModalPreguntaRenovacion(false);
    setIsModalCreateClienteExistente(true);
  };

  return (
    <div className="w-full min-h-screen h-screen z-10 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative flex flex-col items-center max-h-[90%] overflow-y-auto">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setIsModalPreguntaRenovacion(false)}
        />
        <h2 className="text-center text-xl font-semibold">
          Renovación de préstamo
        </h2>
        <p>Este cliente completó el pago de la deuda total.</p>
        <p className="font-semibold">Desea renovar el préstamo?</p>

        <div className="flex w-full justify-between mt-2">
          <button
            type="button"
            className="bg-[#8131bd] text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={renovarPrestamo}
          >
            Renovar
          </button>

          <button
            type="button"
            className="bg-gray-500 text-lg font-semibold mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => setIsModalPreguntaRenovacion(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
