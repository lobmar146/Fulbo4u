import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { ElementosGlobales } from "../../context/ElementosGlobales";
import { Link } from "react-router-dom";
import { PiWarningCircleFill } from "react-icons/pi";

const ModalContainer = () => {
  const { showModal, setShowModal, modalMessage, handleScrollOnModalShow } =
    useContext(ElementosGlobales);

  useEffect(() => {
    handleScrollOnModalShow(showModal);
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {showModal && (
        <Background>
          <Modal isOpen={showModal} onClose={closeModal}>
            <ModalContent>
              <h2>¡Debes Iniciar Sesión!</h2>
              <p>Debes iniciar sesión para {modalMessage}</p>
              <PiWarningCircleFill size="7rem" className="icon" />
              <div className="buttons-container">
                <Link
                  to="/iniciarsesion"
                  onClick={closeModal}
                  className="login-button"
                >
                  Iniciar Sesión
                </Link>
                <button onClick={closeModal} className="close-button">
                  Cerrar
                </button>
              </div>
            </ModalContent>
          </Modal>
        </Background>
      )}
    </div>
  );
};

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    margin-top: 0;
    text-align: center;
  }

  .icon {
    color: #ffbb00;
  }

  .buttons-container {
    margin-top: 15px;
    display: flex;
    gap: 10px;
  }

  .login-button,
  .close-button {
    border-radius: 10px;
  }

  .login-button {
    padding: 1rem;
    text-decoration: none;
    color: ${(props) => props.theme.dark.text};
    background-color: ${(props) => props.theme.global.redF4u};
    transition: background-color 0.6s;
  }

  .login-button:hover {
    background-color: #86221d;
  }

  .close-button {
    cursor: pointer;
    border: none;
    color: ${(props) => props.theme.dark.text};
    background-color: ${(props) => props.theme.global.greyF4u};
    width: 100px;
    font-size: 15px;
    transition: background-color 0.6s;
  }

  .close-button:hover {
    background-color: ${(props) => props.theme.dark.primary};
  }
`;

export default ModalContainer;
