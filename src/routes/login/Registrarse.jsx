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

export default function IniciarSesion() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')

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

      console.log('Documento de usuario creado en Firestore')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <section className='section-formulario content'>
      <Form onSubmit={signUp}>
        <h2>Registrarse</h2>
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
        <label htmlFor='phone'>Teléfono</label>
        <input
          name='phone'
          type='text'
          placeholder='Ingrese su número de teléfono'
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <label htmlFor='displayName'>Nombre y Apellido </label>
        <input
          name='displayName'
          type='text'
          placeholder='Nombre y apellido'
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
        />
        {/* {error && <p className='error'>{mensajeError}</p>} */}
        <button type='submit'>Registrarse</button>
        {registrationComplete && (
          <p>
            Registration complete! Please check your email and verify your
            account before signing in.
          </p>
        )}
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
