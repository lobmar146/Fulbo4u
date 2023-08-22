import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useState } from 'react'
import { GiSoccerBall } from 'react-icons/gi'
import BurguerButton from './BurgerButton'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/Futbol4u-logo.svg'

export default function Header() {
  const { logged, cambiarLoggeo } = useContext(ElementosGlobales)
  const [clicked, setClicked] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    setClicked(!clicked)
  }
  return (
    <HeaderWrapper>
      {/* Contenedor logo del header */}

      {/* logo */}
      <Link to='/'>
        <div className='contenedor-logo'>
          <img className='logo' src={logo} alt='logo' />

          <h1>FULBO4U</h1>
        </div>
      </Link>

      {/* Contenedor de los botones */}
      <div className={`nav-container ${clicked ? 'active' : ''}`}>
        {logged ? (
          <>
            <span>¡Bienvenido Admin!</span>
            <Link to='/administracion'>Administrar Productos </Link>
            <Link
              onClick={() => {
                cambiarLoggeo()
              }}
              to='/'
            >
              Cerrar Sesion
            </Link>
          </>
        ) : (
          <>
            <div className='buttons-container'>
              {' '}
              <Link to='/' className='button'>
                Crear Cuenta
              </Link>
              <Link to='/iniciarsesion' className='button'>
                Iniciar Sesión
              </Link>
            </div>
          </>
        )}
      </div>

      <div className='burger'>
        <BurguerButton clicked={clicked} handleClick={handleClick} />
      </div>
      <BgDiv className={`initial ${clicked ? ' active' : ''}`}></BgDiv>
    </HeaderWrapper>
  )
}
const HeaderWrapper = styled.header`
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5rem;
  width: 100%;
  height: 7rem;

  position: sticky;
  margin-top: 0;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${props => props.theme.global.redF4u};

  .logo {
    width: 100%;
    height: 3.5rem;
  }

  h1 {
    color: white;
  }

  .nav-container a {
    color: white;
    padding: 0.5rem;
    text-decoration: none;
    border: 0.1rem solid white;
    border-radius: 5rem;
    margin-right: 1rem;
  }

  .nav-container {
    position: absolute;
    top: -700px;
    left: -2000px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    a {
      color: black;
      font-size: 1.5rem;
      display: block;
    }
    /* media query que trae el nav a posicion in */
    @media (min-width: 768px) {
      position: initial;
      margin: 0;
      a {
        display: inline;
        color: white;
        font-size: 1rem;
      }

      .buttons-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .button {
        background-color: ${props => props.theme.global.greyF4u};
        border: none;
        width: 130px;
        transition: background-color 0.6s;
      }

      .button:hover {
        background-color: #000000;
      }
    }
    /* estilos del cartel usuario bienvenido */
    span {
      color: white;
      margin-right: 1rem;
    }
  }

  .nav-container.active {
    width: 100%;
    display: block;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    top: 317%;
    left: 0;
    right: 0;
    text-align: center;
    a {
      color: white;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid white;
    }
  }
  .burger {
    padding: 1rem;
    @media (min-width: 768px) {
      display: none;
    }
  }

  .contenedor-logo {
    margin-top: 4.6rem;
    display: flex;
    align-items: flex-start;
    margin-left: 2rem;
    img {
      position: relative;
      bottom: 2.3rem;
      width: 100%;
      height: 5.5rem;
    }
    @media (max-width: 768px) {
      h1 {
        display: none;
      }
    }
  }
`
const BgDiv = styled.div`
  background-color: ${props => props.theme.global.redF4u};
  position: absolute;
  top: -1000px;
  left: -1000px;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: all 0.6s ease;

  &.active {
    border-radius: 0 0 80% 0;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
`
