import { ImArrowUp, ImArrowDown } from "react-icons/im";

export const TablaMovimientos = ({ usuarioRuta, formatDate }) => {
  const movimientos = usuarioRuta?.movimientos;

  const claseColores = (descripcion) => {
    if (
      descripcion === "Abono Editado (suma)" ||
      descripcion === "abono cliente" ||
      descripcion === "Ingreso" ||
      descripcion === "saldo inicial"
    ) {
      return "text-green-700";
    } else {
      return "text-red-600";
    }
  };

  return (
    <>
      <table className="min-w-full mt-2 bg-white">
        <thead>
          <tr className="bg-[#8131bd] text-white uppercase text-sm">
            <th className="whitespace-nowrap border border-black w-[8%] px-2 py-1">
              #
            </th>
            <th className="whitespace-nowrap border border-black w-[46%] px-2 py-1">
              Monto
            </th>
            <th className="whitespace-nowrap border border-black w-[46%] px-2 py-1">
              Fecha
            </th>
            <th className="whitespace-nowrap border border-black w-[46%] px-2 py-1">
              Motivo
            </th>
            <th className="whitespace-nowrap border border-black w-[46%] px-2 py-1">
              Usuario
            </th>
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
                <td className="whitespace-nowrap border border-black text-center px-2 py-1">
                  {index + 1}
                </td>
                <td
                  className={`whitespace-nowrap border border-black text-center px-2 py-1 ${claseColores(
                    item.descripcion
                  )} `}
                >
                  <div className="whitespace-nowrap items-center w-full h-full flex gap-2 mx-auto justify-center">
                    {item.descripcion === "Abono Editado (suma)" ||
                    item.descripcion === "abono cliente" ||
                    item.descripcion === "Ingreso" ||
                    item.descripcion === "saldo inicial" ? (
                      <ImArrowDown />
                    ) : (
                      <ImArrowUp />
                    )}
                    <span>R${item.monto}</span>
                  </div>
                </td>
                <td className="items-center whitespace-nowrap border-black flex justify-center px-1 py-1">
                  {formatDate(item.fecha)}
                </td>
                <td className="border border-black text-center px-2 py-1 whitespace-nowrap">
                  {item.descripcion}
                </td>
                <td className="border border-black text-center px-2 py-1 whitespace-nowrap">
                  {item.responsable}
                </td>
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
