import { app } from '../../firebase'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { useState } from 'react'
import { auth } from '../../firebase'
import styled from 'styled-components'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function IniciarSesion() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [phone, setPhone] = useState('')
  const [displayName, setDisplayName] = useState('')

  const [registrationComplete, setRegistrationComplete] = useState(false)

  const signUp = async e => {
    const firestore = getFirestore(app)
    e.preventDefault()
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        usuario,
        password
      )

      // Actualizar el perfil del usuario con los campos adicionales
      await updateProfile(userCredential.user, {
        displayName: displayName,
        phoneNumber: phone
      })

      // Enviar correo de verificación
      await sendEmailVerification(userCredential.user)

      console.log(
        'Usuario registrado y correo de verificación enviado:',
        userCredential
      )
      setRegistrationComplete(true)

      // Crear un documento en la colección "usuarios" con el UID del usuario
      const docuRef = doc(firestore, `usuarios/${userCredential.user.uid}`)
      await setDoc(docuRef, {
        correo: usuario,
        rol: 'user',
        telefono: phone,
        nombre: displayName
      })
      toast.succes(
        'Usuario registrado exitosamente, por favor verifique su correo electronico 📧',
        {
          style: {
            'font-size': '1.5rem'
          }
        }
      )
      navigate('/')

      console.log('Documento de usuario creado en Firestore')
    } catch (error) {
      //mensajes de error
      console.log(error)

      if (error.code === 'auth/email-already-in-use') {
        toast.error(
          `El mail ingresado ya esta en uso. Ingrese otro por favor.`,
          {
            style: {
              'font-size': '1.5rem'
            }
          }
        )
      }
      if (error.code === 'auth/invalid-email') {
        toast.error(`El mail ingresado no es valido. Ingrese otro por favor.`, {
          style: {
            'font-size': '1.5rem'
          }
        })
      }
      if (error.code === 'auth/weak-password') {
        toast.error(
          `La contraseña ingresada tiene menos de 6 caracteres. Ingrese otra por favor.`,
          {
            style: {
              'font-size': '1.5rem'
            }
          }
        )
      }
    }
  }
  return (
    <SectionRegister className='section-formulario '>
      <h2>Registrarse</h2>
      <Form onSubmit={signUp}>
        <ContenedorRecuadro>
          <label htmlFor='Email'> Email</label>
          <input
            name='Email'
            type='text'
            placeholder='Ingrese su Email'
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
          />
          <p className='requisitos-input'>
            <span>Requisito:</span> Debe ser un mail valido y no debe estar en
            uso por otro usuario.
          </p>
          <label htmlFor='password'>Contraseña</label>
          <input
            name='password'
            type='password'
            placeholder='Ingrese su contraseña'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <p className='requisitos-input'>
            <span>Requisito:</span> La contraseña debe tener al menos 6
            caracteres.
          </p>
          <label htmlFor='phone'>Teléfono</label>
          <input
            name='phone'
            type='text'
            placeholder='Ingrese su número de teléfono'
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <p className='requisitos-input'>
            <span>Requisito:</span> Ingrese su telefono junsto su codigo de
            area, sin espacios,guiones o parentesis. Ejemplo: 2954599330
          </p>
          <label htmlFor='displayName'>Nombre y Apellido </label>
          <input
            name='displayName'
            type='text'
            placeholder='Nombre y apellido'
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
          <p className='requisitos-input'>
            <span>Requisito:</span> Ingrese su nombre y apellido. No se permiten
            caracteres especiales.
          </p>
          {/* {error && <p className='error'>{mensajeError}</p>} */}
          <button className='button' type='submit'>
            Registrarse
          </button>
          {registrationComplete && (
            <p>
              Registration complete! Please check your email and verify your
              account before signing in.
            </p>
          )}
        </ContenedorRecuadro>
      </Form>
      <Toaster position='top-center' reverseOrder={false} />
    </SectionRegister>
  )
}
const SectionRegister = styled.section`
  display: flex;
  flex-direction: column;

  margin: 0rem 2rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
`
const Form = styled.form`
  margin: 0rem 2rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  input {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  button {
    font-size: 2rem;
    border: white solid 1px;

    font-size: 1rem;
    padding: 8px;
    color: white;
    background-color: ${props => props.theme.global.greyF4u};
    transition: color 0.6s;
    border-radius: 2rem;
    cursor: pointer;
  }

  button:hover {
    transition: background-color 0.6s;
    background-color: black;
  }

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
`
const ContenedorRecuadro = styled.div`
  background-color: ${props => props.theme.global.lightGreyF4u} !important;
  border-radius: 2rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;

  gap: 1rem;
`
