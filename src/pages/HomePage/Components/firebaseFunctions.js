// firebaseFunctions.js
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig";

export const guardarClienteEnFirebase = async (
  clienteData,
  usuarioRuta,
  fechaInicialState,
  setInfoClientes,
  infoClientes
) => {
  const formatearFechaInicialState = () => {
    const fecha = new Date(fechaInicialState);
    fecha.setDate(fecha.getDate() + 1);

    // Obtener día, mes y año
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, por lo que sumamos 1
    const anio = fecha.getFullYear();

    // Formatear la fecha como dd/mm/aaaa
    const fechaFormateada = `${formatoDosDigitos(dia)}/${formatoDosDigitos(
      mes
    )}/${anio}`;

    return fechaFormateada;
  };

  function formatoDosDigitos(numero) {
    return numero < 10 ? `0${numero}` : numero;
  }

  try {
    // Subir la imagen y obtener la URL

    // Guardar datos en Firestore
    const db = getFirestore();
    const clienteRef = collection(
      db,
      "admin_users",
      usuarioRuta.adminUid,
      "rutas",
      usuarioRuta.uid,
      "clientes"
    );

    const docData = {
      cpf: clienteData.datosCliente.cpf,
      nombreCliente: clienteData.datosCliente.nombreCliente,
      direccionCobro: clienteData.datosCliente.direccionCobro,
      telefono: clienteData.datosCliente.telefono,
      direccion: clienteData.datosCliente.direccion,
      descripcion: clienteData.datosCliente.descripcion,
      ubicacion: clienteData.datosCliente.ubicacion,
      imageUrl: clienteData.imageUrl,
      imageTienda: clienteData.imageTiendaUrl,
      valorPrestamo: clienteData.datosCliente.valorPrestamo,
      porcentajeInteres: clienteData.datosCliente.porcentajeInteres,
      cuotasPactadas: clienteData.datosCliente.cuotasPactadas,
      pagoDiario: clienteData.datosCliente.pagoDiario,
      abono: clienteData.datosCliente.abono,
      cuotasPagadas: clienteData.datosCliente.cuotasPagadas,
      formaDePago: clienteData.datosCliente.formaDePago,
      fechaActual: formatearFechaInicialState(),
      fechaFinal: clienteData.datosCliente.fechaFinal,
      valorPico: clienteData.datosCliente.valorPico,
      fechaUltimoAbono: clienteData.datosCliente.fechaUltimoAbono,
      totalAbono: clienteData.datosCliente.totalAbono,
      cuotasAtrasadas: clienteData.datosCliente.cuotasAtrasadas,
      actualizado: clienteData.datosCliente.actualizado,
      historialPagos: clienteData.datosCliente.historialPagos,
    };

    const allClientsRef = collection(
      db,
      "admin_users",
      usuarioRuta.adminUid,
      "rutas",
      usuarioRuta.uid,
      "allClients"
    );

    const docDataAllClients = {
      cpf: clienteData.datosCliente.cpf,
      nombreCliente: clienteData.datosCliente.nombreCliente,
      direccionCobro: clienteData.datosCliente.direccionCobro,
      telefono: clienteData.datosCliente.telefono,
      direccion: clienteData.datosCliente.direccion,
      descripcion: clienteData.datosCliente.descripcion,
      ubicacion: clienteData.datosCliente.ubicacion,
      imageUrl: clienteData.imageUrl,
      imageTienda: clienteData.imageTiendaUrl,
    };

    await addDoc(clienteRef, docData);
    await addDoc(allClientsRef, docDataAllClients);
    setInfoClientes([...infoClientes, docData]);
  } catch (error) {
    console.error("Error al guardar el cliente en Firebase:", error);
    throw error; // Puedes manejar el error de acuerdo a tus necesidades
  }
};

export const uploadImage = async ({ image, nombre }) => {
  try {
    if (image) {
      const storageRef = ref(storage, `clientes/${nombre}`);

      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
    return null;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
    return null;
  }
};

export const uploadImageTienda = async ({ imageTienda, descripcion }) => {
  try {
    if (imageTienda) {
      const storageRef = ref(storage, `tiendas/${descripcion}`);

      await uploadBytes(storageRef, imageTienda);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
    return null;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
    return null;
  }
};
