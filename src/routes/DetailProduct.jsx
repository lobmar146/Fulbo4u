import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import ReactStars from 'react-rating-stars-component'
import { useParams, Link } from 'react-router-dom'
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'
import { ElementosGlobales } from '../context/ElementosGlobales'
import ProductGallery from '../components/product/ProductGallery'
import logo from '../assets/Futbol4u-logo.svg'
import { BsFillShareFill } from 'react-icons/bs'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa' // Logos redes

//Imports para la reserva
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast, { Toaster } from 'react-hot-toast'

// helmet para agregar los metadatos a la hora de compartir
import { Helmet } from 'react-helmet'
import WhatsAppButton from '../components/whatsapp/WhatsAppButton'
import { useNavigate } from 'react-router-dom'
import { utcToZonedTime, format } from 'date-fns-tz' // Importa la función de manejo de zona horaria y la función de formato
import { addDays } from 'date-fns'
export default function DetailProduct() {
  const navigate = useNavigate()
  const {
    userData,
    productos,
    setFechaReservaSeleccionada,
    setHoraReservaSeleccionada,
    user,
    setShowModal,
    setModalMessage,
    ratingChanged,
    avatar,
    avatarGenerator,
    setIdReserva,
    disponibilidades
  } = useContext(ElementosGlobales)

  //estados de la reserva
  const [selectedDate, setSelectedDate] = useState('')
  const [buscarHorasDisponibles, setBuscarHorasDisponibles] = useState(false) //estado de la barra de busqueda
  const [selectedHour, setSelectedHour] = useState('') //estado de la hora seleccionada
  //estado para controlar visibilidad
  const [socialShareVisible, setSocialShareVisible] = useState(false)
  const [enabledDates, setEnabledDates] = useState([])
  //estado con los horarios disponibles
  const [horariosDisponibles, setHorariosDisponibles] = useState([])
  const [horariosDisponiblesTemp, setHorariosDisponiblesTemp] = useState([])
  const [productosEnReservas, setProductosEnReservas] = useState([])
  const [promedioResenias, setPromedioResenias] = useState(0)

  // Fechas que deseas desactivar (en formato JavaScript Date)

  //recorrer las disponibilidades y agregarlas al array de fechas habilitadas

  // Función para desactivar fechas

  const isDateDisabled = date => {
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
    const day = selectedDate.getDate()
    const month = selectedDate.getMonth() + 1 // Sumamos 1 porque los meses van de 0 a 11
    const year = selectedDate.getFullYear()

    // Creamos una función para agregar un cero inicial si el día o mes es menor a 10
    const addLeadingZero = value => {
      return value < 10 ? `0${value}` : value
    }

    // Formateamos la fecha en el formato "dd-mm-yyyy"
    const formattedDate = `${addLeadingZero(year)}-${addLeadingZero(
      month
    )}-${day}`
    console.log(formattedDate)
    if (disponibilidades && disponibilidades.length > 0) {
      //obtener los horarios de la fecha seleccionada
      const horariosDisponibles = disponibilidades
        .filter(
          disponibilidad =>
            disponibilidad.idProduct.id === productoPorId.id &&
            disponibilidad.fecha == formattedDate
        )
        .map(disponibilidad => disponibilidad.hora)
      console.log(horariosDisponibles)
    }
    setHorariosDisponibles(horariosDisponibles)
  }

  const [productoPorId, setProductoPorId] = useState({})

  const params = useParams()

  //esto deberia fetchearse a futturo

  useEffect(() => {
    setModalMessage('para realizar una reserva')
    window.scrollTo(0, 0)
    //esto deberia ser la funcion de fetch, aca ni bien se monta el componente se hacen los siguientes pasos

    //obtengo el producto por id
    const foundProduct = productos.find(
      producto => producto.id === Number(params.id)
    )

    //seteo el producto
    setProductoPorId(foundProduct)
    if (disponibilidades && disponibilidades.length > 0 && foundProduct) {
      const disponibilidadFechas = disponibilidades
        .filter(
          disponibilidad => disponibilidad.idProduct.id === foundProduct.id
        )
        .map(disponibilidad => {
          const utcDate = new Date(disponibilidad.fecha)

          // Suma un día a la fecha utilizando addDays
          const fechaConUnDiaMas = addDays(utcDate, 1)

          // Convierte la fecha a la zona horaria deseada
          const buenosAiresTime = utcToZonedTime(
            fechaConUnDiaMas,
            'America/Argentina/Buenos_Aires'
          )

          return buenosAiresTime
        })
      setEnabledDates(disponibilidadFechas)
    }
  }, [params.id, productos, disponibilidades])

  //useEffect que obtiene las reservas
  useEffect(() => {
    window.scrollTo(0, 0)
    if (user && user.uid) {
      // Filtra las reservas para encontrar productos coincidentes
      const productosEnReservas = disponibilidades.filter(
        disponibilidad =>
          disponibilidad.puntajeResenia &&
          disponibilidad.idProduct.id === productoPorId.id
      )

      setProductosEnReservas(productosEnReservas)
      console.log('reservas del user', productosEnReservas)
      // Calcula el promedio de las reseñas
      if (productosEnReservas.length > 0) {
        const totalPuntajes = productosEnReservas.reduce(
          (total, producto) => total + producto.puntajeResenia,
          0
        )

        const promedio = totalPuntajes / productosEnReservas.length
        const promedioEntero = Math.round(promedio) // Redondear al entero más cercano
        setPromedioResenias(promedioEntero)
      }
    }
  }, [user, disponibilidades, productoPorId])
  if (!productoPorId) {
    return <p>Cargando...</p> // Muestra un mensaje de carga mientras se obtiene el producto
  }
  const textToList = text => {
    // Divide el texto en función de los puntos y luego filtra los elementos vacíos
    return text
      .split(/[.]/)
      .map(item => item.trim())
      .filter(item => item !== '')
  }

  const handleNavigation = () => {
    const day = selectedDate.getDate()
    const month = selectedDate.getMonth() + 1
    const year = selectedDate.getFullYear()
    const addLeadingZero = value => {
      return value < 10 ? `0${value}` : value
    }
    const formattedDate = `${addLeadingZero(day)}-${addLeadingZero(
      month
    )}-${year}`
    const queryDate = `${addLeadingZero(year)}-${addLeadingZero(month)}-${day}`

    if (user) {
      if (!selectedHour) {
        toast.error(`Debe seleccionar una hora`, {
          style: { 'font-size': '1.5rem' }
        })
      } else {
        console.log(selectedHour)
        console.log(queryDate)

        // Busca la disponibilidad correspondiente a selectedDate y selectedHour
        const availability = disponibilidades.find(
          disponibilidad =>
            disponibilidad.idProduct.id == productoPorId.id &&
            disponibilidad.fecha == queryDate &&
            disponibilidad.hora == selectedHour &&
            disponibilidad.disponibilidad
        )

        if (availability) {
          // Obtén el ID de la disponibilidad
          const availabilityId = availability.id

          // Realiza la navegación y configura la fecha y hora de reserva
          navigate(`/reservas/ConfirmarReserva/${params.id}`)

          setFechaReservaSeleccionada(formattedDate)
          setHoraReservaSeleccionada(selectedHour)

          // Puedes utilizar availabilityId según tus necesidades
          setIdReserva(availabilityId)
        } else {
          toast.error(
            `No se encontró disponibilidad para la hora seleccionada`,
            {
              style: { 'font-size': '1.5rem' }
            }
          )
        }
      }
    } else {
      setModalMessage('para realizar una reserva')
      setShowModal(true)
    }
  }

  avatarGenerator(userData)

  const onSelectedDateChange = date => {
    setSelectedDate(date)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const addLeadingZero = value => {
      return value < 10 ? `0${value}` : value
    }

    const formattedDate = `${addLeadingZero(year)}-${addLeadingZero(
      month
    )}-${day}`

    if (disponibilidades && disponibilidades.length > 0) {
      const horariosDisponiblesTemp = disponibilidades
        .filter(
          disponibilidad =>
            disponibilidad.idProduct.id === productoPorId.id &&
            disponibilidad.fecha === formattedDate &&
            disponibilidad.disponibilidad
        )
        .map(disponibilidad => disponibilidad.hora)

      setHorariosDisponiblesTemp(horariosDisponiblesTemp)
      setSelectedHour(horariosDisponiblesTemp[0])
    }
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
            {/* <meta property='og:image' content={productoPorId.images[0].url} /> */}
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
                <BsFillArrowLeftSquareFill />
              </Link>
            </div>
            <br />
            <br></br>
            <hr />
            <h3>
              <BsFillShareFill />
              Compartí este producto:{' '}
            </h3>
            <div className='compartir-redes'>
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
          {/* recorro las caracteristicas del producto y las mapeo */}

          {productoPorId.caracteristicts ? (
            <ul className='caracteristics-ul'>
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
                onChange={date => onSelectedDateChange(date)} // Cambia esta línea
                filterDate={isDateDisabled}
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
                  {horariosDisponiblesTemp.map((horario, index) => (
                    <option key={index} value={horario}>
                      {horario}
                    </option>
                  ))}
                </select>

                <button onClick={() => handleNavigation()} className='button'>
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
              {productoPorId.policy_booking ? (
                <li>
                  <b>
                    🗒️ <u>Condiciones de reserva y uso:</u>{' '}
                  </b>
                  <br />
                  <br />
                  <ol>
                    {textToList(productoPorId.policy_booking).map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ol>
                </li>
              ) : (
                <li>Cargando</li>
              )}

              <li>
                <b>
                  ❌<u>Políticas de cancelación:</u>{' '}
                </b>
                <br />
                <br />
                <ol>
                  {productoPorId.policy_cancel ? (
                    textToList(productoPorId.policy_cancel).map(
                      (item, index) => <li key={index}>{item}</li>
                    )
                  ) : (
                    <li>Cargando</li>
                  )}
                </ol>
              </li>

              <li>
                <b>
                  👤<u>Usos y cuidados del servicio reservado:</u>{' '}
                </b>
                <br />
                <br />
                <ol>
                  {productoPorId.policy_use ? (
                    textToList(productoPorId.policy_use).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <li>Cargando</li>
                  )}
                </ol>
              </li>
            </ol>
          </section>
          <div className='title-container'>
            <div className='titulo-categoria'>
              <img src={logo} alt='logo futbol jugador' className='img-logo' />
              <h2>Valoración del Producto</h2>
            </div>
          </div>
          {/* PROMEDIO RESEÑAS */}
          <section className='promedio-resenias__container'>
            <div className='promedio'>
              <span>{promedioResenias}</span>
              {console.log(promedioResenias)}

              <ReactStars
                size={40}
                edit={false}
                value={parseInt(promedioResenias)}
                count={5}
              />
            </div>
          </section>
          <section className='contenedor-resenias'>
            {productosEnReservas.length === 0 ? (
              <h3>Sin reseñas</h3>
            ) : (
              productosEnReservas.map(producto => {
                return (
                  <div key={producto.id} className='user-resenia__container'>
                    <span id='avatar'>
                      {avatarGenerator({
                        nombre: user.displayName
                      })}
                    </span>
                    <div className='nombre-valoracion__container'>
                      <h3>{user.displayName}</h3>
                      {producto.comentarioResenia && (
                        <p>
                          {producto.comentarioResenia.substring(0, 40) + '...'}
                        </p>
                      )}
                      <ReactStars
                        size={24}
                        edit={false}
                        value={producto.puntajeResenia}
                        onChange={ratingChanged}
                      />
                      <span>{producto.fecha}</span>
                    </div>
                  </div>
                )
              })
            )}
          </section>
          <Toaster position='top-center' reverseOrder={false} />
          <WhatsAppButton
            phoneNumber='5491127164470'
            nombreProducto={productoPorId.name}
          />
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
    text-align: left;
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

  .promedio-resenias__container {
    margin-bottom: 2rem;
  }

  .promedio {
    display: flex;
    justify-content: center;
  }

  .contenedor-resenias {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .user-resenia__container {
    width: calc(50% - 1rem);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.2rem;
  }

  #avatar {
    border-radius: 50%;
    padding: 12px;
    background-color: ${props => props.theme.global.greyF4u};
    color: #ffffff;
  }

  .nombre-valoracion__container h3 {
    margin: 0;
  }

  @media (max-width: 320px) {
    .contenedor-resenias {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .user-resenia__container {
      width: auto;
    }
  }

  @media (min-width: 768px) {
    .contenedor-resenias {
      padding: 1.1rem;
      justify-content: center;
      gap: 1rem;
    }

    .user-resenia__container {
      width: calc(33, 3% - 1rem);
      margin-bottom: 2rem;
      gap: 1rem;
    }

    #avatar {
      padding: 20px;
    }

    .nombre-valoracion__container {
      display: flex;
      flex-direction: column;
      p {
        width: 50%;
      }
    }
  }

  @media (min-width: 1024px) {
    .user-resenia__container {
      width: calc(25% - 1rem);
    }
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
