import React from "react";
import styled from "styled-components";

export const ModalVoting = (props) => {
  return (
    <Background>
      <ModalVotingContainer>{props.children}</ModalVotingContainer>
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

const ModalVotingContainer = styled.div`
  width: 300px;
  height: 320px;
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 1100;

  @media (min-width: 768px) {
    width: 700px;
    height: auto;
  }
`;
