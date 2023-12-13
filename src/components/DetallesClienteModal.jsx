import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { FotoDeTiendaModal } from "./FotoDeTiendaModal";

export const DetallesClienteModal = ({
  setVerDetallesCliente,
  selectedDetallesCliente,
}) => {
  const [verFotoDeTienda, setVerFotoDeTienda] = useState(false);

  const ubicacion = {
    latitud: 0,
    longitud: 0,
  };

  const [latitudStr, longitudStr] =
    selectedDetallesCliente.ubicacion.split(", ");
  ubicacion.latitud = parseFloat(latitudStr);
  ubicacion.longitud = parseFloat(longitudStr);

  const totalCuotas = selectedDetallesCliente.cuotasPactadas;
  const cuotaDiaria = selectedDetallesCliente.pagoDiario;

  const creditoTotal = cuotaDiaria * totalCuotas;

  const deudaActual = creditoTotal - selectedDetallesCliente.totalAbono;

  return (
    <>
      {verFotoDeTienda ? (
        <FotoDeTiendaModal
          setVerFotoDeTienda={setVerFotoDeTienda}
          imagen={selectedDetallesCliente.imageTienda}
        />
      ) : null}
      <div className="w-full min-h-screen h-screen z-10 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
        <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto text-sm">
          <div className="absolute right-2 top-2 cursor-pointer bg-white rounded-[50%] p-[1px]">
            <IoIosClose
              size={40}
              onClick={() => setVerDetallesCliente(false)}
            />
          </div>

          <img
            src={selectedDetallesCliente.imageUrl}
            alt="imagen de perfil"
            className="w-full h-auto"
          />

          <p className="uppercase font-semibold mt-1">
            Cliente:{" "}
            <span className="font-bold">
              {selectedDetallesCliente.nombreCliente}
            </span>
          </p>

          <p className="uppercase font-semibold">
            CPF:{" "}
            <span className="font-bold">{selectedDetallesCliente.cpf}</span>
          </p>

          <p className="uppercase font-semibold">
            tlf:{" "}
            <span className="font-bold">
              {selectedDetallesCliente.telefono}
            </span>
          </p>

          <p className="uppercase font-semibold break-all text-sm">
            direccion:{" "}
            <span className="font-bold">
              {selectedDetallesCliente.direccion}
            </span>
          </p>

          <p className="uppercase font-semibold break-all">
            direccion de cobro:{" "}
            <span className="font-bold">
              {selectedDetallesCliente.direccionCobro}
            </span>
          </p>

          <p className="uppercase font-semibold mt-1">
            Descripcion:{" "}
            <span className="font-bold">
              {selectedDetallesCliente.descripcion}
            </span>
          </p>

          <p className="uppercase font-semibold mt-1">
            Ver foto de tienda{" "}
            <span
              className="text-[#8131bd] font-semibold cursor-pointer"
              onClick={() => setVerFotoDeTienda(true)}
            >
              ver
            </span>
          </p>

          <p className="uppercase font-semibold break-all">
            ubicacion:{" "}
            <a
              href={`https://www.google.com/maps?q=${ubicacion?.latitud},${ubicacion?.longitud}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8131bd] font-semibold"
            >
              Ver en Google Maps
            </a>
          </p>

          <table className="w-full mt-2 flex">
            <thead className="w-[50%]">
              <tr className="bg-[#aa7acf] uppercase text-xs flex flex-col border border-black">
                <th className=" w-full border-b border-black px-2 py-1 ">
                  Fecha Inicial
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  fecha final
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  forma de pago
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  valor del prestamo
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  % interes
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  deuda total
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  cuota diaria
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  abono hoy
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  valor pico
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  abono total
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  total cuotas
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  cuotas pagadas
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  cuotas restantes
                </th>
                <th className=" w-full border-b border-black px-2 py-1">
                  cuotas atrasadas
                </th>
                <th className="w-full border-b border-black px-2 py-1">
                  debe a la fecha
                </th>
                <th className=" w-full px-2 py-1">deuda restante</th>
              </tr>
            </thead>
            <tbody className="w-[50%]">
              <tr className=" uppercase text-xs flex flex-col border-y border-r border-black">
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {selectedDetallesCliente.fechaActual}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {selectedDetallesCliente.fechaFinal}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {selectedDetallesCliente.formaDePago}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {`$${selectedDetallesCliente.valorPrestamo}`}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {`${selectedDetallesCliente.porcentajeInteres}%`}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {`$${creditoTotal}`}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {`$${selectedDetallesCliente.pagoDiario}`}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {`$${selectedDetallesCliente.abono}`}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {`$${selectedDetallesCliente.valorPico}`}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {`$${selectedDetallesCliente.totalAbono}`}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {selectedDetallesCliente.cuotasPactadas}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {selectedDetallesCliente.cuotasPagadas}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {selectedDetallesCliente.cuotasPactadas -
                    selectedDetallesCliente.cuotasPagadas}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  falta agregar
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  falta agregar
                </td>
                <td className="w-full px-2 py-1 text-center font-bold">
                  {`$${deudaActual}`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
