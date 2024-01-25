import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUser,
} from "react-icons/ai";
import { FaRoute } from "react-icons/fa";
import { useContext, useState } from "react";
import { TbLock } from "react-icons/tb";
import { MoonLoader } from "react-spinners";
import { IoIosClose } from "react-icons/io";
import { CiDollar } from "react-icons/ci";
import { auth } from "../../../../firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { miContexto } from "../../../../context/AppContext";

export const RegisterRutaPage = ({ setIsModalCreateRuta, userData }) => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [contrasenaVerify, setContrasenaVerify] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isButtonPassword, setIsButtonPassword] = useState(true);
  const [responsable, setResponsable] = useState("");
  const [saldoInicial, setSaldoInicial] = useState(0);
  const { setRutasData, rutasData, handleLogout } = useContext(miContexto);
  const userAdmin = auth.currentUser;

  const crearRuta = async (e) => {
    e.preventDefault();

    try {
      setIsSubmiting(true);
      if (contrasena !== contrasenaVerify) {
        toast.error("Las contraseñas no coinciden");
        setIsSubmiting(false);
        return;
      }

      const userEmail = `${usuario}@fastadmin.com`;

      // Crear nuevo usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        contrasena
      );
      const newUser = userCredential.user;

      // Obtener el UID del nuevo usuario
      const uid = newUser?.uid;

      if (uid) {
        // Guardar información en Firestore
        const db = getFirestore();
        const adminRef = collection(db, `/admin_users/${userAdmin?.uid}/rutas`);
        const userDoc = doc(adminRef, uid);
        await setDoc(userDoc, {
          uid: uid,
          nombreRuta: usuario,
          isAdmin: false,
          adminUid: userAdmin?.uid,
          responsable: responsable,
          saldoInicial: saldoInicial,
          historialGastos: [],
          movimientos: [
            {
              monto: saldoInicial,
              fecha: new Date(),
              responsable: "admin",
              descripcion: "saldo inicial",
            },
          ],
          historialSaldos: saldoInicial,
          proximoPago: userData.proximoPago,
        });

        setRutasData([
          ...rutasData,
          {
            uid: uid,
            nombreRuta: usuario,
            isAdmin: false,
            adminUid: userAdmin?.uid,
            responsable: responsable,
            saldoInicial: saldoInicial,
            historialGastos: [],
            movimientos: [
              {
                monto: saldoInicial,
                fecha: new Date(),
                responsable: "admin",
                descripcion: "saldo inicial",
              },
            ],
            historialSaldos: saldoInicial,
            proximoPago: userData.proximoPago,
          },
        ]);

        const rutasPassRef = collection(db, "rutasPass");
        const passData = {
          nombreRuta: usuario,
          responsable: responsable,
          uid: uid,
          contrasena: contrasena,
        };
        await addDoc(rutasPassRef, passData);

        // Restablecer los estados y cerrar el modal
        setUsuario("");
        setContrasena("");
        setContrasenaVerify("");
        setIsSubmiting(false);
        setIsModalCreateRuta(false);
        handleLogout();
        toast.success("Ruta creada exitosamente, ahora inicie sesion");
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("El nombre de ruta ya existe, pruebe con otro");
      } else if (error.code === "auth/weak-password") {
        toast.error(
          "La contraseña debe tener un minimo de seis (6) caracteres"
        );
        return;
      }

      setIsSubmiting(false);
    }
  };

  const changeTypeText = () => {
    setIsButtonPassword(!isButtonPassword);
  };

  return (
    <>
      <div className="w-full min-h-screen z-10 bg-black bg-opacity-50 pt-16 px-2 md:px-8 flex justify-center items-center fixed ">
        <div className="bg-gray-200 w-[400px] p-4 rounded-md relative">
          <IoIosClose
            className="absolute right-0 top-0 cursor-pointer"
            size={40}
            onClick={() => setIsModalCreateRuta(false)}
          />
          <h2 className="text-center text-xl font-semibold">Crear Ruta</h2>
          <form onSubmit={crearRuta} className="w-full mt-2">
            <div className="w-full flex flex-col gap-6 items-center">
              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  <FaRoute size={24} />
                </div>
                <input
                  type="text"
                  className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="Nombre de Ruta"
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                />
              </div>
              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  <AiOutlineUser size={24} />
                </div>
                <input
                  type="text"
                  className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="Nombre del responsable"
                  onChange={(e) => setResponsable(e.target.value)}
                  required
                />
              </div>
              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                  <CiDollar size={24} />
                </div>
                <input
                  type="number"
                  className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="Saldo Inicial"
                  onChange={(e) => setSaldoInicial(parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center border-gray-400 rounded-l-md border-r">
                  <TbLock size={24} />
                </div>
                <input
                  type={isButtonPassword ? "password" : "text"}
                  className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="Contraseña"
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                />
                <div className="h-full w-[40px] bg-white rounded-md flex items-center justify-center ">
                  {isButtonPassword ? (
                    <AiOutlineEye
                      onClick={changeTypeText}
                      className="text-gray-500"
                      size={24}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      onClick={changeTypeText}
                      className="text-gray-500"
                      size={24}
                    />
                  )}
                </div>
              </div>
              <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
                <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center border-gray-400 rounded-l-md border-r">
                  <TbLock size={24} />
                </div>
                <input
                  type={isButtonPassword ? "password" : "text"}
                  className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                  placeholder="Verificar Contraseña"
                  onChange={(e) => setContrasenaVerify(e.target.value)}
                  required
                />
                <div className="h-full w-[40px] bg-white rounded-md flex items-center justify-center ">
                  {isButtonPassword ? (
                    <AiOutlineEye
                      onClick={changeTypeText}
                      className="text-gray-500"
                      size={24}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      onClick={changeTypeText}
                      className="text-gray-500"
                      size={24}
                    />
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#8131bd] w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
                disabled={isSubmiting}
              >
                {isSubmiting ? (
                  <MoonLoader size={20} color="#ffffff" />
                ) : (
                  "Crear ruta"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
