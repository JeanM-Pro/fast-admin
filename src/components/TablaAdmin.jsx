import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

export const Tabla = ({ datos }) => {
  const handleEditClick = (admin) => {
    console.log("editar", admin);
  };

  const handleDeleteClick = (admin) => {
    console.log("eliminar", admin);
  };

  return (
    <>
      <table className="min-w-full mt-8 bg-white">
        <thead>
          <tr className="bg-red-100">
            <th className="border border-black w-6 px-2 py-1">#</th>
            <th className="border border-black w-10 px-2 py-1">email</th>
            <th className="border border-black w-10 px-2 py-1">uid</th>
            <th className="border border-black w-10 px-2 py-1">Editar</th>
            <th className="border border-black w-10 px-2 py-1">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(datos) && datos.length > 0 ? (
            datos.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"
                } border border-black`}
              >
                <td className="border border-black text-center px-2 py-1">
                  {index + 1}
                </td>
                <td className="items-center border-black flex justify-center px-1 py-1">
                  {item.email}
                </td>
                <td className="border border-black px-2 w-10 text-center py-1">
                  {item.uid}
                </td>

                <td className="border border-black w-10 text-center px-2 py-1">
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
