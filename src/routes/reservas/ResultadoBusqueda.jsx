import styled from 'styled-components'
import CardReserva from '../../components/reservas/CardReservasDisponibles'
import { useEffect, useState, useContext } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import logo from '../../assets/Futbol4u-logo.svg'

export default function ResultadoBusqueda() {
  const {
    disponibilidades,
    fechaReservaSeleccionada,
    horaReservaSeleccionada,
    searchedName
  } = useContext(ElementosGlobales)

  const [productosEnReservas, setProductosEnReservas] = useState([])
  const [otrasBusquedas, setOtrasBusquedas] = useState([])

  useEffect(() => {
    const filteredReservas = disponibilidades.filter(reserva => {
      const fechaMatch =
        !fechaReservaSeleccionada || reserva.fecha === fechaReservaSeleccionada
      const horaMatch =
        !horaReservaSeleccionada || reserva.hora === horaReservaSeleccionada
      const nameMatch =
        !searchedName || reserva.idProduct.name.includes(searchedName)
      return fechaMatch && horaMatch && nameMatch && reserva.disponibilidad
    })

    if (filteredReservas.length === 0) {
      const otherSearches = disponibilidades.filter(reserva => {
        const fechaMatch =
          !fechaReservaSeleccionada ||
          reserva.fecha === fechaReservaSeleccionada
        const horaMatch =
          !horaReservaSeleccionada || reserva.hora === horaReservaSeleccionada
        const nameMatch =
          !searchedName || reserva.idProduct.name.includes(searchedName)
        return fechaMatch || horaMatch || (nameMatch && reserva.disponibilidad)
      })

      setOtrasBusquedas(otherSearches)
    }

    setProductosEnReservas(filteredReservas)
  }, [
    disponibilidades,
    fechaReservaSeleccionada,
    horaReservaSeleccionada,
    searchedName
  ])

  return (
    <>
      <ContenedorTitulo>
        <div className='title-container'>
          <div className='titulo-categoria'>
            <img src={logo} alt='logo futbol jugador' className='img-logo' />
            <h2>Resultados de tu búsqueda: </h2>{' '}
          </div>
        </div>
      </ContenedorTitulo>
      <SectionMisReservas>
        {productosEnReservas.length === 0 ? (
          <h2>
            No se encontraron resultados, pero tal vez estas reservas te sirvan:
          </h2>
        ) : (
          <>
            {productosEnReservas.length === 0 && otrasBusquedas.length > 0 && (
              <h2>Se encontraron las siguientes disponibilidades:</h2>
            )}

            {productosEnReservas.length === 0 &&
              otrasBusquedas.length === 0 && (
                <h2>No se encontraron resultados.</h2>
              )}

            {productosEnReservas.map(reserva => (
              <CardReserva
                key={reserva.id}
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
                })}, Hora: ${new Date(
                  reserva.momentoReserva
                ).toLocaleTimeString('es-AR', {
                  timeZone: 'America/Argentina/Buenos_Aires'
                })}`}
                idReserva={reserva.id}
              />
            ))}
          </>
        )}
        {productosEnReservas.length === 0 &&
          otrasBusquedas.length > 0 &&
          otrasBusquedas.map(reserva => (
            <CardReserva
              key={reserva.id}
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
                {
                  timeZone: 'America/Argentina/Buenos_Aires'
                }
              )}`}
              idReserva={reserva.id}
            />
          ))}
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
