import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Modal = (props) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        props.onClose();
      }
    };

    if (props.isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [props.isOpen, props.onClose]);

  if (!props.isOpen) return null;

  return (
    <Background>
      <ModalContainer ref={modalRef}>{props.children}</ModalContainer>
    </Background>
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

const ModalContainer = styled.div`
  width: 300px;
  height: 320px;
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 1100;

  @media (min-width: 768px) {
    width: 500px;
  }
`;

export default Modal;
