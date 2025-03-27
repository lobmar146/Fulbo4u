import { useRef, useEffect, useCallback, useState } from 'react'

import { useSpring, animated } from 'react-spring'
import styled from 'styled-components'
import { MdClose } from 'react-icons/md'
import { useContext } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import toast, { Toaster } from 'react-hot-toast'

import axios from 'axios'

export const Modal = props => {
  const { getDisponibilidadesNOTOAST } = useContext(ElementosGlobales)
  const [converImageFile, setCoverImageFile] = useState([])
  const [coverImageError, setCoverImageError] = useState(false)
  const [date, setDate] = useState('')
  const [hour, setHour] = useState('08:00 a 10:00 hs')
  const { showmodal, setshowmodal, idProducto } = props

  const handledateChange = event => {
    setDate(event.target.value)
  }
  const handlehourChange = event => {
    setHour(event.target.value)
  }

  //Post a disponibilidad a el endpoint http://18.208.174.132:8080/api/bookings/create
  async function postDisponibilidad() {
    const idToast = toast.loading(`Agregando la nueva disponibilidad...`, {
      style: {
        'font-size': '1.5rem'
      }
    })

    //pasar el formato del date de yyyy-mm-dd a dd-mm-yyyy

    const formData = new FormData()
    formData.append('userUID', ' ')
    formData.append('idProduct', idProducto)
    formData.append('fecha', date)
    formData.append('hora', hour)
    formData.append('disponibilidad', true)
    formData.append('nombreAutorizado', ' ')
    formData.append('correoAutorizado', ' ')
    formData.append('telefonoAutorizado', ' ')
    console.log(formData)

    try {
      const response = await axios.post(
        'http://18.208.174.132:8080/api/bookings/create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log(response.data)
      toast.success('Disponibilidad agregada correctamente', { id: idToast })
      getDisponibilidadesNOTOAST()
    } catch (error) {
      console.log(error)
      toast.error(
        'Surgio el siguiente error agregando la disponibilidad' + error,
        {
          id: idToast
        }
      )
    }
  }

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
    console.log(date)
    console.log(hour)
    console.log(idProducto)
    postDisponibilidad()

    setshowmodal(false)
    setDate('')
    setHour('')
  }

  return (
    <>
      {showmodal ? (
        <Background onClick={closeModal} ref={modalRef}>
          <animated.div style={animation}>
            <ModalWrapper showmodal={showmodal}>
              {/* <ModalImg src={require('./modal.jpg')} alt='camera' /> */}
              <ModalContent>
                <h2>Agregar una nueva Disponibilidad</h2>
                {/* formulario para agregar una caracteristica con los campos emoji y texto y un boton para enviar esos datos */}
                <h3>
                  Selecciona la fecha y la hora de la nueva disponibilidad
                </h3>
                <form>
                  <ContenedorVertical>
                    <label>Agregue la fecha </label>
                    <input
                      type='date'
                      id='date'
                      name='date'
                      value={date}
                      onChange={handledateChange}
                      format={'dd-mm-yyyy'}
                    />
                  </ContenedorVertical>
                  <ContenedorVertical>
                    <label htmlFor='hour'>Seleccione la hora</label>
                    <select value={hour} onChange={handlehourChange}>
                      <option value='08:00 a 10:00 hs'>08:00 a 10:00 hs</option>
                      <option value='10:00 a 12:00 hs'>10:00 a 12:00 hs</option>
                      <option value='12:00 a 14:00 hs'>12:00 a 14:00 hs</option>
                      <option value='14:00 a 16:00 hs'>14:00 a 16:00 hs</option>
                      <option value='16:00 a 18:00 hs'>16:00 a 18:00 hs</option>
                    </select>
                  </ContenedorVertical>

                  <button
                    onClick={handleSubmit}
                    type='submit'
                    className='button'
                  >
                    Agregar Disponibilidad
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
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;
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
      width: auto;
      font-size: 1.5rem !important;
      border: white solid 1px;
      background-color: ${props => props.theme.global.greyF4u};
      color: white;
      font-size: 1rem;
      transition: color 0.6s;
      border-radius: 2rem;
      text-align: center;
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
