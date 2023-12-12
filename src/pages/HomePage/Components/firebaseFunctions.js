// firebaseFunctions.js
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig";

export const guardarClienteEnFirebase = async (
  clienteData,
  usuarioRuta,
  fechaActual,
  setInfoClientes,
  infoClientes
) => {
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
      valorPrestamo: clienteData.datosCliente.valorPrestamo,
      porcentajeInteres: clienteData.datosCliente.porcentajeInteres,
      cuotasPactadas: clienteData.datosCliente.cuotasPactadas,
      pagoDiario: clienteData.datosCliente.pagoDiario,
      abono: clienteData.datosCliente.abono,
      cuotasPagadas: clienteData.datosCliente.cuotasPagadas,
      formaDePago: clienteData.datosCliente.formaDePago,
      fechaActual,
      fechaFinal: clienteData.datosCliente.fechaFinal,
    };

    await addDoc(clienteRef, docData);
    setInfoClientes([...infoClientes, docData]);
  } catch (error) {
    console.error("Error al guardar el cliente en Firebase:", error);
    throw error; // Puedes manejar el error de acuerdo a tus necesidades
  }
};

export const uploadImage = async ({ image, cpf }) => {
  try {
    if (image) {
      const storageRef = ref(storage, `clientes/${cpf}`);

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
