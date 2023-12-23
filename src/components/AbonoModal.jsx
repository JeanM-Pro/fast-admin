import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { MoonLoader } from "react-spinners";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";

export const AbonoModal = ({
  setIsAbono,
  selectedAbono,
  usuarioRuta,
  setUsuarioRuta,
  setSelectedAbono,
}) => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [abono, setAbono] = useState(0);

  const handleAbonar = async () => {
    try {
      setIsSubmiting(true);

      const db = getFirestore();

      // Obtén la referencia del documento
      const clienteRef = doc(
        db,
        "admin_users",
        usuarioRuta.adminUid,
        "rutas",
        usuarioRuta.uid,
        "clientes",
        selectedAbono.uid
      );

      // Obtiene los datos actuales del cliente
      const docSnapshot = await getDoc(clienteRef);
      const clienteData = docSnapshot.data();

      const fechaDeAbono = new Date();
      const fechaFormateada = fechaDeAbono.toDateString();

      //Calcular las cuotas y el valor pico

      const totalAbono = selectedAbono.valorPico + abono;
      const vecesSuperado = Math.floor(totalAbono / selectedAbono.pagoDiario);
      const sobrante = totalAbono % selectedAbono.pagoDiario;

      // Calcular cuotas a restar, asegurándote de que no sea un número negativo
      const cuotasAtrasadasToSubtract = Math.max(
        0,
        selectedAbono.cuotasAtrasadas - vecesSuperado
      );

      // Restar prestamo al saldo disponible en firebase

      const rutaRef = doc(
        db,
        "admin_users",
        usuarioRuta.adminUid,
        "rutas",
        usuarioRuta.uid
      );

      const rutaSnapshot = await getDoc(rutaRef);
      const rutaData = rutaSnapshot.data();

      const saldoViejoNum = parseInt(usuarioRuta.saldoInicial);
      const saldoNuevo = saldoViejoNum + abono;

      await updateDoc(rutaRef, {
        ...rutaData,
        saldoInicial: saldoNuevo,
      });

      // Restar prestamo al saldo disponible localmente

      setUsuarioRuta({ ...usuarioRuta, saldoInicial: saldoNuevo });

      const nuevoHistorial = {
        abono: abono,
        fecha: new Date(),
      };

      // Actualiza los datos en el documento manteniendo los datos originales no editados
      await updateDoc(clienteRef, {
        ...clienteData,
        abono: abono,
        cuotasPagadas: selectedAbono.cuotasPagadas + vecesSuperado,
        fechaUltimoAbono: fechaFormateada,
        valorPico: sobrante,
        totalAbono: selectedAbono.totalAbono + abono,
        cuotasAtrasadas: cuotasAtrasadasToSubtract,
        historialPagos: [...clienteData.historialPagos, nuevoHistorial],
      });
      setSelectedAbono({
        ...selectedAbono,
        abono: abono,
        cuotasPagadas: selectedAbono.cuotasPagadas + vecesSuperado,
        fechaUltimoAbono: fechaFormateada,
        valorPico: sobrante,
        totalAbono: selectedAbono.totalAbono + abono,
        cuotasAtrasadas: cuotasAtrasadasToSubtract,
        historialPagos: [...clienteData.historialPagos, nuevoHistorial],
      });
      setIsAbono(false);
    } catch (error) {
      console.error("Error updating data in Firebase:", error);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className="w-full min-h-screen h-screen z-10 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative flex flex-col items-center max-h-[90%] overflow-y-auto">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setIsAbono(false)}
        />
        <h2 className="text-center text-xl font-semibold">
          Ingresar abono diario
        </h2>
        <div className="flex w-full h-[40px] border border-gray-400 rounded-md mt-2">
          <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
            Abonar $
          </div>
          <input
            type="number"
            className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
            onChange={(e) => setAbono(parseInt(e.target.value))}
          />
        </div>
        <button
          className="bg-[#8131bd] w-fit mt-4 text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
          disabled={isSubmiting}
          onClick={handleAbonar}
        >
          {isSubmiting ? <MoonLoader size={20} color="#ffffff" /> : "Abonar"}
        </button>
      </div>
    </div>
  );
};
