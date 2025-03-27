import styled from 'styled-components'
import CardReserva from '../../components/reservas/CardReservas'
import { useEffect, useState, useContext } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import ReservaMoqueada from '../../mocks/reservas.json'
import logo from '../../assets/Futbol4u-logo.svg'

export default function VerMisReservas() {
  const { productos, disponibilidades, user } = useContext(ElementosGlobales)
  const [productosEnReservas, setProductosEnReservas] = useState([])
  const [isBookingOver, setIsBookingOver] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (user && user.uid) {
      // Filtra las reservas para encontrar productos coincidentes
      const productosEnReservas = disponibilidades
        .filter(disponibilidad => disponibilidad.userUID === user.uid)
        .sort((a, b) => {
          // Convierte las fechas al formato Date y resta un día
          const fechaA = new Date(a.momentoReserva)
          fechaA.setDate(fechaA.getDate() - 1) // Resta un día
          const fechaB = new Date(b.momentoReserva)
          fechaB.setDate(fechaB.getDate() - 1) // Resta un día

          // Compara las fechas de manera descendente (de mayor a menor)
          return fechaB - fechaA
        })

      setProductosEnReservas(productosEnReservas)
    }
  }, [user, disponibilidades])

  const handleReservationOver = (fecha, hora) => {
    if (productosEnReservas.length > 0) {
      const fechaDeHoy = new Date()

      const rangoDeHorariosReserva = hora
      const partes1 = rangoDeHorariosReserva.split(' ')
      const horaFinalizacion = partes1[2].trim() + ':00'
      const fechaMasHora = fecha + ' ' + horaFinalizacion

      const partes2 = fechaMasHora.split(' ') // Dividimos la cadena en fecha y hora
      const fechaPartes = partes2[0].split('-') // Dividimos la fecha en partes
      const horaPartes = partes2[1].split(':') // Dividimos la hora en partes

      // Crear un objeto Date con las partes de la fecha y hora
      const fechaFinalizacion = new Date(
        parseInt(fechaPartes[2]), // Año
        parseInt(fechaPartes[1]) - 1, // Mes (restamos 1 ya que los meses en JavaScript van de 0 a 11)
        parseInt(fechaPartes[0]), // Día
        parseInt(horaPartes[0]), // Hora
        parseInt(horaPartes[1]), // Minutos
        parseInt(horaPartes[2]) // Segundos
      )

      return fechaDeHoy > fechaFinalizacion
    }
  }

  return (
    <>
      <ContenedorTitulo>
        <div className='title-container'>
          <div className='titulo-categoria'>
            <img src={logo} alt='logo futbol jugador' className='img-logo' />
            <h2>Mis reservas</h2>
          </div>
        </div>
      </ContenedorTitulo>

      <SectionMisReservas>
        {productosEnReservas.map(reserva => {
          return (
            <CardReserva
              key={reserva.id}
              idReserva={reserva.id}
              producto={reserva.idProduct}
              nombreInfo={reserva.nombreAutorizado}
              telefonoInfo={reserva.telefonoAutorizado}
              emailInfo={reserva.correoAutorizado}
              fechaReserva={reserva.fecha}
              horaReserva={reserva.hora}
              comentarioInfo={reserva.comentarioReserva}
              momentoReserva={`Fecha: ${new Date(
                reserva.momentoReserva
              ).toLocaleDateString('es-AR', {
                timeZone: 'America/Argentina/Buenos_Aires'
              })}, Hora: ${new Date(reserva.momentoReserva).toLocaleTimeString(
                'es-AR',
                { timeZone: 'America/Argentina/Buenos_Aires' }
              )}`}
              estadoReserva={handleReservationOver(reserva.fecha, reserva.hora)}
              momentoReservaOriginal={reserva.momentoReserva}
            />
          )
        })}
      </SectionMisReservas>
    </>
  )
}

const SectionMisReservas = styled.section`
  min-height: calc(100vh - 248px);
  padding-left: 2rem;
  padding-right: 2rem;
  margin-bottom: 2rem;
  gap: 2rem;
  display: flex;
  flex-direction: column;
`
const ContenedorTitulo = styled.div`
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
