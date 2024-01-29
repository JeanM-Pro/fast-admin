import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logoNav from "../images/logonav.png";
import { useContext, useEffect, useState } from "react";
import logoLetra from "../images/logoLetra.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillHome } from "react-icons/ai";
import { MoonLoader } from "react-spinners";
import { BiSolidLogOut } from "react-icons/bi";
import { miContexto } from "../context/AppContext";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { FcStatistics } from "react-icons/fc";
import { auth } from "../firebase/firebaseConfig";

export const Navbar = () => {
  const [toggleNavbar, setToggleNavbar] = useState(false);
  const [animationNavbar, setAnimationNavbar] = useState(false);
  const [mostrarGastos, setMostrarGastos] = useState(false);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const { handleLogout, isLogouting, userData } = useContext(miContexto);
  const navigate = useNavigate();

  const handleToggleNavbar = () => {
    setAnimationNavbar(!animationNavbar);
    if (toggleNavbar) {
      setTimeout(() => {
        setToggleNavbar(!toggleNavbar);
      }, 500);
    } else {
      setToggleNavbar(!toggleNavbar);
    }
  };
  const location = useLocation();
  const ruta = location.pathname;

  const user = auth.currentUser;

  useEffect(() => {
    const updateUserDisplay = () => {
      // Lógica para mostrar u ocultar elementos según el usuario
      if (
        user?.email === "jeancenteno54@fastadmin.com" ||
        user?.email === "jeziel@fastadmin.com" ||
        userData?.isAdmin
      ) {
        setMostrarGastos(false);
      } else {
        setMostrarGastos(true);
      }

      if (
        user?.email === "jeancenteno54@fastadmin.com" ||
        user?.email === "jeziel@fastadmin.com"
      ) {
        setMostrarEstadisticas(false);
      } else {
        setMostrarEstadisticas(true);
      }
    };

    updateUserDisplay(); // Llamar a la función al montar el componente

    // También puedes agregar userData como dependencia si es necesario
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <>
      <div className="fixed w-full lg:px-16 z-10 px-6 flex justify-between items-center lg:py-0 py-2 bg-white shadow-[2px_0px_6px_rgb(0,0,0,0.5)]">
        <img
          src={logoNav}
          alt="logo"
          className="w-[40px] h-[40px] cursor-pointer"
          onClick={() => navigate("/home")}
        />

        <img src={logoLetra} alt="logo" className="w-[180px] lg:hidden" />

        <GiHamburgerMenu
          onClick={handleToggleNavbar}
          className="lg:hidden flex-none"
          size={26}
        />

        <div className="hidden lg:flex items-center w-auto " id="menu">
          <nav>
            <ul className="lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0">
              <li>
                <NavLink
                  className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                  to={"/home"}
                >
                  Inicio
                </NavLink>
              </li>

              {mostrarGastos ? (
                <li>
                  <NavLink
                    className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                    to={"/gastos-diarios"}
                  >
                    Gastos Diarios
                  </NavLink>
                </li>
              ) : null}

              {mostrarEstadisticas ? (
                <li>
                  <NavLink
                    className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                    to={"/estadisticas"}
                  >
                    Estadisticas
                  </NavLink>
                </li>
              ) : null}

              <li>
                <button
                  type="button"
                  className="bg-[#8131bd] w-fit px-2 font-semibold text-white py-1 rounded-3xl flex justify-center items-center min-w-[80px]"
                  onClick={handleLogout}
                  disabled={isLogouting}
                >
                  <BiSolidLogOut className="mr-2" size={16} />
                  {isLogouting ? (
                    <MoonLoader size={20} color="#ffffff" />
                  ) : (
                    "Salir"
                  )}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {toggleNavbar ? (
        <div
          className={`z-30 w-[95%] flex flex-col pt-4 px-7 h-[600px] bg-white mt-[60px] fixed animate__animated ${
            animationNavbar ? "animate__fadeInLeft" : "animate__fadeOutLeft"
          } `}
        >
          {
            <>
              <NavLink
                to="/home"
                className={`w-full flex items-center px-5 font-semibold text-lg py-3 rounded-3xl ${
                  ruta === "/home" ? "bg-[#8131bd] text-white" : ""
                }`}
              >
                <AiFillHome className="mr-2" size={25} />
                Inicio
              </NavLink>

              {mostrarGastos ? (
                <NavLink
                  to="/gastos-diarios"
                  className={`w-full flex items-center px-5 font-semibold text-lg py-3 rounded-3xl ${
                    ruta === "/gastos-diarios" ? "bg-[#8131bd] text-white" : ""
                  }`}
                >
                  <FaMoneyCheckDollar className="mr-2" size={25} />
                  Gastos diarios
                </NavLink>
              ) : null}

              {mostrarEstadisticas ? (
                <NavLink
                  to="/estadisticas"
                  className={`w-full flex items-center px-5 font-semibold text-lg py-3 rounded-3xl ${
                    ruta === "/estadisticas" ? "bg-[#8131bd] text-white" : ""
                  }`}
                >
                  <FcStatistics
                    className="mr-2 filter grayscale saturate-200"
                    size={25}
                  />
                  Estadisticas
                </NavLink>
              ) : null}

              <button
                type="button"
                className="bg-[#8131bd] text-lg mt-4 w-fit px-5 font-semibold text-white py-3 rounded-3xl flex justify-center items-center min-w-[80px]"
                onClick={handleLogout}
                disabled={isLogouting}
              >
                <BiSolidLogOut className="mr-2" size={25} />
                {isLogouting ? (
                  <MoonLoader size={20} color="#ffffff" />
                ) : (
                  "Cerrar Sesion"
                )}
              </button>
            </>
          }
        </div>
      ) : null}
    </>
  );
};
