import { useRef, useEffect, useCallback, useState } from 'react'

import { useSpring, animated } from 'react-spring'
import styled from 'styled-components'
import { MdClose } from 'react-icons/md'
import generarId from '../../components/utils/autoIdTags'
import { useContext } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import toast, { Toaster } from 'react-hot-toast'

export const Modal = props => {
  const emojis = [
    '♿️',
    '🛠️',
    '🏛️',
    '🚻',
    '🔌',
    '🌞',
    '🌳',
    '🏞️',
    '🏕️',
    '🌄',
    '🚴',
    '⚽',
    '🏀',
    '🎾',
    '🏊',
    '🏋️',
    '🏃‍♂️',
    '🔄'
  ]
  const [selectedEmoji, setSelectedEmoji] = useState('♿️')
  const [selectedText, setSelectedText] = useState('')
  const handleEmojiChange = event => {
    setSelectedEmoji(event.target.value)
    console.log(selectedEmoji)
  }

  //Post caracteristica a el endpoint http://18.208.174.132:8080/api/caracteristicas
  async function postCaracteristica(caracteristica) {
    const body = {
      emoji: selectedEmoji,
      name: selectedText
    }
    const response = await fetch(
      'http://18.208.174.132:8080/api/caracteristicas',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )
    const data = await response.json()
    console.log(data)
    getCaracteristicas()
  }

  const { getCaracteristicas } = useContext(ElementosGlobales)

  const handleTextChange = event => {
    setSelectedText(event.target.value)
    console.log(selectedText)
  }
  const { showmodal, setshowmodal } = props
  const modalRef = useRef()

  const animation = useSpring({
    config: {
      duration: 250
    },
    opacity: showmodal ? 1 : 0,
    transform: showmodal ? `translateY(0%)` : `translateY(-100%)`
  })

  const closeModal = e => {
    if (modalRef.current === e.target) {
      setshowmodal(false)
    }
  }

  const keyPress = useCallback(
    e => {
      if (e.key === 'Escape' && showmodal) {
        setshowmodal(false)
        console.log('I pressed')
      }
    },
    [setshowmodal, showmodal]
  )

  useEffect(() => {
    document.addEventListener('keydown', keyPress)
    return () => document.removeEventListener('keydown', keyPress)
  }, [keyPress])

  function handleSubmit(e) {
    e.preventDefault()
    if (!selectedText || selectedText.length <= 3) {
      toast.error(
        'Debe ingresar un nombre para la caracteristica de al menos 3 caracteres',
        {
          style: {
            'font-size': '1.5rem'
          }
        }
      )
    } else {
      postCaracteristica()
      toast.success('Caracteristica agregada correctamente.', {
        style: {
          'font-size': '1.5rem'
        }
      })
      setshowmodal(false)
      setSelectedText('')
    }
  }

  return (
    <>
      {showmodal ? (
        <Background onClick={closeModal} ref={modalRef}>
          <animated.div style={animation}>
            <ModalWrapper showmodal={showmodal}>
              {/* <ModalImg src={require('./modal.jpg')} alt='camera' /> */}
              <ModalContent>
                <h2>Agregar una nueva caracteristica</h2>
                {/* formulario para agregar una caracteristica con los campos emoji y texto y un boton para enviar esos datos */}
                <h3>Selecciona el emoji y texto de la nueva categoria</h3>
                <form>
                  <ContenedorVertical>
                    <label htmlFor='emojiSelect'> Elija su emoji</label>
                    <select
                      id='emojiSelect'
                      value={selectedEmoji}
                      onChange={handleEmojiChange}
                    >
                      {emojis.map(emoji => (
                        <option key={emoji} value={emoji}>
                          {emoji}
                        </option>
                      ))}
                    </select>
                  </ContenedorVertical>
                  <ContenedorVertical>
                    <label htmlFor='texto'>
                      Elija el nombre de la caracteristica
                    </label>
                    <input
                      type='text'
                      id='texto'
                      name='texto'
                      value={selectedText}
                      onChange={handleTextChange}
                    />
                  </ContenedorVertical>
                  <button
                    onClick={handleSubmit}
                    type='submit'
                    className='button'
                  >
                    Agregar caracteristica
                  </button>
                </form>
              </ModalContent>
              <CloseModalButton
                aria-label='Close modal'
                onClick={() => setshowmodal(prev => !prev)}
              />
            </ModalWrapper>
          </animated.div>
        </Background>
      ) : null}
    </>
  )
}

const ContenedorVertical = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0; /* Anchor to the top of the viewport */
  left: 0; /* Anchor to the left of the viewport */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalWrapper = styled.div`
  /* width: */

  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  z-index: 10;
  border-radius: 10px;
  padding: 2rem 2rem;
`

const ModalImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px 0 0 10px;
  background: #000;
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #141414;

  p {
    margin-bottom: 1rem;
  }

  button {
    padding: 10px 24px;
    background: #141414;
    color: #fff;
    border: none;
  }
  form {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: flex-start;
    gap: 1.5rem;
    font-size: 3rem;
    background-color: ${props => props.theme.global.lightGreyF4u} !important;
    border-radius: 2rem;
    padding: 1rem;
    font-weight: bolder;
    input {
      font-size: 1.5rem;
      border-radius: 0.1rem;
      background-color: ${props => props.theme.global.greyF4u};
      color: white;
    }
    select {
      font-size: 1.5rem !important;
      border: white solid 1px;
      background-color: ${props => props.theme.global.greyF4u};

      font-size: 1rem;
      transition: color 0.6s;
      border-radius: 2rem;
      text-align: center;
      width: 4rem;
      text-shadow: 0px 0px 2px white; /* Contorno blanco */
    }
    option {
      width: 1rem;
      text-shadow: 0px 0px 2px white; /* Contorno blanco */
    }

    label {
      font-size: 1.5rem;
    }
    h3 {
      font-size: 1.5rem;
    }
  }
`

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`
