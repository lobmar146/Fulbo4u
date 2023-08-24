import React, { useContext, useEffect, useState } from 'react'
import {
  getFirestore,
  collection,
  doc,
  updateDoc,
  getDocs
} from 'firebase/firestore'
import { app, db } from '../../firebase'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import { SectionAdministracion } from './Administracion'
import styled from 'styled-components'
import toast, { Toaster } from 'react-hot-toast'
import { AiFillEdit } from 'react-icons/ai'

export default function AdministrarUsuarios() {
  const [documents, setDocuments] = useState([])

  const makeAdmin = async id => {
    try {
      const docId = id // tomamos el id del doc
      const docRef = doc(db, 'usuarios', docId)

      await updateDoc(docRef, {
        rol: 'admin'
      })

      console.log('Documento modificado con éxito')
      toast.success('Usuario modificado con éxito')

      // Actualizar el estado de documents después de hacer a alguien administrador
      setDocuments(prevDocuments => {
        const updatedDocuments = prevDocuments.map(doc => {
          if (doc.id === id) {
            return { ...doc, rol: 'admin' }
          }
          return doc
        })
        return updatedDocuments
      })
    } catch (error) {
      console.error('Error al modificar el documento:', error)
    }
  }

  const makeUser = async id => {
    try {
      const docId = id // tomamos el id del doc
      const docRef = doc(db, 'usuarios', docId)

      await updateDoc(docRef, {
        rol: 'user'
      })

      console.log('Documento modificado con éxito')
      toast.success('Usuario modificado con éxito')

      // Actualizar el estado de documents después de hacer a alguien usuario
      setDocuments(prevDocuments => {
        const updatedDocuments = prevDocuments.map(doc => {
          if (doc.id === id) {
            return { ...doc, rol: 'user' }
          }
          return doc
        })
        return updatedDocuments
      })
    } catch (error) {
      console.error('Error al modificar el documento:', error)
    }
  }

  useEffect(() => {
    const firestore = getFirestore(app)
    const collectionRef = collection(firestore, 'usuarios')

    getDocs(collectionRef)
      .then(querySnapshot => {
        const documentArray = []
        querySnapshot.forEach(doc => {
          documentArray.push({ id: doc.id, ...doc.data() })
        })
        setDocuments(documentArray)
      })
      .catch(error => {
        console.log('Error fetching documents:', error)
      })
  }, [])

  return (
    <SectionAdministracion>
      <SectionAdministrarProductos>
        <div className='desktop'>
          <h2>Documentos en la colección:</h2>
          {documents.length === 0 ? (
            <p>Cargando</p>
          ) : (
            <TablaProductos>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Tipo de Cuenta</th>
                  <th>Upgrade to Admin</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(document => (
                  <tr key={document.id}>
                    <td>{document.id}</td>
                    <td>{document.correo}</td>
                    <td>{document.rol}</td>
                    <td>
                      {/* si el rol es admin hacer user */}
                      {document.rol === 'admin' ? (
                        <button onClick={() => makeUser(document.id)}>
                          {' '}
                          Hacer User
                        </button>
                      ) : (
                        <button onClick={() => makeAdmin(document.id)}>
                          {' '}
                          Hacer Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TablaProductos>
          )}
        </div>
        <div className='mobile content'>
          <h1>
            Por favor, ingresa en un dispotivo de escritorio para administrar el
            sitio
          </h1>
        </div>
        <Toaster position='top-center' reverseOrder={false} />
      </SectionAdministrarProductos>
    </SectionAdministracion>
  )
}
const TablaProductos = styled.table`
  width: 90%;
  border-collapse: collapse;
  border: 1px solid black;
  th {
    border: 1px solid black;
    padding: 0.5rem;
  }
  td {
    border: 1px solid black;
    padding: 0.5rem;
    text-align: center;
    button {
      margin: 0 0.5rem;
    }

    font-size: 1.5rem;
  }
`
const SectionAdministrarProductos = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;

  align-items: center;
  justify-content: center;

  ul {
    list-style: none;
    li {
      margin: 1rem;
    }
  }
`
