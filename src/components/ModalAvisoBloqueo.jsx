import { ImBlocked } from "react-icons/im";

export const ModalAvisoBloqueo = ({ userData, usuarioRuta }) => {
  return (
    <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto text-sm">
        <ImBlocked className="mx-auto text-red-800" size={120} />
        <h2 className="text-center text-red-600 text-3xl font-semibold">
          CUENTA BLOQUEADA
        </h2>

        {userData && (
          <>
            <p className="text-center font-semibold text-base">
              Se ha acabado el tiempo limite para hacer el pago.
            </p>
            <p className="text-center font-semibold text-base">
              Comuniquese con su proveedor para reactivar su cuenta.
            </p>
          </>
        )}

        {usuarioRuta && (
          <>
            <p className="text-center font-semibold text-base">
              Por razones de pago se ha bloqueado su cuenta.
            </p>
            <p className="text-center font-semibold text-base">
              Comuniquese con su administrador para hacer la reactivacion.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
