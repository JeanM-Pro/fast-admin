import { IoIosClose } from "react-icons/io";

export const ModalNoAutorizado = ({ setVerModalNoautorizado }) => {
  return (
    <div className="w-full min-h-screen h-screen z-10 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative flex flex-col items-center max-h-[90%] overflow-y-auto">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setVerModalNoautorizado(false)}
        />
        <h2 className="text-center text-xl font-semibold">
          Cambiar Contraseña
        </h2>
        <p className="text-red-600 font-semibold text-center">
          No tienes autorizacion del administrador
        </p>
        <p className="text-center">
          Para cambiar la contraseña de la ruta necesitas la autorizacion de tu
          administrador
        </p>
      </div>
    </div>
  );
};
