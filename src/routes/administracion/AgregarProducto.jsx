import FormProducto from '../../components/formulario/FormProducto'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { SectionAdministracion } from './Administracion'

export default function AgregarProducto() {
  const navigate = useNavigate()

  return (
    <SectionAdministracion className='section-agregarProducto '>
      <div className='desktop'>
        <h1 style={{textAlign: "center"}}>Agregar Producto</h1>
        <FormProducto />
        <button className='button' onClick={() => navigate('/administracion')}>
          Volver al panel de admin
        </button>
      </div>
      <div className='mobile'>
        <h1>
          Por favor, ingresa en un dispotivo de escritorio para administrar el
          sitio
        </h1>
      </div>
    </SectionAdministracion>
  )
}
