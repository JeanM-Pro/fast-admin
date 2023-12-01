import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { RegisterPage } from "../pages/RegisterPage/RegisterPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { auth } from "../firebase/firebaseConfig";
import { UsersPage } from "../pages/UsersPage/UsersPage";

export const AppRouter = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {user ? (
        <Routes>
          <Route
            path="/registerAdm"
            element={<RegisterPage setUser={setUser} />}
          />
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/trabajadores" element={<UsersPage />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/" element={<LoginPage setUser={setUser} />} />
        </Routes>
      )}
    </>
  );
};
