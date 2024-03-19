import { useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { MoonLoader } from "react-spinners";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { format } from "date-fns";
import { miContexto } from "../context/AppContext";
import { toast } from "react-toastify";

export const AbonoModal = ({
  setIsAbono,
  selectedAbono,
  usuarioRuta,
  setUsuarioRuta,
  setSelectedAbono,
  setIsModalPreguntaRenovacion,
  setSearchTermExis,
}) => {
  const { formatDate2, userData } = useContext(miContexto);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [abono, setAbono] = useState(0);
  const [pagoHoy, setPagoHoy] = useState(false);
  const [observaciones, setObservaciones] = useState("Dinheiro");

  const fechaHoy = format(new Date(), "dd/MM/yyyy");
  const pagos = selectedAbono.historialPagos.map((pago) =>
    formatDate2(pago.fecha)
  );

  const pagoFiltrado = pagos.filter((pago) => pago === fechaHoy);

  useEffect(() => {
    if (fechaHoy === pagoFiltrado[0]) {
      setPagoHoy(true);
    }
  }, [fechaHoy, pagoFiltrado]);

  const handleAbonar = async () => {
    if (abono < 0) {
      return toast.error("Ingrese un monto valido");
    }

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

      let totalAbono;
      let vecesSuperado;
      let sobrante;

      if (userData?.isAdmin !== undefined) {
        if (clienteData.abono > abono) {
          const vecesSuperadoAnterior = Math.floor(
            clienteData.abono / selectedAbono.pagoDiario
          );
          const veceSuperadoActual = Math.floor(
            abono / selectedAbono.pagoDiario
          );
          const cuenta = vecesSuperadoAnterior - veceSuperadoActual;
          vecesSuperado = selectedAbono.cuotasPagadas - cuenta;
          totalAbono = abono;
          sobrante = abono % selectedAbono.pagoDiario;
        }

        if (clienteData.abono < abono) {
          totalAbono = abono;
          const vecesSuperadoAnterior = Math.floor(
            clienteData.abono / selectedAbono.pagoDiario
          );
          const veceSuperadoActual = Math.floor(
            abono / selectedAbono.pagoDiario
          );
          const resultSuperados = veceSuperadoActual - vecesSuperadoAnterior;
          vecesSuperado = clienteData.cuotasPagadas + resultSuperados;
          sobrante = abono % selectedAbono.pagoDiario;
        }
      } else {
        totalAbono = selectedAbono.valorPico + abono;
        const sumar = Math.floor(totalAbono / selectedAbono.pagoDiario);
        vecesSuperado = selectedAbono.cuotasPagadas + sumar;
        sobrante = totalAbono % selectedAbono.pagoDiario;
      }

      // Calcular cuotas a restar, asegurándote de que no sea un número negativo
      const cuotasAtrasadasToSubtract =
        vecesSuperado >= 2
          ? selectedAbono.cuotasAtrasadas - (vecesSuperado - 1)
          : Math.max(0, selectedAbono.cuotasAtrasadas - vecesSuperado);

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
      // const saldoNuevo = saldoViejoNum + abono;
      let valor;
      let descripcion;
      let montoFinal;

      if (clienteData.abono > abono) {
        const resta = clienteData.abono - abono;
        valor = saldoViejoNum - resta;
        descripcion = "Abono Editado (resta)";
        montoFinal = resta;
      }

      if (abono > clienteData.abono) {
        const resta = abono - clienteData.abono;
        valor = saldoViejoNum + resta;
        descripcion = "Abono Editado (suma)";
        montoFinal = resta;
      }

      await updateDoc(rutaRef, {
        ...rutaData,
        saldoInicial: valor,
        movimientos: [
          {
            monto: montoFinal,
            fecha: new Date(),
            responsable: clienteData.nombreCliente,
            descripcion: userData?.isAdmin ? descripcion : "abono cliente",
          },
          ...rutaData.movimientos,
        ],
      });

      // Restar prestamo al saldo disponible localmente

      setUsuarioRuta({
        ...usuarioRuta,
        saldoInicial: valor,
        movimientos: [
          {
            monto: montoFinal,
            fecha: new Date(),
            responsable: clienteData.nombreCliente,
            descripcion: userData?.isAdmin ? descripcion : "abono cliente",
          },
          ...usuarioRuta.movimientos,
        ],
      });

      const nuevoHistorial = {
        abono: abono,
        fecha: new Date(),
        observaciones: observaciones,
      };

      let historialPagosActualizado;

      if (userData?.isAdmin && clienteData.abono > 0) {
        // Filtrar el historial por la fecha de hoy si el usuario es un administrador
        historialPagosActualizado = clienteData.historialPagos.map(
          (historial) => {
            // Verifica si la fecha es un Timestamp y conviértelo a Date
            const fechaPago =
              historial.fecha instanceof Date
                ? historial.fecha
                : historial.fecha.toDate();

            return fechaPago.toISOString().split("T")[0] ===
              new Date().toISOString().split("T")[0]
              ? {
                  fecha: new Date(),
                  abono: abono,
                  observaciones: observaciones,
                }
              : historial;
          }
        );
      } else {
        // Si el usuario no es un administrador, simplemente agrega el nuevo historial
        historialPagosActualizado = [
          ...clienteData.historialPagos,
          nuevoHistorial,
        ];
      }

      let totalAbonoEdit;
      if (clienteData.abono > abono) {
        const cuenta = clienteData.abono - abono;
        totalAbonoEdit = clienteData.totalAbono - cuenta;
      }

      if (abono > clienteData.abono) {
        const cuenta = abono - clienteData.abono;
        totalAbonoEdit = clienteData.totalAbono + cuenta;
      }

      // Actualiza los datos en el documento manteniendo los datos originales no editados
      await updateDoc(clienteRef, {
        ...clienteData,
        abono: abono,
        cuotasPagadas: vecesSuperado,
        fechaUltimoAbono: fechaFormateada,
        valorPico: sobrante,
        totalAbono: userData?.isAdmin
          ? totalAbonoEdit
          : selectedAbono.totalAbono + abono,
        cuotasAtrasadas: cuotasAtrasadasToSubtract,
        historialPagos: historialPagosActualizado,
      });

      setSelectedAbono({
        ...selectedAbono,
        abono: abono,
        cuotasPagadas: vecesSuperado,
        fechaUltimoAbono: fechaFormateada,
        valorPico: sobrante,
        totalAbono: userData?.isAdmin
          ? totalAbonoEdit
          : selectedAbono.totalAbono + abono,
        cuotasAtrasadas: cuotasAtrasadasToSubtract,
        historialPagos: historialPagosActualizado,
      });

      const sumaAbonos = selectedAbono.totalAbono + abono;
      const deudaTotal =
        selectedAbono.cuotasPactadas * selectedAbono.pagoDiario;

      // Calcular si se pagaron todas las cupotas y poreguntar si quiere un nuevo prestamo
      if (
        sumaAbonos === deudaTotal ||
        selectedAbono.cuotasPagadas === selectedAbono.cuotasPactadas
      ) {
        setIsAbono(false);
        setIsModalPreguntaRenovacion(true);
      } else {
        setIsAbono(false);
      }
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
          {userData?.isAdmin ? "Editar abono diario" : "Ingresar abono diario"}
        </h2>
        {!pagoHoy || userData?.isAdmin || selectedAbono.abono <= 0 ? (
          <>
            <div className="flex w-full h-[40px] border border-gray-400 rounded-md mt-2">
              <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                Abonar R$
              </div>
              <input
                type="number"
                className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                onChange={(e) => setAbono(parseInt(e.target.value))}
              />
            </div>
            <div className="flex w-full h-[40px] border border-gray-400 rounded-md mt-2">
              <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                Observaciones
              </div>
              <input
                type="text"
                className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>
          </>
        ) : (
          <h2 className="font-semibold text-lg mt-1 text-red-500">
            Este cliente ya abonó hoy
          </h2>
        )}

        {!pagoHoy || userData?.isAdmin || selectedAbono.abono <= 0 ? (
          <button
            className="bg-[#8131bd] w-fit mt-4 text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            disabled={isSubmiting}
            onClick={handleAbonar}
          >
            {isSubmiting ? <MoonLoader size={20} color="#ffffff" /> : "Abonar"}
          </button>
        ) : null}
      </div>
    </div>
  );
};
