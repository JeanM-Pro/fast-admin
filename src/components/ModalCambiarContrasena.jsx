import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { TbLock } from "react-icons/tb";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { auth } from "../firebase/firebaseConfig";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const ModalCambiarContrasena = ({ setverCambiarContrasenaModal }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordVerify, setNewPasswordVerify] = useState("");
  const [error, setError] = useState(null);
  const [isButtonPassword, setIsButtonPassword] = useState(true);
  const [isButtonPasswordNew, setIsButtonPasswordNew] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const changeTypeText = () => {
    setIsButtonPassword(!isButtonPassword);
  };

  const changeTypeTextNew = () => {
    setIsButtonPasswordNew(!isButtonPasswordNew);
  };

  const handleChangePassword = async () => {
    setIsSubmiting(true);
    if (newPassword !== newPasswordVerify) {
      toast.error("Las contraseñas nuevas no coinciden");
      setIsSubmiting(false);
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordVerify("");
      return;
    }
    try {
      const user = auth.currentUser;
      if (user) {
        const credentials = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );

        // Ahora, puedes utilizar 'credentials' para reautenticar al usuario
        // Por ejemplo, al cambiar la contraseña
        await reauthenticateWithCredential(user, credentials)
          .then(() => {
            // Reautenticación exitosa
          })
          .catch((error) => {
            // Manejar errores de reautenticación
            console.error("Error al reautenticar:", error);
          });
      }

      // Cambiar la contraseña
      await updatePassword(user, newPassword);

      const db = getFirestore();

      // Obtener el documento en "adminPass" asociado al usuario actual
      const adminPassQuery = query(
        collection(db, "adminPass"),
        where("uid", "==", user.uid) // Suponiendo que el campo email es único
      );

      const adminPassSnapshot = await getDocs(adminPassQuery);

      function isEmpty(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
      }

      if (!isEmpty(adminPassSnapshot.docs)) {
        const adminPassRef = doc(
          collection(db, "adminPass"),
          adminPassSnapshot.docs[0].id
        );

        // Obtener el documento actual para mantener los datos no relacionados con la contraseña
        const adminPassData = adminPassSnapshot.docs[0].data();

        await updateDoc(adminPassRef, {
          ...adminPassData,
          contrasena: newPassword,
        });
      } else {
        console.error(
          "No se encontró el documento en adminPass asociado al usuario actual"
        );
        // Manejar el caso donde no se encuentra el documento
      }

      toast.success("Contraseña cambiada exitosamente");
      setverCambiarContrasenaModal(false);
      setIsSubmiting(false);
    } catch (error) {
      setError(error.message);
      console.error("Error al cambiar la senha", error);
      setIsSubmiting(false);
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordVerify("");
    }
  };

  return (
    <div className="w-full min-h-screen h-screen z-10 bg-black bg-opacity-50 px-2 md:px-8 flex justify-center items-center fixed top-0 left-0">
      <div className="bg-gray-200 w-[400px] p-4 rounded-md relative flex flex-col items-center max-h-[90%] overflow-y-auto">
        <IoIosClose
          className="absolute right-0 top-0 cursor-pointer"
          size={40}
          onClick={() => setverCambiarContrasenaModal(false)}
        />
        <h2 className="text-center text-xl font-semibold">
          Cambiar Contraseña
        </h2>
        <div className="flex w-full h-[40px] border border-gray-400 rounded-md mt-1">
          <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center border-gray-400 rounded-l-md border-r">
            <TbLock size={24} />
          </div>
          <input
            type={isButtonPassword ? "password" : "text"}
            className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
            placeholder="Contraseña Actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
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

        <div className="flex w-full h-[40px] border border-gray-400 rounded-md mt-2">
          <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center border-gray-400 rounded-l-md border-r">
            <TbLock size={24} />
          </div>
          <input
            type={isButtonPasswordNew ? "password" : "text"}
            className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
            placeholder="Nueva Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="h-full w-[40px] bg-white rounded-md flex items-center justify-center ">
            {isButtonPasswordNew ? (
              <AiOutlineEye
                onClick={changeTypeTextNew}
                className="text-gray-500"
                size={24}
              />
            ) : (
              <AiOutlineEyeInvisible
                onClick={changeTypeTextNew}
                className="text-gray-500"
                size={24}
              />
            )}
          </div>
        </div>

        <div className="flex w-full h-[40px] border border-gray-400 rounded-md mt-2">
          <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center border-gray-400 rounded-l-md border-r">
            <TbLock size={24} />
          </div>
          <input
            type={isButtonPasswordNew ? "password" : "text"}
            className="flex-1 rounded-md w-full px-2 focus:border-transparent focus:outline-none"
            placeholder="Verificar Nueva Contraseña"
            value={newPasswordVerify}
            onChange={(e) => setNewPasswordVerify(e.target.value)}
          />
          <div className="h-full w-[40px] bg-white rounded-md flex items-center justify-center ">
            {isButtonPasswordNew ? (
              <AiOutlineEye
                onClick={changeTypeTextNew}
                className="text-gray-500"
                size={24}
              />
            ) : (
              <AiOutlineEyeInvisible
                onClick={changeTypeTextNew}
                className="text-gray-500"
                size={24}
              />
            )}
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        <button
          className="bg-[#8131bd] mt-2 w-fit text-white px-2 py-1 rounded-md flex justify-center items-center min-w-[80px] font-semibold"
          onClick={handleChangePassword}
        >
          {isSubmiting ? <MoonLoader size={20} color="#ffffff" /> : "Cambiar"}
        </button>
      </div>
    </div>
  );
};
