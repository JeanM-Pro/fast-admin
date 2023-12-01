import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { TbLock } from "react-icons/tb";
import { MoonLoader } from "react-spinners";
import fondoImagen from "../../images/fondo.png";
import logoImagen from "../../images/logo.png";
import { auth } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const LoginPage = ({ setUser }) => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isSubmiting, setisSubmiting] = useState(false);

  const navigate = useNavigate();

  const handleLoginWithEmailPassword = async () => {
    const userEmail = `${usuario}@fastadmin.com`;

    try {
      setisSubmiting(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        contrasena
      );

      setUser(userCredential);
      navigate("/home");

      toast.success("Inicio de sesión exitoso");
    } catch (error) {
      toast.error("El email o la contraseña son incorrectos.");
      console.error("Error de inicio de sesión:", error.message);
    } finally {
      setisSubmiting(false);
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

        <h2 className="text-2xl mb-4">Ingresa a tu cuenta</h2>

        <form className="w-full">
          <div className="w-full flex flex-col gap-6 items-center">
            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
                <AiOutlineUser size={24} />
              </div>
              <input
                type="text"
                className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                placeholder="Usuario"
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>
            <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
              <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center border-gray-400 rounded-l-md border-r">
                <TbLock size={24} />
              </div>
              <input
                type="password"
                className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
                placeholder="Contraseña"
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="bg-[#8131bd] w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px]"
              onClick={handleLoginWithEmailPassword}
              disabled={isSubmiting}
            >
              {isSubmiting ? (
                <MoonLoader size={20} color="#ffffff" />
              ) : (
                "Ingresar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
