import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

export default function Administracion() {
  const navigate = useNavigate()
  return (
    <SectionAdministracion className='section-administracion '>
      <div className='desktop'>
        <h1>Administracion</h1>
        <div className='contendor-botones'>
          <button
            className='button'
            onClick={() => navigate('/administracion/agregarproducto')}
          >
            Agregar Producto
          </button>
          <button
            className='button'
            onClick={() => navigate('/administracion/listarproductos')}
          >
            Listar Productos
          </button>
          <button
            className='button'
            onClick={() =>
              navigate('/administracion/administrarCaracteristicas')
            }
          >
            Administrar Caracteristicas
          </button>
          <button
            className='button'
            onClick={() => navigate('/administracion/administrarUsuarios')}
          >
            Administrar Usuarios
          </button>
          <button
            className='button'
            onClick={() => navigate('/administracion/administrarCategorias')}
          >
            Administrar Categorias
          </button>
        </div>
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

export const SectionAdministracion = styled.section`
  position: relative; /* Add this to enable absolute positioning */
  min-height: 100vh; /* Set a minimum height to ensure footer stays at bottom */
  display: flex;
  flex-direction: column;
  width: 100%;

  h1 {
    margin-left: 2rem;
  }

  .mobile {
    height: calc(100vh - 248px);
    @media (min-width: 768px) {
      display: none;
    }
  }

  .desktop {
    h2 {
      margin-left: 2rem;
    }
    button {
      margin: 2rem;
    }
    @media (max-width: 768px) {
      display: none;
    }
  }

  .contendor-botones {
    display: flex;

    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
  }

  .button {
    margin-bottom: 10px;
    padding: 15px 30px;
    font-size: 18px;
    text-align: center;
    background-color: ${props => props.theme.global.greyF4u};
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 2rem;
  }

  .button:hover {
    background-color: black;
  }

  .section-tabla-productos {
    /* Remove the height rule to allow content to expand */
    display: flex;
    justify-content: center;
    align-items: center; /* Center vertically */
    margin-bottom: 2rem;
    position: relative; /* Enable relative positioning for the footer */
  }

  .section-tabla-productos::after {
    content: ''; /* Create an empty element */
    position: absolute;
    bottom: 0; /* Stick to the bottom */
    left: 0;
    width: 100%;
    height: 20px; /* Set a height for the footer */
  }
`
