import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import emailjs from 'emailjs-com'

const Container = styled.div`
  min-height: calc(100vh - 248px);
  padding: 1rem;
  @media (min-width: 640px) {
    padding: 2.5rem;
    padding-top: 0;
  }
`

const ContentContainer = styled.div`
  padding: 1.5rem;
  background-color: #fcfcfc;
  border-radius: 0.375rem;
  border: 0.125rem solid #e2e8f0;
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    padding-top: 0.1875rem;
  }
`

const ReservationTitle = styled.div`
  padding-top: 1rem;
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.global.greyF4u};
  @media (min-width: 640px) {
    font-size: 3rem;
  }
`

const OrderInfoContainer = styled.div`
  width: 100%;
  @media (min-width: 1024px) {
    flex-grow: 1;
  }
`

const OrderNumber = styled.h1`
  border-bottom: 0.125rem solid;
  padding-bottom: 0.3125rem;
  font-size: 1.875rem;
  font-weight: 600;
  color: ${props => props.theme.global.greyF4u};
`

const ReservationDetails = styled.div`
  margin-top: 2rem;
  border-bottom: 0.5rem solid;
  padding-bottom: 2rem;
`

const DetailTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: black;
`

const ProductInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
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

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  color: #6b7280;
  margin-bottom: 0.25rem;
  font-weight: 600;
  text-transform: uppercase;
`

const LocationMarkerIcon = styled.i`
  margin-right: 0.25rem;
  font-size: 1rem;
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

const DaysInfo = styled.div`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
`

const SubtotalTotalContainer = styled.div`
  width: 100%;
  border-bottom: 0.125rem solid;
  padding: 0.3125rem 0.625rem;
  text-align: right;
  font-weight: 600;
`

const SubtotalTotalItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  font-size: 1rem;
  color: ${props => props.theme.global.greyF4u};
`

const ContactInfoContainer = styled.div`
  position: sticky;
  top: 5.875rem;
  width: 100%;
  border: 0.125rem solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: #ffffff;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.05),
    0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  @media (min-width: 1024px) {
    max-width: 47.5rem;
  }
`

const ContactInfoContent = styled.div`
  padding: 0.9375rem 1.25rem;
  color: #6b7280;
  @media (min-width: 640px) {
    padding: 1.25rem 1.875rem;
  }
`

const ContactInfoTitle = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.global.greyF4u};
`

const ContactInfoForm = styled.form`
  margin-top: 1rem;
`

const ContactInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const ContactInfoLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: black;
`

const ContactInfoInput = styled.input`
  width: 100%;
  border: 0.125rem solid #cbd5e0;
  border-radius: 0.375rem;
  padding: 0.625rem;
  font-size: 0.875rem;
  color: #000000;
`

const ContactInfoButton = styled.button`
  margin-top: 1.25rem;
  width: 100%;
  border: none;
  border-radius: 0.375rem;
  padding: 0.875rem;
  background-color: ${props => props.theme.global.greyF4u};
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: black;
  }
`

const ContactInfoText = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
  @media (min-width: 1280px) {
    padding: 0 1.875rem;
  }
`

const ConfirmarReserva = ({ fecha, hora }) => {
  const {
    productos,
    fechaReservaSeleccionada,
    horaReservaSeleccionada,
    userData,
    user,
    idReserva,
    getDisponibilidadesNOTOAST
  } = useContext(ElementosGlobales)
  const [productoPorId, setProductoPorId] = useState({})
  const params = useParams()
  const navigate = useNavigate()

  const [nombreInfo, setNombreInfo] = useState(userData.nombre || '')
  const [correoInfo, setCorreoInfo] = useState(userData.correo || '')
  const [telefonoInfo, setTelefonoInfo] = useState(userData.telefono || '')
  const [comentarioInfo, setComentarioInfo] = useState('')
  useEffect(() => {
    emailjs.init('Da1CZQGCoaJQLzwv5')
    window.scrollTo(0, 0)

    const foundProduct = productos.find(
      producto => producto.id === Number(params.id)
    )

    setProductoPorId(foundProduct)
  }, [params.id, productos])

  //funcion put al endpoint http://localhost:8080/api/bookings/update
  const putReserva = async () => {
    const idToast = toast.loading('Actualizando la reserva', {
      style: {
        'font-size': '1.5rem'
      }
    })
    const url = `http://18.208.174.132:8080/api/bookings/update`
    const formData = new FormData()
    formData.append('id', idReserva)
    formData.append('nombreAutorizado', nombreInfo)
    formData.append('correoAutorizado', correoInfo)
    formData.append('telefonoAutorizado', telefonoInfo)
    formData.append('fecha', fechaReservaSeleccionada)
    formData.append('hora', horaReservaSeleccionada)
    formData.append('idProduct', productoPorId.id)
    formData.append('userUID', user.uid)
    formData.append('disponibilidad', false)
    formData.append('comentarioReserva', comentarioInfo)
    //guardar en formate datetime el momento que se hacer la reserva
    formData.append('momentoReserva', new Date().toISOString())

    try {
      const response = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(response.data)
      getDisponibilidadesNOTOAST()
      toast.success('Reserva confirmada', { id: idToast })
      emailjs
        .send('service_l0vvd9m', 'template_9lmhby4', {
          producto: `${productoPorId.name}`,
          to_name: `${user.displayName}`,
          fecha: `${fechaReservaSeleccionada}`,
          hora: `${horaReservaSeleccionada}`,
          to_email: `${user.email}`
        })
        .then(response => {
          toast.success('Email enviado con los detalles de su reserva')
        })
        .catch(error => {
          console.log(error)
        })

      setTimeout(() => {
        navigate('/reservas/VerMisReservas')
      }, 3000)
    } catch (error) {
      toast.error('Error al confirmar la reserva', { id: idToast })
    }
  }
  const handleSubmit = e => {
    e.preventDefault()
    putReserva()
  }

  if (!productoPorId) {
    return <p>Cargando...</p>
  }

  return (
    <Container>
      <ContentContainer>
        <OrderInfoContainer>
          <ReservationTitle>Confirmar Reserva</ReservationTitle>
          <OrderNumber>Orden #{idReserva}</OrderNumber>
          <ReservationDetails>
            <DetailTitle>Detalle de la reserva</DetailTitle>
            <ProductInfoContainer>
              <ProductImage>
                {productoPorId.images && productoPorId.images.length > 0 && (
                  <ProductImageElement
                    src={productoPorId.images[0].url}
                    alt='Imagen del producto'
                  />
                )}
              </ProductImage>
              <ProductInfo>
                <ProductNameLink
                  href={`/product/${productoPorId?.id}`}
                  target='_blank'
                >
                  {productoPorId.name}
                </ProductNameLink>
                <DateInfo>
                  Fecha de la reserva: {fechaReservaSeleccionada}{' '}
                </DateInfo>
                <DateInfo>
                  Hora de la reserva: {horaReservaSeleccionada}{' '}
                </DateInfo>
              </ProductInfo>
            </ProductInfoContainer>
            <SubtotalTotalContainer>
              <SubtotalTotalItem>
                <span>Total: $Plata hardcodeada</span>
                <span>{/* Aquí puedes mostrar el total de la reserva */}</span>
              </SubtotalTotalItem>
            </SubtotalTotalContainer>
          </ReservationDetails>
        </OrderInfoContainer>
        <ContactInfoContainer>
          <ContactInfoContent>
            <ContactInfoTitle>
              Persona autorizada para la reserva
            </ContactInfoTitle>
            <h4>
              Deja los datos de quien va acceder a la reserva. En caso de que no
              puedas ir o te retrases, rellena con los datos de quien pueda
              acceder por vos.{' '}
            </h4>
            <ContactInfoForm onSubmit={handleSubmit}>
              <ContactInfoGrid>
                <div>
                  <ContactInfoLabel htmlFor='name'>
                    Nombre y Apellido
                  </ContactInfoLabel>
                  <ContactInfoInput
                    type='text'
                    name='name'
                    id='name'
                    onChange={e => setNombreInfo(e.target.value)}
                    placeholder='Nombre'
                    value={nombreInfo}
                  />
                </div>
                <div>
                  <ContactInfoLabel htmlFor='email'>
                    Correo electrónico
                  </ContactInfoLabel>
                  <ContactInfoInput
                    type='email'
                    name='email'
                    id='email'
                    onChange={e => setCorreoInfo(e.target.value)}
                    placeholder='ejemplo@email.com'
                    value={correoInfo}
                  />
                </div>
                <div>
                  <ContactInfoLabel htmlFor='phone'>Teléfono</ContactInfoLabel>
                  <ContactInfoInput
                    type='tel'
                    name='phone'
                    id='phone'
                    onChange={e => setTelefonoInfo(e.target.value)}
                    placeholder='Teléfono'
                    value={telefonoInfo}
                  />
                </div>
                <div>
                  <ContactInfoLabel htmlFor='comentario'>
                    Dejanos un comentario{' '}
                  </ContactInfoLabel>
                  <ContactInfoInput
                    type='text'
                    name='comentario'
                    id='comentario'
                    onChange={e => setComentarioInfo(e.target.value)}
                    placeholder='Dejanos un comentario...'
                    value={comentarioInfo}
                  />
                </div>
              </ContactInfoGrid>
              <ContactInfoButton type='submit'>
                Finalizar mi reserva
              </ContactInfoButton>
              <ContactInfoText>
                Ponte en contacto con el propietario para planificar tu viaje o
                consultar cualquier duda.
              </ContactInfoText>
            </ContactInfoForm>
          </ContactInfoContent>
        </ContactInfoContainer>
      </ContentContainer>
      <Toaster position='top-center' reverseOrder={false} />
    </Container>
  )
}

export default ConfirmarReserva
