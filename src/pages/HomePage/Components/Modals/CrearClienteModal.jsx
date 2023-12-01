import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FaRegAddressBook, FaRoute } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { IoLocationOutline, IoStorefrontOutline } from "react-icons/io5";
import { MoonLoader } from "react-spinners";
import { BsTelephone } from "react-icons/bs";
import { HiOutlineIdentification } from "react-icons/hi2";
import { HiOutlinePhotograph } from "react-icons/hi";
import { storage } from "../../../../firebase/firebaseConfig";
import { addDays, format } from "date-fns";

export const CrearClienteModal = ({ setisModalCreateCliente }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cpf, setCpf] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [direccionCobro, setDireccionCobro] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [valorPrestamo, setValorPrestamo] = useState(0);
  const [porcentajeInteres, setPorcentajeInteres] = useState(0);
  const [cuotasPactadas, setCuotasPactadas] = useState(1);
  const [pagoDiario, setPagoDiario] = useState(0);
  const [formaDePago, setFormaDePago] = useState("diario");
  const [fechaFinal, setFechaFinal] = useState("");

  const [isSubmiting, setIsSubmiting] = useState(false);

  const opcionesFormaPago = ["diario", "semanal", "mensual"];

  const handleValorPrestamoChange = (e) => {
    const valorPrestamoNum = parseInt(e.target.value);
    const porcentajeInteresNum = parseInt(porcentajeInteres);
    const cuotasPactadasNum = parseInt(cuotasPactadas);

    const porcentajeTotal = (valorPrestamoNum * porcentajeInteresNum) / 100;
    const valorTotal = valorPrestamoNum + porcentajeTotal;
    const pagoDiarioNum = Math.ceil(valorTotal / cuotasPactadasNum);

    setValorPrestamo(valorPrestamoNum);
    setPagoDiario(pagoDiarioNum);
  };

  const handlePorcentajeInteresChange = (e) => {
    const porcentajeInteresNum = parseInt(e.target.value);
    const valorPrestamoNum = parseInt(valorPrestamo);
    const cuotasPactadasNum = parseInt(cuotasPactadas);

    const porcentajeTotal = (valorPrestamoNum * porcentajeInteresNum) / 100;
    const valorTotal = valorPrestamoNum + porcentajeTotal;
    const pagoDiarioNum = Math.ceil(valorTotal / cuotasPactadasNum);

    setPorcentajeInteres(porcentajeInteresNum);
    setPagoDiario(pagoDiarioNum);
  };

  const handleCuotasPactadasChange = (e) => {
    const cuotasPactadasNum = parseInt(e.target.value);
    const valorPrestamoNum = parseInt(valorPrestamo);
    const porcentajeInteresNum = parseInt(porcentajeInteres);

    const porcentajeTotal = (valorPrestamoNum * porcentajeInteresNum) / 100;
    const valorTotal = valorPrestamoNum + porcentajeTotal;
    const pagoDiarioNum = Math.ceil(valorTotal / cuotasPactadasNum);

    setCuotasPactadas(cuotasPactadasNum);
    setPagoDiario(pagoDiarioNum);

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
    setFechaFinal(fechaFinalFormateada);
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

  // Obtener la ubicación actual del usuario
  const obtenerUbicacionActual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUbicacion(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
        }
      );
    } else {
      console.error("La geolocalización no está soportada por este navegador.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    try {
      if (image) {
        const storageRef = storage.ref(`clientes/${cpf}`);
        const imageRef = storageRef.child(image.name);
        await imageRef.put(image);
        const url = await imageRef.getDownloadURL();
        return url;
      }
      return null;
    } catch (error) {
      console.error("Error uploading image to Firebase Storage:", error);
      return null;
    }
  };

  const crearCliente = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);

    try {
      const imageUrl = await uploadImage();
      // Ahora puedes utilizar 'imageUrl' para almacenar la URL de la imagen en la base de datos o donde sea necesario
      const valorPrestamoNum = parseInt(valorPrestamo);
      const porcentajeInteresNum = parseInt(porcentajeInteres);
      const cuotasPactadasNum = parseInt(cuotasPactadas);
      // Calcular el porcentaje del valor del préstamo
      const porcentajeTotal = (valorPrestamoNum * porcentajeInteresNum) / 100;

      // Calcular el valor total del préstamo sumando el porcentaje al valor original
      const valorTotal = valorPrestamoNum + porcentajeTotal;

      // Calcular el pago diario y redondear al número entero superior
      const pagoDiarioNum = Math.ceil(valorTotal / cuotasPactadasNum);

      setPagoDiario(pagoDiarioNum);

      // Calcular la fecha final omitiendo los domingos
      const fechaInicial = new Date();
      const fechaFinalCalculada = calcularFechaFinal(
        fechaInicial,
        cuotasPactadasNum
      );

      setFechaFinal(fechaFinalCalculada);
    } finally {
      setIsSubmiting(false);
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

  return (
    <>
      <div className="w-full min-h-screen h-screen z-10 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed ">
        <div className="bg-gray-200 w-[400px] p-4 rounded-md relative max-h-[90%] overflow-y-auto">
          <IoIosClose
            className="absolute right-0 top-0 cursor-pointer"
            size={40}
            onClick={() => setisModalCreateCliente(false)}
          />
          <h2 className="text-center text-xl font-semibold">Crear Cliente</h2>
          <form onSubmit={crearCliente} className="w-full mt-2">
            <div className="w-full flex flex-col gap-2 items-center">
              {imagePreview && (
                <img
                  src={imagePreview}
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
                    imagePreview ? "Cambiar Foto" : "Agregar Foto del Cliente"
                  }
                  onClick={() => document.getElementById("imageInput").click()}
                  readOnly // Evitar que se pueda editar directamente el texto
                />
              </div>

              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  <HiOutlineIdentification size={24} />
                </div>
                <input
                  type="text"
                  className="flex-1 rounded-r-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="CPF"
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>
              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  <AiOutlineUser size={24} />
                </div>
                <input
                  type="text"
                  className="flex-1 rounded-r-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="Nombre del Cliente"
                  onChange={(e) => setNombreCliente(e.target.value)}
                />
              </div>

              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  <FaRoute size={24} />
                </div>
                <input
                  type="text"
                  className="flex-1 rounded-r-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="Direccion de Cobro"
                  onChange={(e) => setDireccionCobro(e.target.value)}
                />
              </div>

              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  <BsTelephone size={24} />
                </div>
                <input
                  type="text"
                  className="flex-1 rounded-r-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="Telefono"
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>

              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  <FaRegAddressBook size={24} />
                </div>
                <input
                  type="text"
                  className="flex-1 rounded-r-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="Direccion de Residencia"
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>

              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  <IoStorefrontOutline size={24} />
                </div>
                <input
                  type="text"
                  className="flex-1 rounded-r-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="Descripcion de la tienda"
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  <IoLocationOutline size={24} />
                </div>
                <input
                  type="text"
                  className="flex-1 rounded-r-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="Ubicación Actual"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  onClick={obtenerUbicacionActual}
                />
              </div>

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
                />
              </div>

              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  Pago Diario
                </div>
                <input
                  type="number"
                  className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                  value={pagoDiario}
                  readOnly
                />
              </div>

              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[50%] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  Forma de pago
                </div>
                <select
                  className="flex-1 rounded-r-md w-[50%] px-2 focus:border-transparent focus:outline-none"
                  value={formaDePago}
                  onChange={(e) => setFormaDePago(e.target.value)}
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
                  value={fechaFinal}
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
                  "Agregar Cliente"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
