import { IoIosClose, IoIosWarning } from "react-icons/io";

export const ModalAvisoPago = ({ setIsAvisoPago, userData, usuarioRuta }) => {
  return (
    <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto text-sm">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setIsAvisoPago(false)}
        />
        <IoIosWarning className="mx-auto text-red-800" size={120} />
        <h2 className="text-center text-red-600 text-3xl font-semibold">
          AVISO
        </h2>

        {userData && (
          <>
            <p className="text-center font-semibold text-base">
              Hoy se vence la fecha de pago de su cuenta. Recuerde que tiene 3
              dias a partir de hoy para realizar el pago.
            </p>
            <p className="text-center font-semibold text-base">
              En caso de que no pague dentro de 3 dias su cuenta sera bloqueada
              y no podra acceder a su informacion.
            </p>
          </>
        )}

        {usuarioRuta && (
          <>
            <p className="text-center font-semibold text-base">
              Hoy se vence la fecha de pago de su cuenta. Comuniquese con su
              administrador para realizar el pago.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
