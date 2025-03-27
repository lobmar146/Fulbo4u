import React, { useState } from 'react'
import styled from 'styled-components'
import { SectionAdministracion } from './Administracion'
import { useContext } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { Modal } from './Modal'
import toast, { Toaster } from 'react-hot-toast'

export default function AdministrarCaracteristicas() {
  const { caracteristicas, eliminarCaracteristica, getCaracteristicas } =
    useContext(ElementosGlobales)

  // funciones del modal

  //eliminar caractersitica al endpoint http://18.208.174.132:8080/api/caracteristicas/:id
  async function deleteCaracteristica(id) {
    const idToast = toast.loading(
      'Por favor espere... Borrando la caracteristica',
      {
        style: {
          'font-size': '1.5rem'
        }
      }
    )
    try {
      const reponse = await fetch(
        `http://18.208.174.132:8080/api/caracteristicas/${id}`,
        {
          method: 'DELETE'
        }
      )
      const data = await reponse.json()
      toast.success('Caracteristica eliminada con exito.', { id: idToast })
    } catch (error) {
      toast.error('Tuvimos un problema al intentar borrar la categoria.', {
        id: idToast
      })
    }

    await getCaracteristicas()
  }
  const [showmodal, setshowmodal] = useState(false)

  const openModal = () => {
    setshowmodal(prev => !prev)
  }
  return (
    <SectionAdministracion className='section-ListarProductos'>
      {' '}
      <div className='desktop '>
        <h1 style={{textAlign: "center"}}>Listado de Caracteristicas</h1>
        {/* contenedor que alinea a la izquierda el boton */}
        <ContenedorBotones>
          <button className='button' onClick={openModal}>
            Agregar Nueva +
          </button>
          <Modal showmodal={showmodal} setshowmodal={setshowmodal} />
        </ContenedorBotones>
        <section className='section-tabla-productos'>
          <TablaProductos>
            <thead>
              <tr>
                <th>ID</th>
                <th>Emoji y Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {caracteristicas.map(caracteristica => (
                <tr key={caracteristica.id}>
                  <td>{caracteristica.id}</td>
                  <td>{caracteristica.emoji + caracteristica.name}</td>
                  <td>
                    <BotonEditar>
                      <AiFillEdit />
                    </BotonEditar>

                    <BotonEliminar
                      onClick={() => deleteCaracteristica(caracteristica.id)}
                    >
                      <AiFillDelete />
                    </BotonEliminar>
                  </td>
                </tr>
              ))}
            </tbody>
          </TablaProductos>
        </section>
      </div>
      <div className='mobile content'>
        <h1>
          Por favor, ingresa en un dispotivo de escritorio para administrar el
          sitio
        </h1>
      </div>
      <Toaster position='top-center' reverseOrder={false} />
    </SectionAdministracion>
  )
}

// boton alineado a la izquierda
const ContenedorBotones = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 97%;
`

export const TablaProductos = styled.table`
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
export const BotonEditar = styled.button`
  svg {
    font-size: 3rem;
    color: #787878;
  }
`
const BotonEliminar = styled.button`
  svg {
    font-size: 3rem;
    color: red;
  }
`
