import React from "react";
import { IoIosClose } from "react-icons/io";

export const CartonDigitalModal = ({ setMostrarCartonDigital, datos }) => {
  const cuadros = Array.from(
    { length: datos.cuotasPactadas },
    (_, index) => index + 1
  );

  const cuotasPagadas = Math.floor(datos.totalAbono / datos.pagoDiario);
  const valorPico = datos.totalAbono % datos.pagoDiario;
  const valorPicoDisplay = valorPico !== 0 ? valorPico : null;

  return (
    <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto text-sm">
        <div className="absolute right-2 top-2 cursor-pointer bg-white rounded-[50%] p-[1px]">
          <IoIosClose
            size={40}
            onClick={() => setMostrarCartonDigital(false)}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center">
            <div className="bg-green-500 w-8 h-8"></div>
            <p className="uppercase text-xs ml-2 font-semibold">
              cuotas pagadas
            </p>
          </div>
          <div className="flex items-center">
            <div className="border border-red-500 w-8 h-8"></div>
            <p className="uppercase text-xs ml-2 font-semibold">
              cuotas faltantes
            </p>
          </div>
          <div className="flex items-center">
            <div className="border bg-yellow-500 w-8 h-8"></div>
            <p className="uppercase text-xs ml-2 font-semibold">Valor pico</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 mt-4">
          {cuadros.map((numero) => (
            <div
              key={numero}
              className={`h-[60px] relative md:h-[70px] w-[100 / 5%] flex flex-col justify-center items-center rounded ${
                numero <= cuotasPagadas
                  ? "bg-green-500 text-white"
                  : "border-red-500 border text-black"
              } ${
                valorPicoDisplay !== null && numero === cuotasPagadas + 1
                  ? "bg-yellow-500 border-none font-semibold"
                  : null
              }`}
            >
              <span className="absolute top-0 left-1 text-[10px]">
                {numero}
              </span>
              {valorPicoDisplay !== null && numero === cuotasPagadas + 1
                ? `$${valorPicoDisplay}`
                : null}
              {numero <= cuotasPagadas ? (
                <p className="uppercase text-xs">Pagado</p>
              ) : null}

              {(valorPicoDisplay !== null && numero === cuotasPagadas + 1) ||
              numero <= cuotasPagadas ? null : (
                <span className="opacity-30 font-semibold">
                  ${datos.pagoDiario}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
