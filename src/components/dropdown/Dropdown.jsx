import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { ElementosGlobales } from "../../context/ElementosGlobales";
import { AiFillHeart } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { TbCalendarStats } from "react-icons/tb";

const Dropdown = (props) => {
  const dropdownRef = useRef(null);
  const { setShowDropdown } = useContext(ElementosGlobales);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowDropdown]);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };

  return (
    <DropdownMenu ref={dropdownRef}>
      <DropdownContent $isOpen={props.isOpen}>
        <span className="userName">¡Hola {props.userName}!</span>
        <MenuItem to={"/productosFavoritos"}>
          <span>
            <AiFillHeart />
          </span>{" "}
          <span className="itemName">Productos Favoritos</span>
        </MenuItem>
        <MenuItem to={"/administracion/administrarDatosPersonales"}>
          <span>
            <FaUser />
          </span>{" "}
          <span className="itemName">Datos Personales</span>
        </MenuItem>
        {props.rol === "admin" && (
          <MenuItem to={"/administracion"}>
            <span>
              <RiAdminFill />
            </span>{" "}
            <span className="itemName">Panel de Admin</span>
          </MenuItem>
        )}
        <MenuItem to={"reservas/VerMisReservas"}>
          <span>
            <TbCalendarStats />
          </span>{" "}
          <span className="itemName">Mis Reservas</span>
        </MenuItem>
        <MenuItem to={"/"} onClick={userSignOut}>
          <span>
            <BiLogOut />
          </span>{" "}
          <span className="itemName">Cerrar Sesión</span>
        </MenuItem>
      </DropdownContent>
    </DropdownMenu>
  );
};

const DropdownMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: 44px;
  left: -188px;
  background-color: ${(props) => props.theme.global.greyF4u};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
  width: 200px;
  padding: 1rem;

  @media (min-width: 768px) {
    left: -127px;
  }

  span.userName {
    color: #e2e2e2;
  }
`;

const MenuItem = styled(Link)`
  text-decoration: none;
  color: #ffffff;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;

  span.itemName {
    border-bottom: 1px solid #ffffff;
  }
`;

export default Dropdown;
