import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { SectionAdministracion } from './Administracion'
import { useContext } from 'react'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'

export default function ListarProductos() {
  const { productos, eliminarProducto } = useContext(ElementosGlobales)

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

                    <BotonEliminar
                      onClick={() => eliminarProducto(producto.id)}
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
