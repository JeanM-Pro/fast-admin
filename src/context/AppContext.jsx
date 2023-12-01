import { createContext, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";

export const miContexto = createContext(undefined);

export const AppContext = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [usersAdminData, setUsersAdminData] = useState(null);
  const [rutasData, setRutasData] = useState(null);
  const [usuarioRuta, setUsuarioRuta] = useState(null);

  // Obtebner datos de usuarios administradores

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "admin_users"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setUsersAdminData(data);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, []);

  // obtener datos de las rutas usuarios

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = userData;

        if (user?.isAdmin) {
          const db = getFirestore();
          const querySnapshot = await getDocs(
            collection(db, "admin_users", userData.uid, "rutas")
          );
          const data = querySnapshot.docs.map((doc) => doc.data());
          setRutasData(data);
        }
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, [userData]);

  // filtrar admin al iniciar sesion

  useEffect(() => {
    const fetchUserData = () => {
      const user = auth.currentUser;
      const usuarioFiltrado = usersAdminData?.filter(
        (u) => u.uid === user?.uid
      );
      if (user) {
        const userDataToSet = usuarioFiltrado ? usuarioFiltrado[0] : null;

        setUserData(userDataToSet);
      }
    };

    fetchUserData();
  }, [usersAdminData]);

  // OBTENER DATOS DEL USUARIO DE LA RUTA

  useEffect(() => {
    const fetchData = async () => {
      try {
        const admins = usersAdminData?.map((u) => u.uid);
        const db = getFirestore();
        const user = auth.currentUser;

        if (admins && admins.length > 0) {
          // Utilizar Promise.all para esperar a que todas las consultas se completen
          const dataPromises = admins.map(async (uid) => {
            const querySnapshot = await getDocs(
              collection(db, "admin_users", uid, "rutas")
            );
            return querySnapshot.docs.map((doc) => doc.data());
          });

          const result = await Promise.all(dataPromises);

          // 'result' es un array con los resultados de todas las consultas

          // Verificar si result es un array no vacío antes de operar sobre él
          const flattenedResult = result.flat();
          if (flattenedResult && flattenedResult.length > 0) {
            const userRoutes = flattenedResult.find(
              (obj) => obj.uid === user?.uid
            );
            setUsuarioRuta(userRoutes);
          } else {
            console.log("No hay datos de rutas para los administradores");
          }
        } else {
          console.log("No hay usuarios administradores para consultar rutas");
        }
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, [usersAdminData]);

  return (
    <miContexto.Provider
      value={{ userData, usersAdminData, rutasData, usuarioRuta }}
    >
      {children}
    </miContexto.Provider>
  );
};
