import React from "react";

export const TablaMovimientos = ({ usuarioRuta, formatDate }) => {
  const movimientos = usuarioRuta?.movimientos;

  return (
    <>
      <table className="min-w-full mt-2 bg-white">
        <thead>
          <tr className="bg-[#8131bd] text-white uppercase text-sm">
            <th className="border border-black w-[8%] px-2 py-1">#</th>
            <th className="border border-black w-[46%] px-2 py-1">Monto</th>
            <th className="border border-black w-[46%] px-2 py-1">Fecha</th>
            <th className="border border-black w-[46%] px-2 py-1">Motivo</th>
            <th className="border border-black w-[46%] px-2 py-1">Usuario</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(movimientos) && movimientos.length > 0 ? (
            movimientos.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"
                } border border-black font-semibold uppercase text-sm`}
              >
                <td className="border border-black text-center px-2 py-1">
                  {index + 1}
                </td>
                <td className="border border-black text-center px-2 py-1">
                  ${item.monto}
                </td>
                <td className="items-center whitespace-nowrap border-black flex justify-center px-1 py-1">
                  {formatDate(item.fecha)}
                </td>
                <td className="border border-black text-center px-2 py-1">
                  {item.descripcion}
                </td>
                <td className="border border-black text-center px-2 py-1 whitespace-nowrap">
                  {item.responsable}
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
