import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import styled from 'styled-components'

// Define el estilo del botón de WhatsApp usando Styled Components
const WhatsAppButtonWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  right: 10px;
  z-index: 1000;

  @media (min-width: 768px) {
    right: 45px;
  }
`

const WhatsAppIcon = styled.div`
  background-color: #25d366; /* Color verde de WhatsApp */
  color: #fff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 24px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.6s;

  &:hover {
    background-color: #128c7e; /* Color de resalte al pasar el mouse */
  }
`

export default function WhatsAppButton({ phoneNumber, nombreProducto }) {
  const sendMessage = () => {
    const whatsappURL = !nombreProducto
      ? `https://wa.me/${phoneNumber}?text=¡Hola Fulbo4u! Me gustaria hacerte unas consultas sobre el sitio web.`
      : `https://wa.me/${phoneNumber}?text=¡Hola Fulbo4u! Me gustaria hacerte unas consultas sobre el producto ${nombreProducto}.`
    window.open(whatsappURL, '_blank')
  }

  return (
    <WhatsAppButtonWrapper>
      <WhatsAppIcon
        onClick={sendMessage}
        alt='Iniciar conversacion en Whatsapp'
      >
        <FaWhatsapp />
      </WhatsAppIcon>
    </WhatsAppButtonWrapper>
  )
}
