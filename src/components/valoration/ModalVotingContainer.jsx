import React, { useContext, useEffect } from "react";
import { ElementosGlobales } from "../../context/ElementosGlobales";
import styled from "styled-components";
import { ModalVoting } from "./ModalVoting";
import ReactStars from "react-rating-stars-component";
import { FormVoting } from "./FormVoting";

export const ModalVotingContainer = () => {
  const { showModalVoting, setShowModalVoting, handleScrollOnModalShow } =
    useContext(ElementosGlobales);

  useEffect(() => {
    handleScrollOnModalShow(showModalVoting);
  }, [showModalVoting]);

  const closeModaVoting = () => {
    setShowModalVoting(false);
  };

  const ratingChanged = (newRating) => {
    console.log(newRating);
  };

  return (
    <div>
      {showModalVoting && (
        <Background>
          <ModalVoting isOpen={showModalVoting} onClose={closeModaVoting}>
            <ModalContent>
              <h2>¡Queremos conocer tu experiencia con el producto!</h2>
              <FormVoting />
            </ModalContent>
          </ModalVoting>
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
  align-items: center;
  gap: 0.5rem;
`;
