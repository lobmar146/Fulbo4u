import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { SectionAdministracion } from './Administracion'
import { useContext, useEffect } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import toast, { Toaster } from 'react-hot-toast'

export default function ListarProductos() {
  const { productos, getProductos } = useContext(ElementosGlobales)

  //eliminar producto usando enpoint http://18.208.174.132:8080/api/productos/:id
  async function deleteProducto(id) {
    const idToast = toast.loading('Por favor espere... Borrando el producto', {
      style: {
        'font-size': '1.5rem'
      }
    })
    await fetch(`http://18.208.174.132:8080/api/products/${id}`, {
      method: 'DELETE'
    })
    toast.success('Producto eliminado con exito.', { id: idToast })

    await getProductos()
  }
  return (
    <SectionAdministracion className='section-ListarProductos'>
      {' '}
      <div className='desktop '>
        <h1>Listar productos</h1>
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
