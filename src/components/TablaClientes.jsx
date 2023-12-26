import { useContext, useState } from "react";
import { AbonoModal } from "./AbonoModal";
import { DetallesClienteModal } from "./DetallesClienteModal";
import { miContexto } from "../context/AppContext";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

export const TablaClientes = ({ datos, usuarioRuta, setUsuarioRuta }) => {
  const [isAbono, setIsAbono] = useState(false);
  const [selectedAbono, setSelectedAbono] = useState(null);
  const [verDetallesCliente, setVerDetallesCliente] = useState(false);
  const [selectedDetallesCliente, setSelectedDetallesCliente] = useState(null);
  const [clientes, setClientes] = useState(datos);
  const { userData } = useContext(miContexto);
  console.log(userData);

  const handleEditClick = (admin) => {
    if (!usuarioRuta.isAdmin) {
      return;
    } else {
      console.log("editar", admin);
    }
  };

  const handleDeleteClick = (admin) => {
    if (!usuarioRuta.isAdmin) {
      return;
    } else {
      console.log("eliminar", admin);
    }
  };

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
          setUsuarioRuta={setUsuarioRuta}
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
          <tr className="bg-[#8131bd] uppercase text-sm text-white">
            <th className="border border-black w-6 px-2 py-1">#</th>
            <th className="border border-black min-w-fit px-2 py-1">Cliente</th>
            <th className="border border-black min-w-fit px-2 py-1 whitespace-nowrap">
              abonó hoy
            </th>
            <th className="border border-black w-fit px-2 py-1">cuota</th>
            <th className="border border-black w-fit px-2 py-1">c.pag</th>
            <th className="border border-black w-fit px-2 py-1">c.res</th>
            {userData?.isAdmin && (
              <>
                <th className="border border-black w-10 px-2 py-1">Editar</th>
                <th className="border border-black w-10 px-2 py-1">Eliminar</th>
              </>
            )}

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
                } border border-black text-sm font-semibold py-2`}
              >
                <td className="border border-black text-center px-2 py-2">
                  {index + 1}
                </td>

                <td className="items-center uppercase border-black min-w-max flex justify-center px-1 py-2">
                  {item.nombreCliente}
                </td>

                <td
                  className="border border-black px-2 w-fit text-center py-2"
                  onClick={() => handleAbono(item)}
                >
                  ${item.abono}
                </td>

                <td className="border border-black px-2 w-fit text-center py-2">
                  {`$${item.pagoDiario}`}
                </td>

                <td className="border border-black px-2 w-fit text-center py-2">
                  {item.cuotasPagadas}
                </td>

                <td className="border border-black px-2 w-fit text-center py-2">
                  {item.cuotasPactadas - item.cuotasPagadas}
                </td>

                {userData?.isAdmin && (
                  <>
                    <td className="border border-black w-10 text-center px-2 py-1 font-semibold">
                      <AiOutlineEdit
                        onClick={() => handleEditClick(item)}
                        className="cursor-pointer my-0 mx-auto"
                      />
                    </td>

                    <td className="border border-black w-10  px-2 py-1 font-semibold">
                      <AiOutlineDelete
                        className="cursor-pointer my-0 mx-auto"
                        onClick={() => handleDeleteClick(item)}
                      />
                    </td>
                  </>
                )}

                <td
                  onClick={() => handleDetallesCliente(item)}
                  className="border border-black px-2 w-fit text-center py-2 underline uppercase cursor-pointer"
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
