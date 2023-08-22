import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import generarId from '../utils/autoId'
import styled from 'styled-components'
import toast, { Toaster } from 'react-hot-toast'

export default function FormProducto(props) {
  const { auxiliar } = props
  const { productos, agregarProducto, caracteristicas, agregarCaracteristica } =
    useContext(ElementosGlobales)
  const [nombre, setNombre] = useState('')
  const [shortDescripcion, setShortDescripcion] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoriaID, setCategoriaId] = useState('1')
  const [categoria, setCategoria] = useState('Pelota')

  // estados de el cargador de imagenes de galeria
  const [coverImageFile, setCoverImageFile] = useState([])
  const [galleryImagesFiles, setGalleryImagesFiles] = useState([])
  const [coverImage, setCoverImage] = useState()
  const [galleryImages, setGalleryImages] = useState([])
  const [coverImageError, setCoverImageError] = useState(false)
  const [galleryImageError, setgalleryImageError] = useState(false)

  // estados de la caracteristicas
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState([])
  const [selectedCaracteristicaId, setSelectedCaracteristicaId] = useState('')
  const [selectedCaracteristicasIds, setSelectedCaracteristicasIds] = useState(
    []
  )

  //estados de los errores
  const [nombreError, setNombreError] = useState(false)
  const [shortDescripcionError, setShortDescripcionError] = useState(false)
  const [descripcionError, setDescripcionError] = useState(false)
  const [caracteristicasError, setCaracteristicasError] = useState(false)
  const [validationsPassed, setValidationsPassed] = useState(false)

  const changeNombre = e => {
    setNombre(e.target.value)
  }

  const changeDescripcion = e => {
    setDescripcion(e.target.value)
  }

  const changeShortDescripcion = e => {
    setShortDescripcion(e.target.value)
  }
  const handleGalleryImageChange = e => {
    const files = e.target.files
    setGalleryImagesFiles(files)
    if (files.length > 4) {
      toast.error('Solo puedes seleccionar hasta 4 imágenes')
      setGalleryImages([])
      setCoverImageError(true)
    } else if (files.length === 0) {
      toast.error(
        'El producto debe tener al menos una imagen para su galeria. Selecciona una.'
      )
      setGalleryImages([])
      setCoverImageError(true)
    } else {
      const newImages = Array.from(files)
      setGalleryImages(newImages)
      setCoverImageError(false)
    }
  }

  const handleCoverImageChange = e => {
    const files = e.target.files
    setCoverImageFile(files)
    if (files.length > 1) {
      toast.error('Solo puedes seleccionar 1 imagen')
      setCoverImageError(true)
    } else if (files.length === 0) {
      toast.error('El producto debe tener imagen de portada. Selecciona una.')
      setCoverImageError(true)
    } else {
      const newImage = files[0] // Tomar solo la primera imagen
      setCoverImage(newImage)
      setCoverImageError(false)
    }
  }

  const handleCategoriaChange = e => {
    const selectedCategory = e.target.value
    setCategoria(selectedCategory)

    switch (selectedCategory) {
      case 'Pelota':
        console.log('entro')
        setCategoriaId('1')
        break
      case 'Cancha':
        setCategoriaId('2')
        break
      case 'Clases':
        setCategoriaId('3')
        break
      default:
        setCategoriaId('1')
        break
    }
  }

  useEffect(() => {
    let allValid = true

    if (nombre === '') {
      setNombreError(true)
    } else {
      setNombreError(false)
    }
    if (shortDescripcion === '') {
      allValid = false
      setShortDescripcionError(true)
    } else {
      setShortDescripcionError(false)
    }
    if (descripcion === '') {
      allValid = false
      setDescripcionError(true)
    } else {
      setDescripcionError(false)
    }
    if (selectedCaracteristicas.length !== 3) {
      setCaracteristicasError(true)
    } else {
      setCaracteristicasError(false)
    }

    if (coverImageFile.length === 0) {
      allValid = false
      setCoverImageError(true)
    } else {
      setCoverImageError(false)
    }
    if (galleryImagesFiles.length === 0) {
      allValid = false
      setgalleryImageError(true)
    } else {
      setgalleryImageError(false)
    }
    setValidationsPassed(allValid)
    console.log(productos)
  }, [
    nombre,
    shortDescripcion,
    descripcion,
    selectedCaracteristicas,
    coverImageFile,
    galleryImagesFiles,
    productos
  ])

  //armado para en envio del json/post

  const handleSubmit = e => {
    e.preventDefault()
    if (!validationsPassed) {
      toast.error(
        'Surgieron uno mas errores al completar el formulario, por favor verifica todos los campos'
      )
    } else {
      agregarProducto({
        id: generarId(),
        name: nombre,
        shortDescription: shortDescripcion,
        description: descripcion,
        category: categoriaID,
        caracteristicas: selectedCaracteristicasIds,
        image: [coverImage, ...galleryImages]
      })
      setNombre('')
      setShortDescripcion('')
      setDescripcion('')
      toast.success('Producto agregado correctamente')
    }
  }

  // funciones de caracteristicas
  const addSelectedCaracteristica = () => {
    // Buscar la caracteristica seleccionada con el id en el array de caracteristicas
    const caracteristica = caracteristicas.find(
      caracteristica => caracteristica.id == selectedCaracteristicaId
    )

    // Verificar que la caracteristica no este ya seleccionada
    const alreadySelected = selectedCaracteristicas.find(
      caracteristica => caracteristica.id == selectedCaracteristicaId
    )
    //verificar que se hayan seleccionado maximo 3 caracteristicas
    const maximoCaracteristicas = selectedCaracteristicas.length === 3

    if (caracteristica && !alreadySelected && !maximoCaracteristicas) {
      setSelectedCaracteristicas(prevSelected => [
        ...prevSelected,
        caracteristica
      ])
      setSelectedCaracteristicasIds(prevSelected => [
        ...prevSelected,
        caracteristica.id
      ])
      setSelectedCaracteristicaId('')
    } else if (alreadySelected) {
      toast.error('Ya has seleccionado esta característica')
    } else if (maximoCaracteristicas) {
      toast.error('Solo puedes seleccionar hasta 3 características')
    }
  }

  const removeSelectedCaracteristica = caracteristicaId => {
    // Filtrar y borrar la caracteristica que se saca del array
    const updatedSelectedCaracteristicas = selectedCaracteristicas.filter(
      caracteristica => caracteristica.id !== caracteristicaId
    )

    // Filtrar y borrar el id de la caracteristica que se saca del array
    const updatedSelectedCaracteristicasIds = selectedCaracteristicasIds.filter(
      id => id !== caracteristicaId
    )
    setSelectedCaracteristicasIds(updatedSelectedCaracteristicasIds)

    setSelectedCaracteristicas(updatedSelectedCaracteristicas)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <ContenedorRecuadro>
        {/* Nombre del producto */}
        <label>Agregue el nombre del producto</label>
        <input
          type='text'
          placeholder='Nombre del producto.'
          onChange={changeNombre}
        />
        {/* mensaje de error */}
        {nombreError && (
          <p className='requisitos-input'>
            <span>Requisito:</span> El nombre del producto no puede estar vacio
          </p>
        )}

        {/* Descripcion corta */}
        <label>Agregue la descripción corta del producto</label>
        <input
          type='text'
          placeholder='Descripción corta del producto.'
          onChange={changeShortDescripcion}
        />
        {/* mensaje de error */}
        {shortDescripcionError && (
          <p className='requisitos-input'>
            <span>Requisito:</span> La descripción corta no puede estar vacia
          </p>
        )}
        <label>Agregue la descripción del producto</label>

        {/* Descripcion larga */}
        <input
          type='text'
          placeholder='Descripción del producto.'
          onChange={changeDescripcion}
        />
        {/* mensaje de error */}
        {descripcionError && (
          <p className='requisitos-input'>
            <span>Requisito:</span> La descripción no puede estar vacia
          </p>
        )}
      </ContenedorRecuadro>

      <ContenedorRecuadro>
        {/* Seleccionar categoria */}
        <label>Seleccione la categoria del producto</label>
        <select value={categoria} onChange={handleCategoriaChange}>
          <option value='Pelota'>Pelota</option>
          <option value='Cancha'>Cancha</option>
          <option value='Clases'>Clases</option>
        </select>
      </ContenedorRecuadro>

      {/* Seleccionar caracteristica */}

      {/* Input para elegir características */}
      {/* Input para elegir características */}
      <ContenedorRecuadro>
        <div className='contenedor-agregar-caracteristica'>
          <label>Selecciona características:</label>
          <select
            value={selectedCaracteristicaId}
            onChange={e => setSelectedCaracteristicaId(e.target.value)}
          >
            <option value='' disabled>
              Elige una característica
            </option>
            {caracteristicas.map(caracteristica => (
              <option key={caracteristica.id} value={caracteristica.id}>
                {caracteristica.emoji} {caracteristica.texto}
              </option>
            ))}
          </select>
          <button type='button' onClick={addSelectedCaracteristica}>
            Agregar Característica
          </button>
        </div>

        {/* Contenedor para mostrar características seleccionadas */}
        {/* Si no hay caracteristicas seleccionadas mostrar un <p> que diga no hay caractersiticas selccionadas, si no, mostrar un <p> que diga: caracteristicas seleccionadas */}
        {selectedCaracteristicas.length === 0 ? (
          <div className='message-caracteristicas'>
            <p>No hay características seleccionadas</p>
          </div>
        ) : (
          <SelectedCaracteristicasContainer>
            {selectedCaracteristicas.map(caracteristica => (
              <SelectedCaracteristica key={caracteristica.id}>
                {caracteristica.emoji} {caracteristica.texto}
                <RemoveButton
                  onClick={() =>
                    removeSelectedCaracteristica(caracteristica.id)
                  }
                >
                  x
                </RemoveButton>
              </SelectedCaracteristica>
            ))}
          </SelectedCaracteristicasContainer>
        )}
        {/* mensaje de error */}
        {caracteristicasError && (
          <p className='requisitos-input'>
            <span>Requisito:</span> El producto debe tener tres (3)
            caracteristicas
          </p>
        )}
      </ContenedorRecuadro>

      {/* Carga de imagenes */}
      <ContenedorRecuadro>
        <Container>
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
          {coverImageError && (
            <p className='requisitos-input'>
              <span>Requisito:</span> Debes seleccionar una (1) imágen
            </p>
          )}
          <ImagePreview>
            {coverImage && (
              <Image
                src={URL.createObjectURL(coverImage)}
                alt={`Imagen de portada del producto`}
              />
            )}
          </ImagePreview>
          <label htmlFor='imageInput'>
            <span>Requisito:</span> Selecciona cuatro (4) imágenes maximo
          </label>
          <input
            id='imageInput'
            type='file'
            accept='image/*'
            multiple
            onChange={handleGalleryImageChange}
          />
          <ImagePreview>
            {galleryImages.map((image, index) => (
              <Image
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Image ${index}`}
              />
            ))}
          </ImagePreview>
          {galleryImageError && (
            <p className='requisitos-input'>
              <span>Requisito:</span> Debes seleccionar almenos cuatro (4)
              imágenes
            </p>
          )}
        </Container>
      </ContenedorRecuadro>
      <button type='submit'>Agregar Producto</button>
      <Toaster position='top-center' reverseOrder={false} />
    </Form>
  )
}

const Form = styled.form`
  font-size: 1.5rem;
  margin: 0rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  //estilos para los errores

  p.requisitos-input {
    span {
      color: ${props => props.theme.global.greyF4u};
      font-size: 1rem;
      font-weight: bolder;
    }
    color: ${props => props.theme.global.redF4u};
    font-size: 1rem;
    font-weight: bolder;
  }

  input {
    font-size: 1.5rem;
    border-radius: 0.1rem;
  }
  /* botones del form */
  button,
  select {
    font-size: 2rem;
    border: white solid 1px;

    font-size: 1rem;
    padding: 8px;
    color: white;
    background-color: ${props => props.theme.global.greyF4u};
    transition: color 0.6s;
    border-radius: 2rem;
  }

  /* contenedor que tiene el select y el boton */

  .contenedor-agregar-caracteristica {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  /* contenedor del mensaje de caracteristicas */
  .message-caracteristicas {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`
const ImagePreview = styled.div`
  display: flex;
  gap: 3rem;
  margin-top: 10px;
`

const Image = styled.img`
  max-width: 100px;
  max-height: 100px;
  border: 1px solid black;
`
// estilos caracteristicas
const SelectedCaracteristicasContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`

const SelectedCaracteristica = styled.div`
  display: flex;
  align-items: center;
  color: white;
  background-color: ${props => props.theme.global.greyF4u};
  transition: color 0.6s;
  border-radius: 2rem;
`

const RemoveButton = styled.button`
  background-color: ${props => props.theme.global.redF4u} !important;
  color: white;
  border: none !important;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 0.5rem;
  padding: 0.25rem;
  font-size: 1rem;
`
export const ContenedorRecuadro = styled.div`
  background-color: ${props => props.theme.global.lightGreyF4u} !important;
  border-radius: 2rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;

  gap: 1rem;
`
