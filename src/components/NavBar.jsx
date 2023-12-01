import { NavLink, useLocation } from "react-router-dom";
import logoNav from "../images/logonav.png";
import { useState } from "react";
import logoLetra from "../images/logoLetra.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImUsers } from "react-icons/im";
import { AiFillHome } from "react-icons/ai";

export const Navbar = () => {
  const [toggleNavbar, setToggleNavbar] = useState(false);
  const [animationNavbar, setAnimationNavbar] = useState(false);

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

  return (
    <>
      <div className="fixed w-full lg:px-16 px-6 flex justify-between items-center lg:py-0 py-2 bg-white shadow-[2px_0px_6px_rgb(0,0,0,0.5)]">
        <img src={logoNav} alt="logo" className="w-[40px] h-[40px]" />

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
                  to={"/usuarios"}
                >
                  Features
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                  to={"/usuarios"}
                >
                  Pricing
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                  to={"/usuarios"}
                >
                  Documentation
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400 lg:mb-0 mb-2"
                  to={"/usuarios"}
                >
                  Support
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {toggleNavbar ? (
        <div
          className={`w-[95%] flex flex-col pt-4 px-7 h-[600px] bg-white mt-[60px] fixed animate__animated ${
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

              <NavLink
                to="/trabajadores"
                className={`w-full flex items-center px-5 font-semibold text-lg py-3 rounded-3xl ${
                  ruta === "/trabajadores" ? "bg-[#8131bd] text-white" : ""
                }`}
              >
                <ImUsers className="mr-2" size={25} />
                Trabajadores
              </NavLink>
            </>
          }
        </div>
      ) : null}
    </>
  );
};
