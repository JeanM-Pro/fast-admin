import { useContext, useState } from "react";
import { Navbar } from "../../components/NavBar";
import { MoonLoader } from "react-spinners";
import { miContexto } from "../../context/AppContext";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { TablaGastos } from "../../components/TablaGastos";

export const GastosDiarios = () => {
  const [valor, setValor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { usuarioRuta, setUsuarioRuta } = useContext(miContexto);

  const agregarGasto = async (e) => {
    e.preventDefault();
    try {
      setIsAdding(true);
      const db = getFirestore();

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
      const saldoNuevo = saldoViejoNum - valor;

      const nuevaData = {
        valor: valor,
        descripcion: descripcion,
        fecha: new Date(),
      };
      const nuevoHistorialGastos = [nuevaData, ...usuarioRuta.historialGastos];

      await updateDoc(rutaRef, {
        ...rutaData,
        saldoInicial: saldoNuevo,
        historialGastos: nuevoHistorialGastos,
        movimientos: [
          {
            monto: valor,
            fecha: new Date(),
            responsable: rutaData.responsable,
            descripcion: "Gasto D",
          },
          ...rutaData.movimientos,
        ],
      });

      setUsuarioRuta({
        ...usuarioRuta,
        saldoInicial: saldoNuevo,
        historialGastos: nuevoHistorialGastos,
        movimientos: [
          {
            monto: valor,
            fecha: new Date(),
            responsable: rutaData.responsable,
            descripcion: "Gasto D",
          },
          ...usuarioRuta.movimientos,
        ],
      });
    } catch (error) {
      console.error("Error al agregar el gasto:", error.message);
    } finally {
      setIsAdding(false);
      toast.success("Gasto agregado con éxito");
      setValor("");
      setDescripcion("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen h-full bg-gray-200 pt-16 px-4 md:px-8 pb-4">
        <div className="w-full flex-col gap-2 flex justify-center items-center">
          <h2 className="font-bold text-lg">Agregar Gasto</h2>
          <div className="bg-white border shadow-[2px_2px_8px_rgb(0,0,0,0.5)] border-gray-400 w-full md:w-[400px] p-4 rounded-md max-h-[90%]">
            <div className="flex flex-col items-center mb-2 ">
              <span className="text-xl font-bold leading-4 md:leading-3">
                ${usuarioRuta?.saldoInicial}
              </span>
              <span className="text-xs md:text-base md:font-semibold font-bold">
                SALDO DISPONIBLE
              </span>
            </div>
            <form onSubmit={agregarGasto}>
              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  Valor del gasto
                </div>
                <input
                  type="number"
                  value={valor}
                  className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                  onChange={(e) => setValor(parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="flex w-full h-[40px] border border-gray-400 rounded-md mt-1">
                <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  Descripcion
                </div>
                <input
                  type="text"
                  value={descripcion}
                  className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#8131bd] mt-2 mx-auto w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
                disabled={isAdding}
              >
                {isAdding ? (
                  <MoonLoader size={20} color="#ffffff" />
                ) : (
                  "Agregar"
                )}
              </button>
            </form>
          </div>
          <TablaGastos datos={usuarioRuta?.historialGastos} />
        </div>
      </div>
      ;
    </>
  );
};
