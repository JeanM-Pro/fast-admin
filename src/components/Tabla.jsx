import { useContext, useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { ModalEditAdmin } from "./modalsCreadot/ModalEditAdmin";
import { ModalDeleteAdmin } from "./modalsCreadot/ModalDeleteAdmin";
import { miContexto } from "../context/AppContext";
import { ModalActualizarPago } from "./ModalActualizarPago";

export const Tabla = ({ datos, setUsersAdminData }) => {
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const { formatDate2 } = useContext(miContexto);
  const [isActualizarPago, setIsActualizarPago] = useState(false);

  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setModalEdit(true);
  };

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setModalDelete(true);
  };

  const handleActualizarPago = (admin) => {
    setSelectedAdmin(admin);
    setIsActualizarPago(true);
  };

  return (
    <>
      {isActualizarPago ? (
        <ModalActualizarPago
          setIsActualizarPago={setIsActualizarPago}
          selectedAdmin={selectedAdmin}
        />
      ) : null}

      {modalEdit ? (
        <ModalEditAdmin
          setModalEdit={setModalEdit}
          selectedAdmin={selectedAdmin}
          datos={datos}
          setUsersAdminData={setUsersAdminData}
        />
      ) : null}

      {modalDelete ? (
        <ModalDeleteAdmin
          setModalDelete={setModalDelete}
          selectedAdmin={selectedAdmin}
          datos={datos}
          setUsersAdminData={setUsersAdminData}
        />
      ) : null}

      <table className="min-w-full mt-8 bg-white">
        <thead>
          <tr className="bg-[#8131bd] text-white text-sm">
            <th className="border border-black w-6 px-2 py-1">#</th>
            <th className="border border-black min-w-fit px-2 py-1 uppercase">
              email
            </th>
            <th className="border border-black min-w-fit px-2 py-1 uppercase">
              nombre
            </th>
            <th className="border border-black min-w-fit px-2 py-1 uppercase">
              rutas
            </th>
            <th className="border border-black min-w-fit px-2 py-1 uppercase whitespace-nowrap">
              ult. pago
            </th>
            <th className="border border-black min-w-fit px-2 py-1 uppercase whitespace-nowrap">
              prox. pago
            </th>

            <th className="border border-black min-w-fit px-2 py-1 uppercase whitespace-nowrap">
              actlzr. pago
            </th>

            <th className="border border-black w-10 px-2 py-1 uppercase">
              Editar
            </th>
            <th className="border border-black w-10 px-2 py-1 uppercase">
              Eliminar
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(datos) && datos.length > 0 ? (
            datos.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"
                } border border-black text-sm`}
              >
                <td className="border border-black text-center px-2 py-1">
                  {index + 1}
                </td>

                <td className="items-center border-black flex justify-center px-1 py-1">
                  {item.email}
                </td>

                <td className="border-black border text-center uppercase px-1 py-1 whitespace-nowrap">
                  {item.nombre}
                </td>

                <td className="border-black border text-center uppercase px-1 py-1">
                  {item.cantidadRutas}
                </td>

                <td className="border-black border text-center uppercase px-1 py-1">
                  {formatDate2(item.ultimoPago)}
                </td>

                <td className="border-black border text-center uppercase px-1 py-1">
                  {formatDate2(item.proximoPago)}
                </td>

                <td
                  onClick={() => handleActualizarPago(item)}
                  className="border-black border text-center uppercase px-1 py-1 underline cursor-pointer"
                >
                  Actualizar
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
