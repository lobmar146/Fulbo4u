import React, { useState } from 'react'
import styled from 'styled-components'
import { SectionAdministracion } from './Administracion'
import { useContext } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { Modal } from './ModalAgregarCategoria'
import toast, { Toaster } from 'react-hot-toast'

export default function AdministrarCaracteristicas() {
  const { caracteristicas, categorias, getCategorias } =
    useContext(ElementosGlobales)

  // funciones del modal

  //eliminar caractersitica al endpoint http://18.208.174.132:8080/api/caracteristicas/:id
  async function deleteCategoria(id) {
    const idToast = toast.loading(
      'Por favor espere... Borrando la categoría.',
      {
        style: {
          'font-size': '1.5rem'
        }
      }
    )

    try {
      const response = await fetch(
        `http://18.208.174.132:8080/api/category/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (response.ok) {
        toast.success('Categoría eliminada con exito.', { id: idToast })
      } else {
        // Aquí manejamos el caso de error en la respuesta del servidor
        const errorMessage = await response.text()
        if (errorMessage.includes('Cannot delete or update a parent row'))
          toast.error(
            'Error, no se puede eliminar la categoría ya que esta asignada a uno mas productos.',
            {
              id: idToast
            }
          )
      }
    } catch (error) {
      toast.error(
        'Tuvimos un problema al intentar borrar la categoría.' + error,
        {
          id: idToast
        }
      )
    }

    await getCategorias()
  }

  const [showmodal, setshowmodal] = useState(false)

  const openModal = () => {
    setshowmodal(prev => !prev)
  }
  return (
    <SectionAdministracion className='section-ListarProductos'>
      {' '}
      <div className='desktop '>
        <h1 style={{textAlign: "center"}}>Listado de Categorías</h1>

        {/* contenedor que alinea a la izquierda el boton */}
        <ContenedorBotones>
          <button className='button' onClick={openModal}>
            Agregar Nueva +
          </button>
          <Modal showmodal={showmodal} setshowmodal={setshowmodal} />
        </ContenedorBotones>
        {!categorias.length == 0 ? (
          <section className='section-tabla-productos'>
            <TablaProductos>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Categoría </th>
                  <th>Detalle </th>
                  <th>Acciones </th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(categoria => (
                  <tr key={categoria.id}>
                    <td>{categoria.id}</td>
                    <td>
                      <img
                        src={`${categoria.emojis[0].url}`}
                        alt='Imagen de la categoría'
                        width={70}
                      />
                    </td>

                    <td>{categoria.name}</td>
                    <td>
                      {categoria.detail}
                      {/* <img src={categoria.emojis.url} />
                      {console.log(categoria.emojis.url)} */}
                    </td>
                    <td>
                      <BotonEditar>
                        <AiFillEdit />
                      </BotonEditar>

                      <BotonEliminar
                        onClick={() => deleteCategoria(categoria.id)}
                      >
                        <AiFillDelete />
                      </BotonEliminar>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TablaProductos>
          </section>
        ) : (
          <p>Cargando...</p>
        )}
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
