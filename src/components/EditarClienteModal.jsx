import React, { useContext, useEffect, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { FaRegAddressBook, FaRoute } from "react-icons/fa";
import { IoLocationOutline, IoStorefrontOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { HiOutlineIdentification } from "react-icons/hi2";
import { CampoEntrada } from "../pages/HomePage/Components/Modals/CrearClientesModal/CampoEntrada";
import { format } from "date-fns";
import { MoonLoader } from "react-spinners";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { miContexto } from "../context/AppContext";
import { toast } from "react-toastify";
import {
  uploadImage,
  uploadImageTienda,
} from "../pages/HomePage/Components/firebaseFunctions";

export const EditarClienteModal = ({
  setIsModalEdit,
  selectedCliente,
  setSelectedCliente,
  userData,
  usuarioRuta,
  setClientes,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageTiendaPreview, setImageTiendaPreview] = useState(null);
  const [allClients, setAllClients] = useState(null);
  const [datosCliente, setDatosCliente] = useState({
    imageUrl: selectedCliente?.imageUrl,
    imageTienda: selectedCliente?.imageTienda,
    cpf: selectedCliente?.cpf,
    nombreCliente: selectedCliente?.nombreCliente,
    direccionCobro: selectedCliente?.direccionCobro,
    telefono: selectedCliente?.telefono,
    direccion: selectedCliente?.direccion,
    descripcion: selectedCliente?.descripcion,
    ubicacion: selectedCliente?.ubicacion,
    valorPrestamo: selectedCliente?.valorPrestamo,
    porcentajeInteres: selectedCliente?.porcentajeInteres,
    cuotasPactadas: selectedCliente?.cuotasPactadas,
    pagoDiario: selectedCliente?.pagoDiario,
    abono: selectedCliente?.abono,
    cuotasPagadas: selectedCliente?.cuotasPagadas,
    formaDePago: selectedCliente?.formaDePago,
    fechaFinal: selectedCliente?.fechaFinal,
    valorPico: selectedCliente?.valorPico,
    fechaUltimoAbono: selectedCliente?.fechaUltimoAbono,
    totalAbono: selectedCliente?.totalAbono,
    cuotasAtrasadas: selectedCliente?.cuotasAtrasadas,
    actualizado: selectedCliente?.actualizado,
    historialPagos: selectedCliente?.historialPagos,
  });
  const opcionesFormaPago = ["diario", "semanal", "mensual"];
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { setRutasData } = useContext(miContexto);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        if (usuarioRuta) {
          const querySnapshot = await getDocs(
            collection(
              db,
              "admin_users",
              usuarioRuta.adminUid,
              "rutas",
              usuarioRuta.uid,
              "allClients"
            )
          );

          // Verifica si hay algún documento en la consulta
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0]; // Accede al primer documento
            const uid = doc.id;
            const clienteData = doc.data();

            const data = { uid, ...clienteData }; // Convierte en objeto en lugar de array
            setAllClients(data);
          }
        }
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, [usuarioRuta]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDatosCliente({ ...datosCliente, imageUrl: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageTiendaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDatosCliente({ ...datosCliente, imageTienda: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageTiendaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const obtenerUbicacionActual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDatosCliente({
            ...datosCliente,
            ubicacion: `${latitude}, ${longitude}`,
          });
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
        }
      );
    } else {
      console.error("La geolocalización no está soportada por este navegador.");
    }
  };

  const handleValorPrestamoChange = (e) => {
    const valorPrestamoNum = parseInt(e.target.value);
    setDatosCliente((prevDatosCliente) => {
      const porcentajeInteresNum = parseInt(prevDatosCliente.porcentajeInteres);
      const cuotasPactadasNum = parseInt(prevDatosCliente.cuotasPactadas);

      const porcentajeTotal = (valorPrestamoNum * porcentajeInteresNum) / 100;
      const valorTotal = valorPrestamoNum + porcentajeTotal;

      return {
        ...prevDatosCliente,
        valorPrestamo: valorPrestamoNum,
        pagoDiario: valorTotal / cuotasPactadasNum,
      };
    });
  };

  const handlePorcentajeInteresChange = (e) => {
    const porcentajeInteresNum = parseInt(e.target.value);
    setDatosCliente((prevDatosCliente) => {
      const valorPrestamoNum = parseInt(prevDatosCliente.valorPrestamo);
      const cuotasPactadasNum = parseInt(prevDatosCliente.cuotasPactadas);

      const porcentajeTotal = (valorPrestamoNum * porcentajeInteresNum) / 100;
      const valorTotal = valorPrestamoNum + porcentajeTotal;

      return {
        ...prevDatosCliente,
        porcentajeInteres: porcentajeInteresNum,
        pagoDiario: valorTotal / cuotasPactadasNum,
      };
    });
  };

  const handleCuotasPactadasChange = (e) => {
    const cuotasPactadasNum = parseInt(e.target.value);
    setDatosCliente((prevDatosCliente) => {
      const valorPrestamoNum = parseInt(prevDatosCliente.valorPrestamo);
      const porcentajeInteresNum = parseInt(prevDatosCliente.porcentajeInteres);

      const porcentajeTotal = (valorPrestamoNum * porcentajeInteresNum) / 100;
      const valorTotal = valorPrestamoNum + porcentajeTotal;

      // Calcular la fecha final excluyendo los domingos
      const fechaInicial = new Date();
      let fechaFinal = new Date(fechaInicial);

      for (let i = 0; i < cuotasPactadasNum; i++) {
        // Añadir un día
        fechaFinal.setDate(fechaFinal.getDate() + 1);

        // Si es domingo, agregar un día extra
        if (fechaFinal.getDay() === 0) {
          fechaFinal.setDate(fechaFinal.getDate() + 1);
        }
      }

      // Formatear la fecha
      const fechaFinalFormateada = format(fechaFinal, "dd/MM/yyyy");
      return {
        ...prevDatosCliente,
        cuotasPactadas: cuotasPactadasNum,
        pagoDiario: valorTotal / cuotasPactadasNum,
        fechaFinal: fechaFinalFormateada,
      };
    });
  };

  function obtenerFechaActual() {
    const fecha = new Date();

    // Obtener día, mes y año
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, por lo que sumamos 1
    const anio = fecha.getFullYear();

    // Formatear la fecha como dd/mm/aaaa
    const fechaFormateada = `${formatoDosDigitos(dia)}/${formatoDosDigitos(
      mes
    )}/${anio}`;

    return fechaFormateada;
  }

  function formatoDosDigitos(numero) {
    return numero < 10 ? `0${numero}` : numero;
  }

  const fechaActual = obtenerFechaActual();

  const editarCliente = async (e) => {
    e.preventDefault();
    try {
      setIsSubmiting(true);
      setSelectedCliente((prevSelectedCliente) => ({
        ...prevSelectedCliente,
        ...datosCliente,
      }));

      const db = getFirestore();
      const clienteRef = doc(
        db,
        "admin_users",
        userData.uid,
        "rutas",
        usuarioRuta.uid,
        "clientes",
        selectedCliente.uid
      );

      const imageUrlPromise = imagePreview
        ? uploadImage({
            image: datosCliente.imageUrl,
            nombre: datosCliente.nombreCliente,
          })
        : Promise.resolve(datosCliente.imageUrl);

      const imageTiendaUrlPromise = imageTiendaPreview
        ? uploadImageTienda({
            imageTienda: datosCliente.imageTienda,
            descripcion: datosCliente.uid,
          })
        : Promise.resolve(datosCliente.imageTienda);

      const [imageUrl, imageTiendaUrl] = await Promise.all([
        imageUrlPromise,
        imageTiendaUrlPromise,
      ]);

      const clienteSnapshot = await getDoc(clienteRef);
      const clienteData = clienteSnapshot.data();

      const allClienteRef = doc(
        db,
        "admin_users",
        usuarioRuta.adminUid,
        "rutas",
        usuarioRuta.uid,
        "allClients",
        allClients.uid
      );

      const updatedDatosCliente = {
        ...datosCliente,
        imageUrl: imageUrl ? imageUrl : selectedCliente.imageUrl,
        imageTienda: imageTiendaUrl
          ? imageTiendaUrl
          : selectedCliente.imageTienda,
      };

      const rutaRef = doc(
        db,
        "admin_users",
        usuarioRuta.adminUid,
        "rutas",
        usuarioRuta.uid
      );

      const rutaSnapshot = await getDoc(rutaRef);
      const rutaData = rutaSnapshot.data();

      let valor;
      let descripcion;
      let montoFinal;

      if (clienteData.valorPrestamo > datosCliente.valorPrestamo) {
        const resta = clienteData.valorPrestamo - datosCliente.valorPrestamo;
        valor = rutaData.saldoInicial + resta;
        descripcion = "Prestamo Editado (resta)";
        montoFinal = clienteData.valorPrestamo - datosCliente.valorPrestamo;
      }

      if (datosCliente.valorPrestamo > clienteData.valorPrestamo) {
        const resta = datosCliente.valorPrestamo - clienteData.valorPrestamo;
        valor = rutaData.saldoInicial - resta;
        descripcion = "Prestamo Editado (suma)";
        montoFinal = datosCliente.valorPrestamo - clienteData.valorPrestamo;
      }

      if (datosCliente.valorPrestamo === clienteData.valorPrestamo) {
        valor = rutaData.saldoInicial;
        descripcion = `Cliente editado ${datosCliente.nombreCliente}`;
        montoFinal = 0;
      }

      await updateDoc(rutaRef, {
        ...rutaData,
        saldoInicial: valor,
        movimientos: [
          {
            monto: montoFinal,
            fecha: new Date(),
            responsable: "Admin",
            descripcion: descripcion,
          },
          ...rutaData.movimientos,
        ],
      });

      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.uid === selectedCliente.uid
            ? { ...cliente, ...datosCliente }
            : cliente
        )
      );

      setRutasData((prevRutas) =>
        prevRutas.map((ruta) =>
          ruta.uid === rutaData.uid
            ? {
                ...ruta,
                saldoInicial: valor,
                movimientos: [
                  {
                    monto: montoFinal,
                    fecha: new Date(),
                    responsable: "Admin",
                    descripcion: descripcion,
                  },
                  ...ruta.movimientos,
                ],
              }
            : ruta
        )
      );

      await updateDoc(clienteRef, updatedDatosCliente);
      await updateDoc(allClienteRef, {
        cpf: datosCliente.cpf,
        nombreCliente: datosCliente.nombreCliente,
        direccionCobro: datosCliente.direccionCobro,
        telefono: datosCliente.telefono,
        direccion: datosCliente.direccion,
        descripcion: datosCliente.descripcion,
        ubicacion: datosCliente.ubicacion,
        image: imageUrl ? imageUrl : datosCliente.image,
        imageTienda: imageTiendaUrl ? imageTiendaUrl : datosCliente.imageTienda,
      });

      toast.success("Cliente editado con exito");

      setIsSubmiting(false);
      setIsModalEdit(false);
      window.location.reload();
    } catch (error) {
      console.error("Error al editar el cliente:", error);
      setIsSubmiting(false);
    }
  };

  const campos = [
    {
      icono: <HiOutlineIdentification size={24} />,
      placeholder: "CPF",
      valor: datosCliente.cpf,
      onChange: (e) =>
        setDatosCliente({ ...datosCliente, cpf: e.target.value }),
    },
    {
      icono: <AiOutlineUser size={24} />,
      placeholder: "Nombre del Cliente",
      valor: datosCliente.nombreCliente || "",
      onChange: (e) =>
        setDatosCliente({ ...datosCliente, nombreCliente: e.target.value }),
    },
    {
      icono: <FaRoute size={24} />,
      placeholder: "Direccion de Cobro",
      valor: datosCliente.direccionCobro,
      onChange: (e) =>
        setDatosCliente({ ...datosCliente, direccionCobro: e.target.value }),
    },
    {
      icono: <BsTelephone size={24} />,
      placeholder: "Telefono",
      valor: datosCliente.telefono,
      onChange: (e) =>
        setDatosCliente({ ...datosCliente, telefono: e.target.value }),
    },
    {
      icono: <FaRegAddressBook size={24} />,
      placeholder: "Direccion de Residencia",
      valor: datosCliente.direccion,
      onChange: (e) =>
        setDatosCliente({ ...datosCliente, direccion: e.target.value }),
    },
    {
      icono: <IoStorefrontOutline size={24} />,
      placeholder: "Descripcion de la tienda",
      valor: datosCliente.descripcion,
      onChange: (e) =>
        setDatosCliente({ ...datosCliente, descripcion: e.target.value }),
    },
    {
      icono: <IoLocationOutline size={24} />,
      placeholder: "Ubicación Actual",
      valor: datosCliente.ubicacion,
      onChange: (e) =>
        setDatosCliente({ ...datosCliente, ubicacion: e.target.value }),
      onClick: obtenerUbicacionActual,
      readOnly: true,
    },
    // Agrega más campos según sea necesario
  ];
  return (
    <div className="w-full min-h-screen h-screen z-30 bg-black bg-opacity-70 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setIsModalEdit(false)}
        />

        <h2 className="text-center text-xl font-semibold">Editar Cliente</h2>

        <form onSubmit={editarCliente} className="w-full mt-2">
          <div className="w-full flex flex-col gap-2 items-center">
            {selectedCliente && (
              <img
                src={imagePreview ? imagePreview : selectedCliente.imageUrl}
                alt="Selected"
                className="h-[200px] w-auto rounded-r-md object-cover"
              />
            )}
            <div className="flex w-full h-[40px] border border-gray-400 rounded-md relative">
              <label
                htmlFor="imageInput"
                className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400 cursor-pointer"
              >
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <HiOutlinePhotograph size={24} />
              </label>
              <input
                type="text"
                className="flex-1 rounded-r-md w-full px-2 focus:border-transparent focus:outline-none"
                placeholder={
                  imagePreview || selectedCliente?.imageUrl
                    ? "Cambiar Foto"
                    : "Agregar Foto del Cliente"
                }
                onClick={() => document.getElementById("imageInput").click()}
                readOnly // Evitar que se pueda editar directamente el texto
              />
            </div>

            {selectedCliente && (
              <img
                src={
                  imageTiendaPreview
                    ? imageTiendaPreview
                    : selectedCliente.imageTienda
                }
                alt="Selected"
                className="h-[200px] w-auto rounded-r-md object-cover"
              />
            )}
            <div className="flex w-full h-[40px] border border-gray-400 rounded-md relative">
              <label
                htmlFor="imageInputTienda"
                className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400 cursor-pointer"
              >
                <input
                  type="file"
                  id="imageInputTienda"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageTiendaChange}
                />
                <HiOutlinePhotograph size={24} />
              </label>
              <input
                type="text"
                className="flex-1 rounded-r-md w-full px-2 focus:border-transparent focus:outline-none"
                placeholder={
                  imageTiendaPreview || selectedCliente.imageTienda
                    ? "Cambiar Foto"
                    : "Agregar Foto de Tienda"
                }
                onClick={() =>
                  document.getElementById("imageInputTienda").click()
                }
                readOnly // Evitar que se pueda editar directamente el texto
              />
            </div>

            {campos.map((campo, index) => (
              <CampoEntrada key={index} {...campo} />
            ))}

            <h2 className="text-center text-xl font-semibold">
              Datos del Credito
            </h2>

            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                Valor Prestamo
              </div>
              <input
                type="number"
                className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                value={datosCliente.valorPrestamo}
                onChange={handleValorPrestamoChange}
              />
            </div>

            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                Porcentaje de interes
              </div>
              <input
                type="number"
                className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                onChange={handlePorcentajeInteresChange}
                value={datosCliente.porcentajeInteres}
              />
            </div>

            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                Cuotas Pactadas
              </div>
              <input
                type="number"
                className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                onChange={handleCuotasPactadasChange}
                value={datosCliente.cuotasPactadas}
              />
            </div>

            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                Pago Diario
              </div>
              <input
                type="number"
                className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                value={datosCliente.pagoDiario}
                readOnly
              />
            </div>

            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                Forma de pago
              </div>
              <select
                className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                value={datosCliente.formaDePago}
                onChange={(e) =>
                  setDatosCliente({
                    ...datosCliente,
                    formaDePago: e.target.value,
                  })
                }
              >
                {opcionesFormaPago.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* -------------------------------- */}

            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                Fecha Inicial
              </div>
              <input
                type="text"
                className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                defaultValue={fechaActual}
                readOnly
              />
            </div>

            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                Fecha Final
              </div>
              <input
                type="text"
                className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                value={datosCliente.fechaFinal}
                readOnly
              />
            </div>

            <button
              type="submit"
              className="bg-[#8131bd] w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
              disabled={isSubmiting}
            >
              {isSubmiting ? (
                <MoonLoader size={20} color="#ffffff" />
              ) : (
                "Editar Cliente"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
