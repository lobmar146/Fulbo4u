import styled from 'styled-components'
import { useContext } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import { useNavigate } from 'react-router-dom'

export default function CardReserva(props) {
  const {
    producto,
    nombreInfo,
    telefonoInfo,
    emailInfo,
    fechaReserva,
    horaReserva,
    comentarioInfo,
    momentoReserva,
    idReserva
  } = props
  const {
    setFechaReservaSeleccionada,
    setHoraReservaSeleccionada,
    setIdReserva
  } = useContext(ElementosGlobales)
  const navigate = useNavigate()
  const handleNavigation = () => {
    console.log('click')
    setFechaReservaSeleccionada(fechaReserva)
    setHoraReservaSeleccionada(horaReserva)

    setIdReserva(idReserva)
    navigate(`/reservas/ConfirmarReserva/${producto.id}`)
  }
  return (
    <CardWrapper>
      <HeaderCard>
        <h2>
          {' '}
          Disponible el <b>{fechaReserva}</b> de {horaReserva}
        </h2>
      </HeaderCard>
      <BodyCard>
        <ColumnaCard>
          <ProductInfoContainer>
            <ProductImage>
              {producto.images &&
                producto.images.length > 0 &&
                producto.images[0].url && (
                  <ProductImageElement
                    src={producto.images[0].url}
                    alt='Imagen del producto'
                  />
                )}
            </ProductImage>
            <ProductInfo>
              <ProductNameLink
                href={`/product/${producto?.id}`}
                target='_blank'
              >
                {producto.name}
              </ProductNameLink>
              <DateInfo>Fecha de la reserva: {fechaReserva} </DateInfo>
              <DateInfo>Hora de la reserva: {horaReserva} </DateInfo>
            </ProductInfo>
          </ProductInfoContainer>
        </ColumnaCard>

        <ColumnaCard className='opciones'>
          <Button onClick={() => handleNavigation()} className='button'>
            Reservar
          </Button>
        </ColumnaCard>
      </BodyCard>
    </CardWrapper>
  )
}

const CardWrapper = styled.article`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.global.lightGreyF4u};
  border-radius: 6px;
  padding: 1rem;
  padding-bottom: 2rem;
`

const HeaderCard = styled.div`
  display: flex;

  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  overflow: hidden;
  margin-bottom: 1rem;
`

const BodyCard = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  @media (max-width: 910px) {
    flex-direction: column;
    align-items: center;

    font-size: 1rem;
  }
`

const ColumnaCard = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-left: 1rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);

  @media (max-width: 910px) {
    width: 100%;
    border-left: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 1rem;
  }

  .opciones {
    margin-top: 2rem;
  }
`
const ProductInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const ProductImage = styled.div`
  position: relative;
  height: 149.21px;
  min-width: 200px;
`

const ProductImageElement = styled.img`
  object-fit: cover;
  height: 149.21px;
  width: 200px;
  border-radius: 0.375rem;
  background-color: #d1d5db;
`

const ProductInfo = styled.div`
  flex-grow: 1;
`
const ProductNameLink = styled.a`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e4dd8;
  text-decoration: none;
  transition: color 0.3s ease-in-out;
  &:hover {
    color: #1e4dd8;
  }
`
const DateInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 1000;
  color: black;
  font-size: 1rem;
`

const Button = styled.button`
  background-color: ${props => props.theme.global.greyF4u};
  border: none;
  transition: background-color 0.6s;
  color: white;
  padding: 0.5rem;
  border-radius: 1rem;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: black;
  }
`
