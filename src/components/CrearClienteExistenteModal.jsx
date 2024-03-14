import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { miContexto } from "../context/AppContext";
import { format } from "date-fns";
import { guardarClienteEnFirebase } from "../pages/HomePage/Components/firebaseFunctions";
import { toast } from "react-toastify";
import { AiOutlineUser } from "react-icons/ai";
import { FaRegAddressBook, FaRoute } from "react-icons/fa";
import { IoLocationOutline, IoStorefrontOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { HiOutlineIdentification } from "react-icons/hi2";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MoonLoader } from "react-spinners";
import { CampoEntrada } from "../pages/HomePage/Components/Modals/CrearClientesModal/CampoEntrada";

export const CrearClienteExistenteModal = ({
  setIsModalCreateClienteExistente,
  usuarioRuta,
  setUsuarioRuta,
  searchTermExis,
  setSearchTermExis,
}) => {
  const { setInfoClientes, infoClientes } = useContext(miContexto);
  const [allClients, setAllClients] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageTiendaPreview, setImageTiendaPreview] = useState(null);
  const fechaNueva = formatearFechaActual();
  const [fechaInicialState, setFechaInicialState] = useState(fechaNueva);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showInputSearch, setShowInputSearch] = useState(true);
  const fechaDeAbono = new Date();
  const fechaFormateada = fechaDeAbono.toDateString();
  const [datosCliente, setDatosCliente] = useState({
    image: selectedCliente?.imageUrl,
    imageTienda: selectedCliente?.imageTienda,
    cpf: selectedCliente?.cpf,
    nombreCliente: selectedCliente?.nombreCliente,
    direccionCobro: selectedCliente?.direccionCobro,
    telefono: selectedCliente?.telefono,
    direccion: selectedCliente?.direccion,
    descripcion: selectedCliente?.descripcion,
    ubicacion: selectedCliente?.ubicacion,
    valorPrestamo: 1,
    porcentajeInteres: 0,
    cuotasPactadas: 1,
    pagoDiario: 0,
    abono: 0,
    cuotasPagadas: 0,
    formaDePago: "diario",
    fechaFinal: "",
    valorPico: 0,
    fechaUltimoAbono: fechaFormateada,
    totalAbono: 0,
    cuotasAtrasadas: 0,
    actualizado: new Date().toDateString(),
    historialPagos: [],
  });
  const [isSubmiting, setIsSubmiting] = useState(false);
  const opcionesFormaPago = ["diario", "semanal", "mensual"];

  // Obtener la fecha actual en el formato YYYY-MM-DD
  function formatearFechaActual() {
    const fecha = new Date();

    // Obtener año, mes y día
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Añadir ceros a la izquierda si es necesario
    const dia = String(fecha.getDate()).padStart(2, "0"); // Añadir ceros a la izquierda si es necesario

    // Formatear la fecha como YYYY-MM-DD
    const fechaFormateada = `${anio}-${mes}-${dia}`;

    return fechaFormateada;
  }

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
          const data = querySnapshot.docs.map((doc) => {
            const uid = doc.id;
            const clienteData = doc.data();
            return { uid, ...clienteData };
          });
          setAllClients(data);
        }
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, [usuarioRuta]);

  const handleSelectedCliente = (cliente) => {
    setSelectedCliente(cliente);
    setDatosCliente((prevDatosCliente) => ({
      ...prevDatosCliente,
      cpf: cliente.cpf || "",
      image: cliente.imageUrl || "",
      imageTienda: cliente.imageTienda || "",
      nombreCliente: cliente.nombreCliente || "",
      direccionCobro: cliente.direccionCobro || "",
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
      descripcion: cliente.descripcion || "",
      ubicacion: cliente.ubicacion || "",
    }));
    setShowInputSearch(false);
    setSearchTermExis("");
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
      const fechaInicial = new Date(fechaInicialState);
      fechaInicial.setDate(fechaInicial.getDate() + 1);
      let fechaFinal = new Date(fechaInicial);

      for (let i = 0; i < cuotasPactadasNum; i++) {
        if (datosCliente.formaDePago === "diario") {
          fechaFinal.setDate(fechaFinal.getDate() + 1);

          // Omitir los domingos
          if (fechaFinal.getDay() === 0) {
            fechaFinal.setDate(fechaFinal.getDate() + 1);
          }
        } else if (datosCliente.formaDePago === "semanal") {
          fechaFinal.setDate(fechaFinal.getDate() + 7);

          // Omitir los domingos
          if (fechaFinal.getDay() === 0) {
            fechaFinal.setDate(fechaFinal.getDate() + 1);
          }
        } else if (datosCliente.formaDePago === "mensual") {
          fechaFinal.setDate(fechaFinal.getDate() + 30);

          // Omitir los domingos
          if (fechaFinal.getDay() === 0) {
            fechaFinal.setDate(fechaFinal.getDate() + 1);
          }
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

  const handleFormaDePagoChange = (e) => {
    const formaDepago = e.target.value;
    setDatosCliente((prevDatosCliente) => {
      // Calcular la fecha final excluyendo los domingos
      const fechaInicial = new Date();
      let fechaFinal = new Date(fechaInicial);

      const cuotasPactadasNum = datosCliente.cuotasPactadas
        ? datosCliente.cuotasPactadas
        : 1;

      for (let i = 0; i < cuotasPactadasNum; i++) {
        if (formaDepago === "diario") {
          fechaFinal.setDate(fechaFinal.getDate() + 1);

          // Omitir los domingos
          if (fechaFinal.getDay() === 0) {
            fechaFinal.setDate(fechaFinal.getDate() + 1);
          }
        } else if (formaDepago === "semanal") {
          fechaFinal.setDate(fechaFinal.getDate() + 7);

          // Omitir los domingos
          if (fechaFinal.getDay() === 0) {
            fechaFinal.setDate(fechaFinal.getDate() + 1);
          }
        } else if (formaDepago === "mensual") {
          fechaFinal.setDate(fechaFinal.getDate() + 30);

          // Omitir los domingos
          if (fechaFinal.getDay() === 0) {
            fechaFinal.setDate(fechaFinal.getDate() + 1);
          }
        }
      }

      // Formatear la fecha
      const fechaFinalFormateada = format(fechaFinal, "dd/MM/yyyy");

      return {
        ...prevDatosCliente,
        formaDePago: formaDepago,
        fechaFinal: fechaFinalFormateada,
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDatosCliente({ ...datosCliente, image: file });
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

  const crearCliente = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    const db = getFirestore();

    try {
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
      const saldoNuevo = saldoViejoNum - datosCliente.valorPrestamo;

      await updateDoc(rutaRef, {
        ...rutaData,
        saldoInicial: saldoNuevo,
        movimientos: [
          {
            monto: datosCliente.valorPrestamo,
            fecha: new Date(),
            responsable: rutaData.responsable,
            descripcion: "prestamo",
          },
          ...rutaData.movimientos,
        ],
      });

      // Restar prestamo al saldo disponible localmente

      setUsuarioRuta({
        ...usuarioRuta,
        saldoInicial: saldoNuevo,
        movimientos: [
          {
            monto: datosCliente.valorPrestamo,
            fecha: new Date(),
            responsable: rutaData.responsable,
            descripcion: "prestamo",
          },
          ...usuarioRuta.movimientos,
        ],
      });

      const valorPrestamoNum = parseInt(datosCliente.valorPrestamo);
      const porcentajeInteresNum = parseInt(datosCliente.porcentajeInteres);
      const cuotasPactadasNum = parseInt(datosCliente.cuotasPactadas);
      // Calcular el porcentaje del valor del préstamo
      const porcentajeTotal = (valorPrestamoNum * porcentajeInteresNum) / 100;

      // Calcular el valor total del préstamo sumando el porcentaje al valor original
      const valorTotal = valorPrestamoNum + porcentajeTotal;

      // Calcular el pago diario y redondear al número entero superior
      const pagoDiarioNum = Math.ceil(valorTotal / cuotasPactadasNum);

      setDatosCliente({ ...datosCliente, pagoDiario: pagoDiarioNum });

      // Calcular la fecha final omitiendo los domingos
      const fechaInicial = new Date(fechaInicialState);
      fechaInicial.setDate(fechaInicial.getDate() + 1);
      const fechaFinalCalculada = calcularFechaFinal(
        fechaInicial,
        cuotasPactadasNum
      );

      setDatosCliente({ ...datosCliente, fechaFinal: fechaFinalCalculada });

      const clienteData = {
        imageUrl: datosCliente.image,
        imageTiendaUrl: datosCliente.imageTienda,
        datosCliente,
      };

      await guardarClienteEnFirebase(
        clienteData,
        usuarioRuta,
        fechaInicialState,
        setInfoClientes,
        infoClientes
      );
    } finally {
      setIsSubmiting(false);
      setIsModalCreateClienteExistente(false);
      window.location.reload();
      toast.success("Cliente agregado con exito");
    }
  };

  const calcularFechaFinal = (fechaInicial, cuotas) => {
    let fecha = new Date(fechaInicial);

    for (let i = 0; i < cuotas; i++) {
      fecha.setDate(fecha.getDate() + 1);

      // Omitir los domingos
      if (fecha.getDay() === 0) {
        fecha.setDate(fecha.getDate() + 1);
      }
    }

    return fecha.toLocaleDateString();
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
    <div className="w-full min-h-screen h-screen z-20 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed ">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setIsModalCreateClienteExistente(false)}
        />
        <h2 className="text-center text-xl font-semibold">Cliente Existente</h2>

        {showInputSearch ? (
          <input
            type="text"
            placeholder="Ingresar nombre de cliente"
            value={searchTermExis}
            onChange={(e) => setSearchTermExis(e.target.value)}
            className="w-full p-2 mt-2 border rounded-md"
          />
        ) : null}

        {searchTermExis &&
          allClients &&
          allClients
            .filter((cliente) =>
              cliente.nombreCliente
                .toLowerCase()
                .includes(searchTermExis.toLowerCase())
            )
            .map((cliente) => (
              <div
                key={cliente.uid}
                className="mt-1 p-2 rounded-md cursor-pointer border border-[#8131bd]"
                onClick={() => handleSelectedCliente(cliente)}
              >
                <span className="uppercase font-semibold">
                  {cliente.nombreCliente}
                </span>
              </div>
            ))}

        {!showInputSearch && (
          <form onSubmit={crearCliente} className="w-full mt-2">
            <div className="w-full flex flex-col gap-2 items-center">
              {selectedCliente && (
                <img
                  src={selectedCliente.imageUrl}
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
                    disabled={true}
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
                  src={selectedCliente.imageTienda}
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
                    disabled={true}
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

              {/* -------------------------------- */}

              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  Fecha Inicial
                </div>
                <input
                  type="date"
                  className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                  onChange={(e) => setFechaInicialState(e.target.value)}
                  defaultValue={fechaInicialState}
                />
              </div>

              <div
                className={`${
                  datosCliente.fechaFinal ? "flex" : "hidden"
                }  w-full h-[40px] border border-gray-400 rounded-md`}
              >
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

              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  Valor Prestamo
                </div>
                <input
                  type="number"
                  className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
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
                  required
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
                  onChange={handleFormaDePagoChange}
                >
                  {opcionesFormaPago.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-[#8131bd] w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
                disabled={isSubmiting}
              >
                {isSubmiting ? (
                  <MoonLoader size={20} color="#ffffff" />
                ) : (
                  "Agregar Cliente"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
