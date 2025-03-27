import React, { useContext, useState } from 'react'
import ReactStars from 'react-rating-stars-component'
import styled from 'styled-components'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export const FormVoting = () => {
  const [amountStars, setAmountStars] = useState(0)
  const [productRatingDescription, setProductRatingDescription] = useState('')
  const [error, setError] = useState(false)

  const { setShowModalVoting, dataReserva, getDisponibilidadesNOTOAST } =
    useContext(ElementosGlobales)

  const ratingChanged = newRating => {
    setAmountStars(newRating)
  }

  const onRatingDescription = e => {
    setProductRatingDescription(e.target.value)
  }

  const handleFormSubmit = e => {
    e.preventDefault()

    if (amountStars === 0) {
      setError(true)
    } else {
      let data = {
        cantStars: amountStars,
        ratingDescription: productRatingDescription
      }
      putReserva(data.cantStars, data.ratingDescription)
      console.log(data)

      setShowModalVoting(false)
    }
  }

  //funcion put al endpoint http://localhost:8080/api/bookings/update
  const putReserva = async (cantStars, ratingDescription) => {
    const idToast = toast.loading('Actualizando la reserva', {
      style: {
        'font-size': '1.5rem'
      }
    })
    const url = `http://18.208.174.132:8080/api/bookings/update`
    const formData = new FormData()
    formData.append('id', dataReserva.id)
    formData.append('nombreAutorizado', dataReserva.nombreAutorizado)
    formData.append('correoAutorizado', dataReserva.correoAutorizado)
    formData.append('telefonoAutorizado', dataReserva.telefonoAutorizado)
    formData.append('fecha', dataReserva.fecha)
    formData.append('hora', dataReserva.hora)
    formData.append('idProduct', dataReserva.idProduct)
    formData.append('userUID', dataReserva.userUID)
    formData.append('disponibilidad', false)
    formData.append('comentarioReserva', dataReserva.comentarioReserva)
    //guardar en formate datetime el momento que se hacer la reserva
    formData.append('momentoReserva', dataReserva.momentoReserva)
    formData.append('puntajeResenia', cantStars)
    formData.append('comentarioResenia', ratingDescription)
    try {
      const response = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(response.data)
      toast.success('Resenia guardada correctamente.', { id: idToast })
      getDisponibilidadesNOTOAST()
    } catch (error) {
      toast.error('Error al guardar tu resenia', { id: idToast })
    }
  }
  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <label>
          Puntuá el producto<span>*</span>
        </label>
        <ReactStars
          edit={true}
          count={5}
          onChange={ratingChanged}
          size={40}
          value={amountStars}
        />
        {error && <span id='error'>Debes puntuar el producto</span>}
        <label htmlFor='descriptionProduct'>
          Agrega un comentario acerca del producto (opcional)
        </label>
        <textarea
          name='descriptionProduct'
          id='descriptionProduct'
          value={productRatingDescription}
          onChange={onRatingDescription}
        ></textarea>
        <input type='submit' />
      </Form>
      <Toaster position='top-center' reverseOrder={false} />
    </>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  label {
    font-size: 20px;
  }

  span {
    color: #ff0000;
  }

  span#error {
    font-size: 20px;
  }

  textarea {
    min-width: 420px;
    min-height: 210px;
    max-width: 420px;
    max-height: 210px;
    font-size: 18px;
  }

  input[type='submit'] {
    padding: 1rem 3rem;
    border-radius: 5px;
    cursor: pointer;
    background-color: ${props => props.theme.global.redF4u};
    border: none;
    color: #ffffff;
    font-size: 18px;
    transition: background-color 0.6s;
  }

  input[type='submit']:hover {
    background-color: #86221d;
  }
`
