import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { SectionAdministracion } from './Administracion'
import { useContext, useEffect, useState } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { FaCalendarPlus } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import { Modal } from './ModalAgregarDisponibilidad'
export default function ListarProductos() {
  const { productos, getProductos } = useContext(ElementosGlobales)

  //eliminar producto usando enpoint http://18.208.174.132:8080/api/productos/:id
  async function deleteProducto(id) {
    const idToast = toast.loading('Por favor espere... Borrando el producto', {
      style: {
        'font-size': '1.5rem'
      }
    })
    try {
      const response = await fetch(
        `http://18.208.174.132:8080/api/products/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (response.ok) {
        toast.success('Producto eliminado con exito.', { id: idToast })
      } else {
        // Aquí manejamos el caso de error en la respuesta del servidor
        const errorMessage = await response.text()
        toast.error('Error, no se pudo eliminar el producto' + errorMessage, {
          id: idToast
        })
      }

      await getProductos()
    } catch (error) {
      toast.error('No se pudo eliminar el producto.', { id: idToast })
    }
  }

  const [showModal, setShowModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)

  const openModal = productId => {
    setShowModal(true)
    setSelectedProductId(productId)
  }

  const closeAndClearModal = () => {
    setShowModal(false)
    setSelectedProductId(null)
  }
  return (
    <SectionAdministracion className='section-ListarProductos'>
      {' '}
      <div className='desktop '>
        <h1 style={{textAlign: "center"}}>Listar productos</h1>
        <section className='section-tabla-productos'>
          <TablaProductos>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.name}</td>
                  <td>
                    <BotonEditar>
                      <AiFillEdit />
                    </BotonEditar>

                    <BotonEliminar onClick={() => deleteProducto(producto.id)}>
                      <AiFillDelete />
                    </BotonEliminar>

                    <BotonAgregarDisponibilidad
                      onClick={() => openModal(producto.id)}
                    >
                      <FaCalendarPlus />
                    </BotonAgregarDisponibilidad>
                  </td>
                </tr>
              ))}
            </tbody>
          </TablaProductos>
        </section>
      </div>
      <div className='mobile content'>
        <h1>
          Por favor, ingresa en un dispositivo de escritorio para administrar el
          sitio
        </h1>
      </div>
      {showModal && (
        <Modal
          idProducto={selectedProductId}
          showmodal={showModal}
          setshowmodal={closeAndClearModal}
        />
      )}
      <Toaster position='top-center' reverseOrder={false} />
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
const BotonEditar = styled.button`
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
const BotonAgregarDisponibilidad = styled.button`
  svg {
    font-size: 3rem;
    color: ${props => props.theme.greyF4u};
  }
`
