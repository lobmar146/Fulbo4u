import { useRef, useEffect, useCallback, useState } from 'react'

import { useSpring, animated } from 'react-spring'
import styled from 'styled-components'
import { MdClose } from 'react-icons/md'
import generarId from '../../components/utils/autoIdTags'
import { useContext } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import toast, { Toaster } from 'react-hot-toast'

import axios from 'axios'

export const Modal = props => {
  const [converImageFile, setCoverImageFile] = useState([])
  const [coverImageError, setCoverImageError] = useState(false)
  const [name, setName] = useState('')
  const [detail, setDetail] = useState('')

  const handleNameChange = event => {
    setName(event.target.value)
  }
  const handleDetailChange = event => {
    setDetail(event.target.value)
  }

  const handleCoverImageChange = e => {
    const files = e.target.files

    if (files.length > 1) {
      toast.error('Solo puedes seleccionar 1 imagen')
      setCoverImageError(true)
    } else if (files.length === 0) {
      toast.error('El producto debe tener imagen de portada. Selecciona una.')
      setCoverImageError(true)
    } else {
      const newImage = files[0]
      setCoverImageFile(newImage)
      setCoverImageError(false)
    }
  }

  //Post categoria a el endpoint http://18.208.174.132:8080/api/category/create-category
  async function postCategoria() {
    const idToast = toast.loading(`Agregando la categoria ${name}...`, {
      style: {
        'font-size': '1.5rem'
      }
    })
    const formData = new FormData()
    formData.append('name', name)
    formData.append('imageFiles', converImageFile)
    formData.append('detail', detail)

    try {
      const response = await axios.post(
        'http://18.208.174.132:8080/api/category/create-category',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log(response.data)
      toast.success('¡Producto agregado correctamente', { id: idToast })
    } catch (error) {
      console.log(error)
      toast.error('Surgio el siguiente error agregando productos', {
        id: idToast
      })
    }

    getCategorias()
  }

  const { categorias, getCategorias } = useContext(ElementosGlobales)

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
    if (!converImageFile) {
      toast.error('Debe seleccionar una imagen de portada para el producto.', {
        style: {
          'font-size': '1.5rem'
        }
      })
    } else if (converImageFile.length > 1) {
      toast.error('Solo puedes seleccionar 1 imagen', {
        style: {
          'font-size': '2rem'
        }
      })
    } else if (!name || name.length <= 3) {
      toast.error(
        'Debe ingresar un nombre para la caracteristica de al menos 3 caracteres',
        {
          style: {
            'font-size': '1.5rem'
          }
        }
      )
    } else if (!detail || detail.length <= 3) {
      toast.error(
        'Debe ingresar un detalle para la caracteristica de al menos 3 caracteres',
        {
          style: {
            'font-size': '1.5rem'
          }
        }
      )
    } else {
      postCategoria()

      setshowmodal(false)
      setName('')
      setDetail('')
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
                <h2>Agregar una nueva Categoría</h2>
                {/* formulario para agregar una caracteristica con los campos emoji y texto y un boton para enviar esos datos */}
                <h3>
                  Selecciona la imagen, el nombre y el detalle de la categoría
                </h3>
                <form>
                  <ContenedorVertical>
                    <label htmlFor='imageInput'>
                      Seleccione una (1) imágen de portada del producto
                    </label>
                    <input
                      id='imageInput'
                      type='file'
                      accept='image/*'
                      multiple
                      onChange={handleCoverImageChange}
                    />
                    {console.log(converImageFile[0])}
                  </ContenedorVertical>
                  <ContenedorVertical>
                    <label htmlFor='name'>
                      Elija el nombre de la Categoría
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={name}
                      onChange={handleNameChange}
                    />
                    <label htmlFor='detail'>
                      Elija la descripción de la Categoría
                    </label>
                    <input
                      type='text'
                      id='detail'
                      name='detail'
                      value={detail}
                      onChange={handleDetailChange}
                    />
                  </ContenedorVertical>

                  <button
                    onClick={handleSubmit}
                    type='submit'
                    className='button'
                  >
                    Agregar Categoría
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
