import React from 'react'
import { FaVolumeUp } from 'react-icons/fa'
import styled from 'styled-components'

const Button = styled.button`
  background-color: ${props => props.theme.global.redF4u};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 20px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  transition: background-color 0.6s;

  &:hover {
    background-color: ${props => props.theme.global.greyF4u};
  }
`

const TextToSpeechButton = ({ textToSpeak }) => {
  const handleButtonClick = e => {
    e.stopPropagation()
    // Utiliza la API de síntesis de voz del navegador para leer el texto
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      synthesis.speak(utterance)
    }
  }

  return (
    <Button onClick={handleButtonClick} lang='es'>
      <FaVolumeUp size={20} style={{ marginRight: '8px' }} />
      Leer
    </Button>
  )
}

export default TextToSpeechButton
