import { collection, getDocs, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { VerTablaClientesModal } from "./VerTablaClientesModal";
import { GastosDiariosModal } from "./GastosDiariosModal";
import { EstadisticasModal } from "./EstadisticasModal";

export const VerDetallesRutasModal = ({
  selectedRuta,
  setVerDetalles,
  setSelectedRuta,
}) => {
  const [clientes, setClientes] = useState(null);
  const [verClientes, setVerClientes] = useState(false);
  const [verGastos, setVerGastos] = useState(false);
  const [verEstadisticas, setVerEstadisticas] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        if (selectedRuta) {
          const querySnapshot = await getDocs(
            collection(
              db,
              "admin_users",
              selectedRuta.adminUid,
              "rutas",
              selectedRuta.uid,
              "clientes"
            )
          );
          const data = querySnapshot.docs.map((doc) => {
            const uid = doc.id;
            const clienteData = doc.data();
            return { uid, ...clienteData };
          });
          setClientes(data);
        }
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, [selectedRuta]);

  return (
    <>
      {verClientes ? (
        <VerTablaClientesModal
          clientes={clientes}
          selectedRuta={selectedRuta}
          setVerClientes={setVerClientes}
          setSelectedRuta={setSelectedRuta}
        />
      ) : null}

      {verGastos ? (
        <GastosDiariosModal
          setVerGastos={setVerGastos}
          selectedRuta={selectedRuta}
        />
      ) : null}

      {verEstadisticas ? (
        <EstadisticasModal
          selectedRuta={selectedRuta}
          setVerEstadisticas={setVerEstadisticas}
          clientes={clientes}
        />
      ) : null}

      <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
        <div className="bg-gray-200 w-[400px] md:w-full p-4 md:h-full rounded-md relative max-h-[90%] overflow-y-auto">
          <div className="absolute right-2 top-2 cursor-pointer bg-white rounded-[50%] p-[1px]">
            <IoIosClose size={40} onClick={() => setVerDetalles(false)} />
          </div>

          <h2 className="text-center font-bold text-lg">{`Detalles Ruta ${selectedRuta.nombreRuta}`}</h2>

          <button
            type="button"
            className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => setVerClientes(true)}
          >
            Ver Clientes
          </button>

          <button
            type="button"
            className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => setVerGastos(true)}
          >
            Ver Gastos Diarios
          </button>

          <button
            type="button"
            className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={() => setVerEstadisticas(true)}
          >
            Ver Estadisticas
          </button>
        </div>
      </div>
    </>
  );
};
