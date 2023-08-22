import { ElementosGlobales } from '../context/ElementosGlobales'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

export default function IniciarSesion() {
  const { cambiarLoggeo } = useContext(ElementosGlobales)
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [mensajeError, setMensajeError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = e => {
    e.preventDefault()
    if (usuario === 'admin' && password === 'admin') {
      cambiarLoggeo()
      navigate('/administracion')
    } else {
      setError(true)
      setMensajeError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <section className='section-formulario content'>
      <Form onSubmit={handleSubmit}>
        <h2>Iniciar Sesion</h2>
        <label htmlFor='usuario'> Usuario</label>
        <input
          name='usuario'
          type='text'
          placeholder='Ingrese su usuario'
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
        />
        <label htmlFor='password'>Contraseña</label>
        <input
          name='password'
          type='password'
          placeholder='Ingrese su contraseña'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className='error'>{mensajeError}</p>}
        <button type='submit'>Iniciar Sesion</button>
      </Form>
    </section>
  )
}
const Form = styled.form`
  margin: 0rem 2rem;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  input {
    margin-bottom: 1rem;
  }
  button {
    margin-top: 1rem;
  }
`
