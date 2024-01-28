import { createContext, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";

export const miContexto = createContext(undefined);

export const AppContext = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [usersAdminData, setUsersAdminData] = useState(null);
  const [rutasData, setRutasData] = useState(null);
  const [usuarioRuta, setUsuarioRuta] = useState(null);
  const [infoClientes, setInfoClientes] = useState(null);
  const [isLogouting, setIsLogouting] = useState(false);
  // cerrar sesion

  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLogouting(true);
    try {
      await auth.signOut();
      toast.success("Sesión cerrada exitosamente.");
      navigate("/");
      setIsLogouting(false);
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

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
          return;
        }
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, [usersAdminData]);

  // OBTENER CLIENTES

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
              "clientes"
            )
          );
          const data = querySnapshot.docs.map((doc) => {
            const uid = doc.id;
            const clienteData = doc.data();
            return { uid, ...clienteData };
          });
          setInfoClientes(
            data.sort((a, b) => {
              const posicionA =
                a.posicion !== undefined ? a.posicion : data.length - 1;
              const posicionB =
                b.posicion !== undefined ? b.posicion : data.length - 1;

              return posicionA - posicionB;
            })
          );
        }
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, [usuarioRuta]);

  // --------------------------

  function formatDate(fecha) {
    let fechaJavaScript;

    // Verificar si la fecha ya es una instancia de Date
    if (fecha instanceof Date) {
      fechaJavaScript = fecha;
    } else {
      // Si no es una instancia de Date, intentar parsear la cadena
      fechaJavaScript = new Date(
        fecha?.seconds * 1000 + fecha?.nanoseconds / 1e6
      );
    }

    const dia = fechaJavaScript.getDate();
    const mes = fechaJavaScript.getMonth() + 1;
    const ano = fechaJavaScript.getFullYear();
    const hora = fechaJavaScript.getHours();
    const minutos = fechaJavaScript.getMinutes();

    return `${dia}/${mes}/${ano}  ${hora}:${
      minutos <= 9 ? `0${minutos}` : minutos
    }`;
  }

  const formatDate2 = (fecha) => {
    let fechaJavaScript;

    // Verificar si la fecha ya es una instancia de Date
    if (fecha instanceof Date) {
      fechaJavaScript = fecha;
    } else {
      // Si no es una instancia de Date, intentar parsear la cadena
      fechaJavaScript = new Date(
        fecha?.seconds * 1000 + fecha?.nanoseconds / 1e6
      );
    }

    const dia = fechaJavaScript.getDate();
    const mes = fechaJavaScript.getMonth() + 1;
    const ano = fechaJavaScript.getFullYear();

    return `${dia <= 9 ? `0${dia}` : dia}/${mes <= 9 ? `0${mes}` : mes}/${ano}`;
  };

  // Calcular prestamos del dia
  const fechaHoy = format(new Date(), "dd/MM/yyyy");
  const calcularPrestamoDelDia = () => {
    // infoClientes es el array de clientes que contiene la propiedad 'valorPrestamo'
    if (!infoClientes || infoClientes?.length === 0) {
      return 0; // Si no hay clientes, el total de préstamos es cero
    }

    // Filtrar los clientes cuya fecha sea igual a la fecha de hoy
    const clientesDelDia = infoClientes?.filter(
      (cliente) => cliente.fechaActual === fechaHoy
    );

    // Sumar los valores de 'valorPrestamo' de los clientes del día
    const prestamoDelDia = clientesDelDia?.reduce(
      (acumulador, cliente) => acumulador + (cliente.valorPrestamo || 0),
      0
    );

    return prestamoDelDia;
  };

  // Calcular total abonos
  const calcularTotalAbonos = () => {
    // infoClientes es el array de clientes que contiene la propiedad 'abono'
    if (!infoClientes || infoClientes?.length === 0) {
      return 0; // Si no hay clientes, el total de abonos es cero
    }

    // Sumar los abonos de todos los clientes
    const totalAbonos = infoClientes?.reduce(
      (acumulador, cliente) => acumulador + (cliente.abono || 0),
      0
    );

    return totalAbonos;
  };

  return (
    <miContexto.Provider
      value={{
        userData,
        usersAdminData,
        rutasData,
        usuarioRuta,
        setUsuarioRuta,
        infoClientes,
        setInfoClientes,
        setRutasData,
        handleLogout,
        isLogouting,
        formatDate,
        setUsersAdminData,
        formatDate2,
        calcularPrestamoDelDia,
        calcularTotalAbonos,
      }}
    >
      {children}
    </miContexto.Provider>
  );
};
