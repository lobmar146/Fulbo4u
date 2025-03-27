import { Link } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { ElementosGlobales } from "../../context/ElementosGlobales";
import { useContext } from "react";
import logo from "../../assets/Futbol4u-logo.svg";
import Dropdown from "../dropdown/Dropdown";

export default function Header() {
  const {
    user,
    userData,
    showDropdown,
    setShowDropdown,
    toggleDropdown,
    avatarGenerator,
  } = useContext(ElementosGlobales);
  const [clicked, setClicked] = useState(false);

  const [localUserData, setLocalUserData] = useState(userData);
  const [avatar, setAvatar] = useState("");
  const headerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        showDropdown &&
        headerRef.current &&
        !headerRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, setShowDropdown]);

  useEffect(() => {
    setLocalUserData(userData);
  }, [userData]);

  useEffect(() => {
    setAvatar(avatarGenerator(localUserData));
  }, [localUserData]);

  const handleClick = () => {
    setClicked(!clicked);
  };

  const closeMenu = () => {
    setClicked(false);
  };

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };

  return (
    <HeaderWrapper ref={headerRef}>
      {/* Contenedor logo del header */}
      <Link to="/">
        <div
          className="contenedor-logo"
          onClick={() => {
            closeMenu;
            setShowDropdown(false);
          }}
        >
          <img className="logo" src={logo} alt="logo" />
          <h1>FULBO4U</h1>
        </div>
      </Link>

      <div className={`nav-container ${clicked ? "active" : ""}`}>
        {user ? (
          <>
            {localUserData ? (
              <>
                {localUserData && localUserData.nombre && (
                  <span id="avatar" onClick={toggleDropdown}>
                    {avatar}
                  </span>
                )}
                <Dropdown
                  isOpen={showDropdown}
                  closeHeader={closeMenu}
                  userName={localUserData.nombre}
                  rol={localUserData.rol}
                />
              </>
            ) : (
              <span className="loadingMessage">Cargando...</span>
            )}
          </>
        ) : (
          <>
            <div className="buttons-container">
              <Link
                onClick={closeMenu}
                to="/registrarse"
                className="button linkHeader"
              >
                Crear Cuenta
              </Link>
              <Link
                onClick={closeMenu}
                to="/iniciarsesion"
                className="button linkHeader"
              >
                Iniciar Sesión
              </Link>
            </div>
          </>
        )}
      </div>
      {/* <div className="burger">
        <BurguerButton clicked={clicked} handleClick={handleClick} />
      </div> */}
      <BgDiv className={`initial ${clicked ? " active" : ""}`}></BgDiv>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  padding-right: 1rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5rem;
  width: 100%;
  height: 7rem;

  position: sticky;
  margin-top: 0;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${(props) => props.theme.global.redF4u};

  p {
    color: white;
  }

  .logo {
    width: 100%;
    height: 3.5rem;
  }

  h1 {
    color: white;
  }

  @media (min-width: 768px) {
    padding-right: 5rem;
  }

  .nav-container .linkHeader {
    color: white;
    padding: 0.5rem;
    text-decoration: none;
    border: 0.1rem solid white;
    border-radius: 5rem;
  }

  .nav-container {
    position: absolute;
    top: -700px;
    left: -2000px;
    margin-left: auto;
    margin-right: 2rem;
    text-align: center;

    .linkHeader {
      color: black;
      font-size: 1.5rem;
      display: block;
    }

    /* media query que trae el nav a posicion in */
    display: flex;
    align-items: center;
    position: initial;
    margin: 0.5rem;

    .linkHeader {
      display: inline;
      color: white;
      font-size: 1rem;
    }

    .buttons-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    .button {
      background-color: ${(props) => props.theme.global.greyF4u};
      border: none;
      width: 130px;
      transition: background-color 0.6s;
    }

    .button:hover {
      background-color: #000000;
    }

    /* estilos del cartel usuario bienvenido */
    .loadingMessage,
    #avatar {
      color: white;
    }

    #avatar {
      cursor: pointer;
      font-size: 20px;
      background-color: ${(props) => props.theme.global.greyF4u};
      padding: 20px;
      border-radius: 50%;
      text-transform: uppercase;
      transition: background-color 0.6s;
    }

    #avatar:hover {
      background-color: #242020;
    }
  }

  .nav-container.active {
    width: 100%;
    display: block;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    top: 317%;
    left: 0;
    right: 0;
    text-align: center;
    .linkHeader {
      color: white;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid white;
      margin-bottom: 2m;
    }
  }
  .burger {
    padding: 1rem;
    @media (min-width: 768px) {
      display: none;
    }
  }

  .contenedor-logo {
    margin-top: 4.6rem;
    display: flex;
    align-items: flex-start;
    margin-left: 2rem;
    img {
      position: relative;
      bottom: 2.3rem;
      width: 100%;
      height: 5.5rem;
    }
    @media (max-width: 768px) {
      h1 {
        display: none;
      }
    }
  }
`;
const BgDiv = styled.div`
  background-color: ${(props) => props.theme.global.redF4u};
  position: absolute;
  top: -1000px;
  left: -1000px;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: all 0.6s ease;

  &.active {
    border-radius: 0 0 80% 0;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
`;
