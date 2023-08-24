import { ElementosGlobales } from '../../context/ElementosGlobales'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import SignIn from '../../components/login/SignIn'
import SignUp from '../../components/login/SignUp'
import AuthDetails from '../../components/AuthDetails'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import toast, { Toaster } from 'react-hot-toast'

export default function IniciarSesion() {
  const { cambiarLoggeo } = useContext(ElementosGlobales)
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [mensajeError, setMensajeError] = useState('')
  const navigate = useNavigate()

  const signIn = e => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, usuario, password)
      .then(userCredential => {
        console.log(userCredential)
        navigate('/')
      })
      .catch(error => {
        console.log(error)
        toast.error('Usuario o contraseña incorrectos')
      })
  }

  return (
    <section className='section-formulario content'>
      <Form onSubmit={signIn}>
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
      {/* <SignIn />
      <SignUp /> */}
      <AuthDetails />
      <Toaster position='top-center' reverseOrder={false} />
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
