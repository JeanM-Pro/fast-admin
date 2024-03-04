import { IoIosClose } from "react-icons/io";
import { TablaClientes } from "./TablaClientes";
import { useState } from "react";

export const VerTablaClientesModal = ({
  clientes,
  selectedRuta,
  setVerClientes,
  setSelectedRuta,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  let sumaPagosDiarios = 0;

  for (let i = 0; i < clientes?.length; i++) {
    sumaPagosDiarios += clientes[i].pagoDiario;
  }
  return (
    <div className="w-full min-h-screen h-screen z-30 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] md:w-full p-4 md:h-full rounded-md relative max-h-[90%] overflow-y-auto">
        <div className="absolute right-2 top-2 cursor-pointer bg-white rounded-[50%] p-[1px]">
          <IoIosClose size={40} onClick={() => setVerClientes(false)} />
        </div>

        <h2 className="font-bold text-lg">
          Clientes de ruta {selectedRuta.nombreRuta}
        </h2>

        <div className="mt-2">
          <div className="flex items-center">
            <div className="w-[20px] h-[20px] bg-red-500 mr-1 border border-black"></div>
            <span>Clientes vencidos</span>
          </div>
          <div className="flex items-center">
            <div className="w-[20px] h-[20px] bg-yellow-500 mr-1 border border-black"></div>
            <span>+7 dias sin pagar</span>
          </div>
          <div className="flex items-center">
            <div className="w-[20px] h-[20px] bg-green-500 mr-1 border border-black"></div>
            <span>+2 dias sin pagar</span>
          </div>
          <div className="flex w-fit items-center mt-3">
            <span className="text-xs md:text-sm mr-1 md:font-semibold font-bold uppercase">
              cuotas por cobrar:
            </span>
            <span className="font-bold ">R${sumaPagosDiarios}</span>
          </div>
        </div>

        <input
          type="text"
          placeholder="Buscar Cliente"
          className=" px-1 py-1 rounded-md shadow-lg mt-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="w-full overflow-x-auto py-2">
          <TablaClientes
            searchTerm={searchTerm}
            datos={clientes}
            usuarioRuta={selectedRuta}
            setUsuarioRuta={setSelectedRuta}
          />
        </div>
      </div>
    </div>
  );
};
