import { useState } from "react";
// import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { AbonoModal } from "./AbonoModal";
import { DetallesClienteModal } from "./DetallesClienteModal";

export const TablaClientes = ({ datos, usuarioRuta }) => {
  const [isAbono, setIsAbono] = useState(false);
  const [selectedAbono, setSelectedAbono] = useState(null);
  const [verDetallesCliente, setVerDetallesCliente] = useState(false);
  const [selectedDetallesCliente, setSelectedDetallesCliente] = useState(null);
  const [clientes, setClientes] = useState(datos);

  // const handleEditClick = (admin) => {
  //   if (!usuarioRuta.isAdmin) {
  //     return;
  //   } else {
  //     console.log("editar", admin);
  //   }
  // };

  // const handleDeleteClick = (admin) => {
  //   if (!usuarioRuta.isAdmin) {
  //     return;
  //   } else {
  //     console.log("eliminar", admin);
  //   }
  // };

  const handleAbono = (cliente) => {
    setSelectedAbono(cliente);
    setIsAbono(true);
  };

  const handleDetallesCliente = (cliente) => {
    setSelectedDetallesCliente(cliente);
    setVerDetallesCliente(true);
  };

  return (
    <>
      {isAbono ? (
        <AbonoModal
          setIsAbono={setIsAbono}
          selectedAbono={selectedAbono}
          usuarioRuta={usuarioRuta}
          setSelectedAbono={(updatedAbono) => {
            setSelectedAbono(updatedAbono);
            // Actualiza localmente los datos en la tabla
            setClientes((prevClientes) =>
              prevClientes.map((cliente) =>
                cliente.uid === updatedAbono.uid ? updatedAbono : cliente
              )
            );
          }}
        />
      ) : null}

      {verDetallesCliente ? (
        <DetallesClienteModal
          setVerDetallesCliente={setVerDetallesCliente}
          selectedDetallesCliente={selectedDetallesCliente}
        />
      ) : null}
      <table className="min-w-full mt-2 bg-white">
        <thead>
          <tr className="bg-red-100 uppercase text-sm">
            <th className="border border-black w-6 px-2 py-1">#</th>
            <th className="border border-black min-w-fit px-2 py-1">Cliente</th>
            <th className="border border-black min-w-fit px-2 py-1 whitespace-nowrap">
              abonó hoy
            </th>
            <th className="border border-black w-fit px-2 py-1">cuota</th>
            <th className="border border-black w-fit px-2 py-1">c.pag</th>
            <th className="border border-black w-fit px-2 py-1">c.res</th>
            <th className="border border-black w-fit px-2 py-1">detalles</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(clientes) && clientes.length > 0 ? (
            clientes.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"
                } border border-black text-sm font-semibold`}
              >
                <td className="border border-black text-center px-2 py-1">
                  {index + 1}
                </td>

                <td className="items-center uppercase border-black min-w-max flex justify-center px-1 py-1">
                  {item.nombreCliente}
                </td>

                <td
                  className="border border-black px-2 w-fit text-center py-1"
                  onClick={() => handleAbono(item)}
                >
                  ${item.abono}
                </td>

                <td className="border border-black px-2 w-fit text-center py-1">
                  {`$${item.pagoDiario}`}
                </td>

                <td className="border border-black px-2 w-fit text-center py-1">
                  {item.cuotasPagadas}
                </td>

                <td className="border border-black px-2 w-fit text-center py-1">
                  {item.cuotasPactadas - item.cuotasPagadas}
                </td>

                <td
                  onClick={() => handleDetallesCliente(item)}
                  className="border border-black px-2 w-fit text-center py-1 underline uppercase cursor-pointer"
                >
                  ver
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No hay datos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};
