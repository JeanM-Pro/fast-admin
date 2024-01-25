import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { FotoDeTiendaModal } from "./FotoDeTiendaModal";
import { CartonDigitalModal } from "./CartonDigitalModal";
import { HistorialDePagosModal } from "./HistorialDePagosModal";

export const DetallesClienteModal = ({
  setVerDetallesCliente,
  selectedDetallesCliente,
}) => {
  const [verFotoDeTienda, setVerFotoDeTienda] = useState(false);
  const [mostrarCartonDigital, setMostrarCartonDigital] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
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

  const dataTablaHeader = [
    { titulo: "Fecha Inicial" },
    { titulo: "fecha final" },
    { titulo: "forma de pago" },
    { titulo: "valor del prestamo" },
    { titulo: "% interes" },
    { titulo: "deuda total" },
    { titulo: "cuota diaria" },
    { titulo: "abono hoy" },
    { titulo: "valor pico" },
    { titulo: "abono total" },
    { titulo: "total cuotas" },
    { titulo: "cuotas pagadas" },
    { titulo: "cuotas restantes" },
    { titulo: "cuotas atrasadas" },
    { titulo: "debe a la fecha" },
    { titulo: "deuda restante" },
  ];

  const valorPico =
    selectedDetallesCliente.totalAbono % selectedDetallesCliente.pagoDiario;

  const cuotasPagadas = Math.floor(
    selectedDetallesCliente.totalAbono / selectedDetallesCliente.pagoDiario
  );

  const cuotasRestantes = totalCuotas - cuotasPagadas;

  return (
    <>
      {mostrarCartonDigital ? (
        <CartonDigitalModal
          setMostrarCartonDigital={setMostrarCartonDigital}
          datos={selectedDetallesCliente}
        />
      ) : null}

      {mostrarHistorial ? (
        <HistorialDePagosModal
          setMostrarHistorial={setMostrarHistorial}
          datos={selectedDetallesCliente}
        />
      ) : null}

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

          {selectedDetallesCliente.imageUrl ? (
            <img
              src={selectedDetallesCliente.imageUrl}
              alt="imagen de perfil"
              className="w-full h-auto"
            />
          ) : (
            <span className="text-red-600"> No se cargó foto de perfil </span>
          )}

          <p className="uppercase font-semibold mt-1">
            Cliente:{" "}
            <span className="font-bold">
              {selectedDetallesCliente.nombreCliente
                ? selectedDetallesCliente.nombreCliente
                : "Sin datos"}
            </span>
          </p>

          <p className="uppercase font-semibold">
            CPF:{" "}
            <span className="font-bold">
              {selectedDetallesCliente.cpf
                ? selectedDetallesCliente.cpf
                : "Sin datos"}
            </span>
          </p>

          <p className="uppercase font-semibold">
            tlf:{" "}
            <span className="font-bold">
              {selectedDetallesCliente.telefono
                ? selectedDetallesCliente.telefono
                : "Sin datos"}
            </span>
          </p>

          <p className="uppercase font-semibold text-sm whitespace-pre-line">
            direccion:{" "}
            <span className="font-bold">
              {selectedDetallesCliente.direccion
                ? selectedDetallesCliente.direccion
                : "Sin datos"}
            </span>
          </p>

          <p className="uppercase font-semibold whitespace-pre-line">
            direccion de cobro:{" "}
            <span className="font-bold">
              {selectedDetallesCliente.direccionCobro
                ? selectedDetallesCliente.direccionCobro
                : "sin datos"}
            </span>
          </p>

          <p className="uppercase font-semibold mt-1 whitespace-pre-line">
            Descripcion:{" "}
            <span className="font-bold">
              {selectedDetallesCliente.descripcion
                ? selectedDetallesCliente.descripcion
                : "sin datos"}
            </span>
          </p>

          <p className="uppercase font-semibold mt-1">
            Ver foto de tienda:{" "}
            {selectedDetallesCliente.imageTienda ? (
              <span
                className="text-[#8131bd] font-semibold cursor-pointer"
                onClick={() => setVerFotoDeTienda(true)}
              >
                ver
              </span>
            ) : (
              <span className="font-bold">sin datos</span>
            )}
          </p>

          <p className="uppercase font-semibold break-all">
            ubicacion:{" "}
            {selectedDetallesCliente.ubicacion !== "" ? (
              <a
                href={`https://www.google.com/maps?q=${ubicacion?.latitud},${ubicacion?.longitud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8131bd] font-semibold"
              >
                Ver en Google Maps
              </a>
            ) : (
              <span className="font-bold">sin datos</span>
            )}
          </p>

          <table className="w-full mt-2 flex">
            <thead className="w-[50%]">
              <tr className="bg-[#aa7acf] uppercase text-xs flex flex-col border border-black">
                {dataTablaHeader.map((item, index) => {
                  return (
                    <th
                      key={index}
                      className={
                        index === dataTablaHeader.length - 1
                          ? " w-full px-2 py-1"
                          : "w-full border-b border-black px-2 py-1"
                      }
                    >
                      {item.titulo}
                    </th>
                  );
                })}
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
                  {`$${valorPico}`}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {`$${selectedDetallesCliente.totalAbono}`}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {totalCuotas}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {cuotasPagadas}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {cuotasRestantes}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {selectedDetallesCliente.cuotasAtrasadas < 0
                    ? 0
                    : selectedDetallesCliente.cuotasAtrasadas}
                </td>
                <td className="w-full border-b border-black px-2 py-1 text-center font-bold">
                  {`$${
                    selectedDetallesCliente.cuotasAtrasadas > 0
                      ? selectedDetallesCliente.pagoDiario *
                          selectedDetallesCliente.cuotasAtrasadas -
                        selectedDetallesCliente.valorPico
                      : 0
                  }`}
                </td>
                <td className="w-full px-2 py-1 text-center font-bold">
                  {`$${deudaActual}`}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex w-full justify-between">
            <button
              type="button"
              className="bg-[#8131bd] mt-4 mx-auto w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
              onClick={() => setMostrarCartonDigital(true)}
            >
              Carton Digital
            </button>

            <button
              type="button"
              className="bg-[#8131bd] mt-4 mx-auto w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
              onClick={() => setMostrarHistorial(true)}
            >
              Historial de Pagos
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
