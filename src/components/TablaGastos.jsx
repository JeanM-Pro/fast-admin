import React, { useContext } from "react";
import { miContexto } from "../context/AppContext";

export const TablaGastos = ({ datos }) => {
  const { formatDate } = useContext(miContexto);

  return (
    <>
      <h2 className="text-lg text-center font-bold mt-4">
        Historial de Gastos
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-[#8131bd] text-white ">
              <th className="border border-black  px-2 py-1">#</th>
              <th className="border border-black  px-2 py-1">Valor</th>
              <th className="border border-black  px-2 py-1">descripcion</th>
              <th className="border border-black  px-2 py-1">fecha</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(datos) && datos.length > 0 ? (
              datos.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"
                  } border border-black font-semibold`}
                >
                  <td className="border text-sm border-black text-center px-2 py-1">
                    {index + 1}
                  </td>
                  <td className="border text-sm border-black text-center px-2 py-1">
                    R${item.valor}
                  </td>
                  <td className="border text-sm whitespace-nowrap border-black text-center px-2 py-1">
                    {item.descripcion}
                  </td>
                  <td className="items-center whitespace-nowrap text-sm border-black flex justify-center px-1 py-1">
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
      </div>
    </>
  );
};
