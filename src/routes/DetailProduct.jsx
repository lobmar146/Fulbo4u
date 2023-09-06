import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams, Link } from 'react-router-dom'
import { BsFillArrowRightSquareFill } from 'react-icons/bs'
import { ElementosGlobales } from '../context/ElementosGlobales'
import ProductGallery from '../components/product/ProductGallery'
import logo from '../assets/Futbol4u-logo.svg'
import { BsFillShareFill } from 'react-icons/bs'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa' // Logos redes

//Imports para la reserva
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast, { Toaster } from 'react-hot-toast'

import { FacebookShareButton } from 'react-share'

// helmet para agregar los metadatos a la hora de compartir
import { Helmet } from 'react-helmet'

export default function DetailProduct() {
  //estados de la reserva
  const [selectedDate, setSelectedDate] = useState('')
  const [buscarHorasDisponibles, setBuscarHorasDisponibles] = useState(false) //estado de la barra de busqueda
  const [selectedHour, setSelectedHour] = useState('8:00 a 10 hs') //estado de la hora seleccionada
  //estado para controlar visibilidad
  const [socialShareVisible, setSocialShareVisible] = useState(false)

  // Fechas que deseas desactivar (en formato JavaScript Date)
  const enabledDates = [
    new Date('2023-09-05'),
    new Date('2023-09-08'),
    new Date('2023-09-15'),
    new Date('2023-09-16'),
    new Date('2023-09-23'),
    new Date('2023-09-24')
  ]

  // Función para desactivar fechas

  const isDateDisabled = date => {
    const today = new Date()
    enabledDates.push(today)
    // Verifica si la fecha está en la lista de fechas desactivadas
    return enabledDates.some(
      disabledDate =>
        date.getFullYear() === disabledDate.getFullYear() &&
        date.getMonth() === disabledDate.getMonth() &&
        date.getDate() === disabledDate.getDate()
    )
  }
  const validarFecha = () => {
    if (selectedDate === '') {
      toast.error(`Debe seleccionar una fecha`, {
        style: { 'font-size': '1.5rem' }
      })
    } else {
      toast.success(
        `Mostrando horarios disponibles para el día ${selectedDate} `,
        {
          style: { 'font-size': '1.5rem' }
        }
      )

      setBuscarHorasDisponibles(true)
    }
  }

  const { productos, caracteristicas } = useContext(ElementosGlobales)
  const [productoPorId, setProductoPorId] = useState({})

  const params = useParams()

  //esto deberia fetchearse a futturo

  useEffect(() => {
    window.scrollTo(0, 0)
    //esto deberia ser la funcion de fetch, aca ni bien se monta el componente se hacen los siguientes pasos

    //obtengo el producto por id
    const foundProduct = productos.find(
      producto => producto.id === Number(params.id)
    )

    //seteo el producto
    setProductoPorId(foundProduct)
  }, [params.id, productos])

  if (!productoPorId) {
    return <p>Cargando...</p> // Muestra un mensaje de carga mientras se obtiene el producto
  }

  return (
    <>
      {productos.length === 0 && !productoPorId.id ? (
        <p>Cargando...</p>
      ) : (
        <DetailProductWrapper>
          <Helmet>
            <meta property='og:title' content={productoPorId.name} />
            <meta property='og:description' content={productoPorId.detail} />
            {productoPorId.images && productoPorId.images[0] && (
              <meta property='og:image' content={productoPorId.images[0].url} />
            )}{' '}
          </Helmet>
          <div className='title-container'>
            <div className='titulo-categoria'>
              {/* <img src={logo} alt='logo futbol jugador' className='img-logo' /> */}
              <h1>{productoPorId.name}</h1>
            </div>
          </div>
          <section className='contenedor-detalleProducto'>
            <h2>Descripcion</h2>
            <p>{productoPorId.detail}</p>
            <div className='contenedor-volver'>
              <Link to={'/'} className='link'>
                <BsFillArrowRightSquareFill />
              </Link>
            </div>
            <br />
            <br></br>
            <hr />
            <h3>
              <BsFillShareFill />
              Comparti este producto:{' '}
            </h3>
            <div className='compartir-redes'>
              <FacebookShareButton
                url={`http://g4-c5-fulbo4u.s3-website.us-east-2.amazonaws.com/`}
                quote={'probando prbando'}
              >
                <button>Compartir en Facebook</button>
              </FacebookShareButton>
              <SocialShareLink
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaFacebook />
              </SocialShareLink>
              <SocialShareLink
                href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaTwitter />
              </SocialShareLink>
              <SocialShareLink
                href={`https://www.instagram.com/?url=${window.location.href}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaInstagram />
              </SocialShareLink>
            </div>
          </section>

          <div className='title-container'>
            <div className='titulo-categoria'>
              <img src={logo} alt='logo futbol jugador' className='img-logo' />
              <h2>Galeria de Imagenes del Producto</h2>
            </div>
          </div>
          <section className='contenedor-detalleProducto'>
            {productoPorId.caracteristicts ? (
              <ProductGallery images={productoPorId.images} />
            ) : (
              <p>Cargando imagenes...</p>
            )}
          </section>

          <div className='title-container'>
            <div className='titulo-categoria'>
              <img src={logo} alt='logo futbol jugador' className='img-logo' />
              <h2>Caracteristicas del producto</h2>
            </div>
          </div>
          {console.log(productoPorId.caracteristicts)}
          {/* recorro las caracteristicas del producto y las mapeo */}

          {productoPorId.caracteristicts ? (
            <ul className='caracteristics-ul'>
              {console.log(productoPorId)}
              {productoPorId.caracteristicts.map(caracteristica => (
                <li key={caracteristica.id} className='caracteristics-li'>
                  {caracteristica.emoji + ' ' + caracteristica.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>Cargando caracteristicas...</p>
          )}

          <div className='title-container'>
            <div className='titulo-categoria'>
              <img src={logo} alt='logo futbol jugador' className='img-logo' />
              <h2>Realiza tu reserva</h2>
            </div>
          </div>
          <section className='contenedor-reservas'>
            <div className='booker'>
              <label htmlFor='datePicker'>Selecciona una fecha:</label>
              <DatePicker
                id='datePicker'
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                filterDate={isDateDisabled} // Utiliza esta función para desactivar fechas
              />
              <button onClick={() => validarFecha()} className='button'>
                {' '}
                Buscar
              </button>
            </div>

            {buscarHorasDisponibles && (
              <div className='booker'>
                <label htmlFor='selectorHora'>Selecciona una hora:</label>
                {/* //un seleect con las siguientes opciones : 08:00 a 10:00 hs,
                  10:00 a 12:00 hs, 12:00 a 14:00 hs, 14:00 a 16:00 hs, 16:00 a
                  18:00 hs, 18:00 a 20:00 hs */}
                <select
                  value={selectedHour}
                  onChange={e => setSelectedHour(e.target.value)}
                >
                  <option value='08:00 a 10:00 hs'>08:00 a 10:00 hs</option>
                  <option value='10:00 a 12:00 hs'>10:00 a 12:00 hs</option>
                  <option value='12:00 a 14:00 hs'>12:00 a 14:00 hs</option>
                  <option value='14:00 a 16:00 hs'>14:00 a 16:00 hs</option>
                  <option value='16:00 a 18:00 hs'>16:00 a 18:00 hs</option>
                </select>
                <button
                  onClick={() =>
                    toast.success(
                      `Reservando el producto ${productoPorId.name} para el día ${selectedDate} de ${selectedHour} `
                    )
                  }
                  className='button'
                >
                  Reservar
                </button>
              </div>
            )}
          </section>
          <div className='title-container'>
            <div className='titulo-categoria'>
              <img src={logo} alt='logo futbol jugador' className='img-logo' />
              <h2>
                {' '}
                <u>Politicas de uso</u>
              </h2>
            </div>
          </div>
          <section className='contenedor-detalleProducto width100'>
            <ol className='caracteristics-ol'>
              <li>
                <b>
                  {' '}
                  🗒️ <u>Condiciones de resva y uso:</u>{' '}
                </b>
                <br></br>
                <br></br> Al reservar el producto usted acepta las condiciones
                de uso del mismo. Usted debe respetar estrictamente el horario
                de reserva seleccionado al realizar su solicitud. El producto
                deberá ser utilizado únicamente durante el período acordado.
              </li>
              <li>
                <b>
                  ❌<u>Politicas de cancelacion:</u>{' '}
                </b>
                <br></br>
                <br></br> Puede cancelar la reserva hasta 24hs antes de la
                misma. En caso de solicitar la cancelacion en un plazo
                posterior, se le puede cobrar un cargo extra.
              </li>
              <li>
                <b>
                  {' '}
                  👤<u>Usos y cuidados del servicio reservado:</u>{' '}
                </b>
                <br></br>
                <br></br>
                La pelota debe ser utilizada unicamente en el campo de juego.
                Esta diseñada unicamente para jugar Futbol. Debe evitarse
                cualquier otro uso que no sea el especificado. Mantener el
                producto en buen estado y limpio. En caso de rotura o daño, se
                le puede cobrar un cargo extra.
              </li>
            </ol>
          </section>
          <Toaster position='top-center' reverseOrder={false} />
        </DetailProductWrapper>
      )}
    </>
  )
}

const DetailProductWrapper = styled.section`
  margin-bottom: 2rem;

  line-height: 1.2rem;
  min-height: 100vh; /* Cambio aquí */
  h3 {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .compartir-redes {
    display: flex;
    gap: 1rem;
    font-size: 2rem;
  }

  .button {
    font-size: 2rem;
    border: white solid 1px;

    font-size: 1rem;
    padding: 8px;
    color: white;
    background-color: ${props => props.theme.global.greyF4u};
    transition: color 0.6s;
    border-radius: 2rem;
    border: none;
    cursor: pointer;
  }
  .contenedor-reservas {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding-left: 2rem;
    padding-right: 2rem;
    flex-wrap: wrap;
    gap: 0.5rem;

    margin-bottom: 2rem;
  }

  .booker {
    margin-top: 1rem;
    padding: 0.8rem 1rem;
    z-index: 100;
    background-color: #d9d9d9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    border-radius: 50px;
    border: 2px solid black;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
  }

  .contenedor-detalleProducto {
    padding: 2rem 2rem;
    margin-bottom: 2rem;
  }

  .contenedor-detalleProducto.width100 {
    padding-left: 0rem;
    padding-right: 0rem;
  }

  .contenedor-volver {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
  }

  .link {
    font-size: 40px;
    color: ${props => props.theme.global.greyF4u};
    transition: color 0.6s;
  }

  .link:hover {
    color: #000000;
  }

  ul.caracteristics-ul {
    display: flex;
    justify-content: space-around;
    align-items: space-between;
    text-align: center;
    list-style: none;
    gap: 0.5rem;
    font-size: 1.2rem;
    background-color: ${props => props.theme.global.lightGreyF4u} !important;
    border-radius: 2rem;
    border: 2px solid ${props => props.theme.global.greyF4u} !important;
    padding: 1rem;
    font-weight: bolder;
    margin-top: 2rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
  }

  ol.caracteristics-ol {
    display: flex;
    justify-content: space-around;
    align-items: space-between;
    text-align: center;
    list-style: none;
    gap: 0.5rem;
    font-size: 1.2rem;
    background-color: ${props => props.theme.global.lightGreyF4u} !important;
    border-radius: 2rem;
    border: 2px solid ${props => props.theme.global.greyF4u} !important;
    padding: 1rem;

    li {
      width: 90%;
      background-color: ${props => props.theme.global.greyF4u};
      padding: 1rem 0.5rem;
      border-radius: 2rem;
      color: white;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
  }
  li.caracteristics-li {
    display: flex;
    gap: 0.5rem;
    background-color: ${props => props.theme.global.greyF4u};
    padding: 1rem 0.5rem;
    border-radius: 2rem;
    color: white;
  }

  .title-container {
    background-color: ${props => props.theme.global.greyF4u};
    display: flex;
    gap: 20px;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    padding-left: 2rem;
    padding-right: 4rem;
    margin-bottom: 2rem;

    align-items: center;
    justify-content: space-between;
    width: 100%;
    .titulo-categoria {
      display: flex;
    }

    .filtro {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      span {
        font-size: 1rem;
        font-weight: bold;
        color: white;
      }
    }
    svg {
      font-size: 1.5rem;
      color: white;
    }

    select.select-categoria {
      font-size: 1rem;
      transition: color 0.6s;
      border-radius: 2rem;
      text-align: center;
      color: white;
      border: none;
      background-color: ${props => props.theme.global.redF4u};
    }
  }
  .img-logo {
    width: 40px;
  }

  .title-container h2,
  h1 {
    color: #ffffff;
    text-transform: uppercase;
  }
`
// Estilo para el botón de mostrar/ocultar la ventana desplegable
const SocialShareButton = styled.button`
  font-size: 1rem;
  padding: 8px;
  background-color: #0078d4;
  color: white;
  border: none;
  cursor: pointer;
`

// Estilo para la ventana desplegable de redes sociales
const SocialShareDropdown = styled.div`
  display: ${props => (props.visible ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 100;
  padding: 8px;
`

// Estilo para los enlaces de las redes sociales dentro de la ventana desplegable
const SocialShareLink = styled.a`
  display: block;
  margin-bottom: 8px;
  color: ${props => props.theme.global.greyF4u};
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: ${props => props.theme.global.redF4u};
  }
`
