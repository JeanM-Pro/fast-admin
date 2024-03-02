import { useContext, useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { ModalDeleteRuta } from "./ModalDeleteRuta";
import { ModalEditRuta } from "./ModalEditRuta";
import { VerDetallesRutasModal } from "./VerDetallesRutasModal";
import { miContexto } from "../context/AppContext";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { MoonLoader } from "react-spinners";

export const TablaAdministradores = () => {
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [verDetalles, setVerDetalles] = useState(false);
  const [isSubmiting, setisSubmiting] = useState(false);
  const { rutasData } = useContext(miContexto);

  const handleEditClick = (ruta) => {
    setSelectedRuta(ruta);
    setShowModalEdit(true);
  };

  const handleDeleteClick = (ruta) => {
    setSelectedRuta(ruta);
    setShowModalDelete(true);
  };

  const handleVerDetallesClick = (ruta) => {
    setSelectedRuta(ruta);
    setVerDetalles(true);
  };

  const handleRadioChange = async (ruta) => {
    setisSubmiting(true);
    const db = getFirestore();
    try {
      const rutaRef = doc(db, "admin_users", ruta.adminUid, "rutas", ruta.uid);

      const rutaSnapshot = await getDoc(rutaRef);
      const rutaData = rutaSnapshot.data();

      if (rutaData) {
        rutaData.isAutorized = !rutaData.isAutorized;

        // Actualizar el documento en Firebase con el nuevo campo
        await setDoc(rutaRef, rutaData, { merge: true });
      }
      window.location.reload();
      setisSubmiting(false);
    } catch (error) {
      console.log("error al seleccionar ruta", error);
    }
  };

  return (
    <>
      {verDetalles ? (
        <VerDetallesRutasModal
          setVerDetalles={setVerDetalles}
          selectedRuta={selectedRuta}
          setSelectedRuta={setSelectedRuta}
        />
      ) : null}

      {showModalDelete ? (
        <ModalDeleteRuta
          setShowModalDelete={setShowModalDelete}
          selectedRuta={selectedRuta}
        />
      ) : null}

      {showModalEdit ? (
        <ModalEditRuta
          selectedRuta={selectedRuta}
          setShowModalEdit={setShowModalEdit}
        />
      ) : null}

      <table className="min-w-full mt-4 bg-white">
        <thead>
          <tr className="bg-[#8131bd] text-white">
            <th className="border border-black w-6 px-2 py-1">#</th>
            <th className="border border-black w-10 px-2 py-1">Ruta</th>
            <th className="border border-black w-10 px-2 py-1">Responsable</th>
            <th className="border border-black w-10 px-2 py-1 whitespace-nowrap">
              Saldo Actual
            </th>
            <th className="border border-black w-10 px-2 py-1">Editar</th>
            <th className="border border-black w-10 px-2 py-1">Eliminar</th>
            <th className="border border-black w-10 px-2 py-1 whitespace-nowrap">
              Cambiar Senha
            </th>
            <th className="border border-black w-10 px-2 py-1">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rutasData) && rutasData.length > 0 ? (
            rutasData?.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"
                } border border-black`}
              >
                <td className="border border-black text-center px-2 py-1 font-semibold">
                  {index + 1}
                </td>
                <td className="items-center border-black flex justify-center px-1 py-1 font-semibold">
                  {item.nombreRuta}
                </td>
                <td className="border border-black px-2 whitespace-nowrap text-center py-1 uppercase font-semibold">
                  {item.responsable}
                </td>
                <td className="border border-black px-2 whitespace-nowrap text-center py-1 uppercase font-semibold">
                  R${parseInt(item.saldoInicial)}
                </td>

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

                <td className="border border-black w-10  px-2 py-1">
                  {isSubmiting ? (
                    <div className="w-full flex justify-center">
                      <MoonLoader size={16} color="#000" />
                    </div>
                  ) : (
                    <input
                      type="checkbox"
                      checked={item.isAutorized}
                      onChange={() => handleRadioChange(item)}
                      className="my-0 mx-auto w-full"
                    />
                  )}
                </td>

                <td
                  onClick={() => handleVerDetallesClick(item)}
                  className="border cursor-pointer underline border-black px-2 whitespace-nowrap text-center py-1 font-semibold"
                >
                  Ver
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
