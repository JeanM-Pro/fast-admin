import { useContext, useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUser,
} from "react-icons/ai";
import { MdOutlineNumbers } from "react-icons/md";
import { TbLock } from "react-icons/tb";
import { MoonLoader } from "react-spinners";
import fondoImagen from "../../images/fondo.png";
import logoImagen from "../../images/logo.png";
import { auth } from "../../firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { miContexto } from "../../context/AppContext";

export const RegisterPage = () => {
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [contrasenaVerify, setContrasenaVerify] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isButtonPassword, setIsButtonPassword] = useState(true);
  const [rutas, setRutas] = useState(1);
  const { handleLogout } = useContext(miContexto);

  const navigate = useNavigate();

  const changeTypeText = () => {
    setIsButtonPassword(!isButtonPassword);
  };

  // Crear un nuevo objeto Date a partir de la fecha sumándole un mes
  const proximoPago = new Date();
  proximoPago.setMonth(proximoPago.getMonth() + 1);

  const handleRegister = async () => {
    setIsSubmiting(true);
    if (contrasena !== contrasenaVerify) {
      toast.error("Las contraseñas no coinciden");
      setIsSubmiting(false);
      return;
    }

    const userEmail = `${usuario}@fastadmin.com`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        contrasena
      );

      const createdUser = userCredential.user;
      const db = getFirestore();
      const adminUsersRef = collection(db, "admin_users");
      const userDoc = doc(adminUsersRef, createdUser.uid);
      await setDoc(userDoc, {
        uid: createdUser.uid,
        email: createdUser.email,
        isAdmin: true,
        nombre: nombre,
        cantidadRutas: rutas,
        ultimoPago: new Date(),
        proximoPago: proximoPago,
        activo: true,
      });

      const adminPassRef = collection(db, "adminPass");
      const adminPassData = {
        email: createdUser.email,
        contrasena: contrasena,
        nombre: nombre,
        uid: createdUser.uid,
      };

      await addDoc(adminPassRef, adminPassData);

      setIsSubmiting(false);
      navigate("/home");
      toast.success("Admin creado con exito");
      handleLogout();
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("El email ya esta en uso, pruebe usando otro");
      } else if (error.code === "auth/weak-password") {
        toast.error(
          "La contraseña debe tener un minimo de seis (6) caracteres"
        );
        setIsSubmiting(false);
        return;
      }
      setIsSubmiting(false);
    }
  };

  return (
    <div className="w-full overflow-hidden box-border relative h-screen flex justify-center flex-col gap-4 items-center">
      <img
        src={fondoImagen}
        alt="fondo"
        className="w-full h-full object-cover z-[-10] absolute left-0 top-0 opacity-70 blur"
      />

      <div className="login-container bg-gray-100 flex flex-col gap-4 justify-center items-center border shadow-[2px_2px_6px_rgb(0,0,0,0.5)] rounded-md px-3 py-4 w-[90%] md:w-[350px]">
        <div className="flex justify-center flex-col items-center">
          <img src={logoImagen} alt="logo" className="w-[160px] h-[160px]" />
          <h3 className="font-bold text-base uppercase text-[#8131bd] mt-[-10px]">
            Facilidad y Eficiencia
          </h3>
        </div>

        <h2 className="text-2xl mb-4">Registro de Administradores</h2>

        <div className="w-full flex flex-col gap-2 items-center">
          <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
            <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
              <AiOutlineUser size={24} />
            </div>
            <input
              type="text"
              className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
              placeholder="Usuario"
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
              placeholder="Nombre"
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
            <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
              <MdOutlineNumbers size={24} />
            </div>
            <input
              type="number"
              className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
              placeholder="Numero de Rutas"
              value={rutas}
              onChange={(e) => setRutas(e.target.value)}
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
            type="button"
            className="bg-[#8131bd] w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
            onClick={handleRegister}
            disabled={isSubmiting}
          >
            {isSubmiting ? (
              <MoonLoader size={20} color="#ffffff" />
            ) : (
              "Registrar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
