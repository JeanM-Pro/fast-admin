import React, { useContext } from "react";
import { miContexto } from "../context/AppContext";

export const TablaHistorial = ({ datos }) => {
  const { historialPagos } = datos;

  const { formatDate } = useContext(miContexto);

  return (
    <>
      <h2 className="text-lg text-center font-semibold">Historial de Pagos</h2>
      <table className="min-w-full mt-4 bg-white">
        <thead>
          <tr className="bg-[#8131bd] text-white ">
            <th className="border border-black w-[8%] px-2 py-1">#</th>
            <th className="border border-black w-[46%] px-2 py-1">Cantidad</th>
            <th className="border border-black w-[46%] px-2 py-1">fecha</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(historialPagos) && historialPagos.length > 0 ? (
            historialPagos.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"
                } border border-black font-semibold`}
              >
                <td className="border border-black text-center px-2 py-1">
                  {index + 1}
                </td>
                <td className="border border-black text-center px-2 py-1">
                  ${item.abono}
                </td>
                <td className="items-center border-black flex justify-center px-1 py-1">
                  {formatDate(item.fecha)}
                </td>

                {/* <td className="border border-black w-10 text-center px-2 py-1">
                <AiOutlineEdit
                  onClick={() => handleEditClick(item)}
                  className="cursor-pointer my-0 mx-auto"
                />
              </td>
              <td className="border border-black w-10  px-2 py-1">
                <AiOutlineDelete
                  className="cursor-pointer my-0 mx-auto"
                  onClick={() => handleDeleteClick(item)}
                />
              </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="border border-black">
                No hay datos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};
