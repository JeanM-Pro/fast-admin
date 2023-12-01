import { createContext, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";

export const miContexto = createContext(undefined);

export const AppContext = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [usersAdminData, setUsersAdminData] = useState(null);
  const [rutasData, setRutasData] = useState(null);

  console.log(rutasData);

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

  return (
    <miContexto.Provider value={{ userData, usersAdminData, rutasData }}>
      {children}
    </miContexto.Provider>
  );
};
