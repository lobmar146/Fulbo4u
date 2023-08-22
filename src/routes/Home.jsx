import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ElementosGlobales } from '../context/ElementosGlobales'
import {
  AiOutlineSearch,
  AiOutlineArrowRight,
  AiOutlineArrowLeft
} from 'react-icons/ai'
import { BsFillFilterSquareFill } from 'react-icons/bs'
import { Product } from '../components/product/Product'

// imports de imagens'
import cancha from '../assets/cancha.png'
import jugadores from '../assets/jugadores.png'
import logo from '../assets/Futbol4u-logo.svg'
import pelota from '../assets/pelota.png'
import clases from '../assets/clases.png'
import alquilar from '../assets/alquilar.png'
import inteligentes from '../assets/inteligentes.png'
import sintetico from '../assets/sintetico.png'
import botines from '../assets/botines.png'

export default function Home() {
  const productsPerPage = 10
  const { productos, productosAleatorios } = useContext(ElementosGlobales)

  const [currentPage, setCurrentPage] = useState(1)
  const [filtroCategoria, setFiltroCategoria] = useState('todos')

  const filtroCategoriaChange = e => {
    setFiltroCategoria(e.target.value)
    console.log(filtroCategoria)
  }

  //Al comenzar desde current page, se multiplica por la cantidad de productos por pagina
  // Como productos por page es 10, la primera pagina termina va a terminar en el 10
  // Como la pagina 1 termina en el 10, el primer producto de la pagina 2 es el 11
  // Y asi suceivamente
  const indexOfLastProduct = currentPage * productsPerPage

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage

  const handlePageChange = direction => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    } else if (
      direction === 'next' &&
      indexOfLastProduct < productosAleatorios.length
    ) {
      setCurrentPage(currentPage + 1)
    }
  }

  //agrega un arreglo los numeros de pagina para despues poder ponerlos en el paginador con un map
  const generatePageNumbers = () => {
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }
  // const productosAleatorios = useMemo(
  //   () => shuffleArray(productos),
  //   [productos]
  // )
  const currentProducts = productosAleatorios.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )
  //Total de productos, y cantidad total de paginas
  const totalProducts = productosAleatorios.length
  const totalPages = Math.ceil(totalProducts / productsPerPage)

  const productosFiltrados = productos.filter(producto => {
    if (filtroCategoria === 'todos') {
      return true // Mostrar todos los productos si se selecciona 'Todos'
    } else if (filtroCategoria === 'pelotas') {
      return producto.category === 1 // Filtrar por categoría 'Pelotas'
    } else if (filtroCategoria === 'canchas') {
      return producto.category === 2 // Filtrar por categoría 'Canchas'
    } else if (filtroCategoria === 'clases') {
      return producto.category === 3 // Filtrar por categoría 'Clases'
    }
  })

  useEffect(() => {}, [])
  return (
    <SectionHome>
      {/* Section del buscador */}
      <section className='searcher'>
        <SearchBar>
          <div className='search'>
            <AiOutlineSearch className='icon' />
            <input type='text' />
          </div>
          <div className='booker'>
            <h4>Buscar Ciudad</h4>
            <h4>Seleccionar Producto</h4>
            <h4>Seleccionar Fecha</h4>
            <h4>Seleccionar Hora</h4>
            <h4 id='book-button'>Reservar</h4>
          </div>
        </SearchBar>
        {/* Banner pasa a ser parte del home */}
        <div className='banner'>
          <h2>
            Bienvenidos a nuestra plataforma de reserva de canchas de fútbol y
            suministros deportivos! Aquí encontrarás todo lo que necesitas para
            disfrutar al máximo del hermoso juego del fútbol.
          </h2>
        </div>
      </section>

      {/* Seccion categorias */}
      <section className='categories'>
        <div className='title-container'>
          <div className='titulo-categoria'>
            <img src={logo} alt='logo futbol jugador' className='img-logo' />
            <h2>Categorias</h2>
          </div>

          <div className='filtro'>
            {/* select con 3 opciones: pelotas, canchas y clases  */}
            <BsFillFilterSquareFill />
            <span>Ver</span>
            <select
              className='select-categoria'
              name='categorias'
              id='categorias'
              onChange={filtroCategoriaChange}
              value={filtroCategoria}
            >
              <option value='todos'>Todos</option>
              <option value='pelotas'>Pelotas</option>
              <option value='canchas'>Canchas</option>
              <option value='clases'>Clases</option>
            </select>
          </div>
        </div>
        <div className='products-container'>
          {console.log(currentProducts)}

          {productosFiltrados.map(producto => (
            <Product
              key={producto.id}
              id={producto.id}
              name={producto.name}
              shortDescription={producto.shortDescription}
              image={producto.image[0]}
            />
          ))}
        </div>
        <div className='pagination'>
          <button
            className={currentPage === 1 ? 'disabled' : 'enabled'}
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            <AiOutlineArrowLeft></AiOutlineArrowLeft>
          </button>
          {generatePageNumbers().map(pageNumber => (
            <button
              key={pageNumber}
              className={
                (currentPage === pageNumber ? 'active' : 'enabled') +
                ' page-number'
              }
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className={
              currentProducts.length !== productsPerPage ||
              indexOfLastProduct >= productosAleatorios.length
                ? 'disabled'
                : 'enabled'
            }
            onClick={() => handlePageChange('next')}
            disabled={
              currentProducts.length !== productsPerPage ||
              indexOfLastProduct >= productosAleatorios.length
            }
          >
            {' '}
            <AiOutlineArrowRight></AiOutlineArrowRight>
          </button>
        </div>
      </section>

      <section className='recommendations'>
        <div className='title-container'>
          <div className='titulo-categoria'>
            <img src={logo} alt='logo futbol jugador' className='img-logo' />
            <h2>Recomendaciones</h2>
          </div>
        </div>
        <div className='products-container'>
          {console.log(currentProducts)}
          {currentProducts.map(producto => (
            <Product
              key={producto.id}
              id={producto.id}
              name={producto.name}
              shortDescription={producto.shortDescription}
              image={producto.image[0]}
            />
          ))}
        </div>
        <div className='pagination'>
          <button
            className={currentPage === 1 ? 'disabled' : 'enabled'}
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            <AiOutlineArrowLeft></AiOutlineArrowLeft>
          </button>
          {generatePageNumbers().map(pageNumber => (
            <button
              key={pageNumber}
              className={
                (currentPage === pageNumber ? 'active' : 'enabled') +
                ' page-number'
              }
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className={
              currentProducts.length !== productsPerPage ||
              indexOfLastProduct >= productosAleatorios.length
                ? 'disabled'
                : 'enabled'
            }
            onClick={() => handlePageChange('next')}
            disabled={
              currentProducts.length !== productsPerPage ||
              indexOfLastProduct >= productosAleatorios.length
            }
          >
            {' '}
            <AiOutlineArrowRight></AiOutlineArrowRight>
          </button>
        </div>
      </section>
    </SectionHome>
  )
}

const SectionHome = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .banner-bg__image {
    z-index: -1;
    width: 100%;
  }

  .searcher {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;

    /* la img va de fondo */
    background-image: url(${jugadores});
    background-size: cover;
    background-position: center;
    height: 100vh;
    width: 100%;
  }

  .search {
    margin-top: 1rem;
    position: relative;
  }

  .search input[type='text'] {
    background-color: #d9d9d9;
    border: none;
    border-radius: 50px;
    padding: 0.8rem;
    padding-left: 3rem;
    width: 100%;
    outline: none;
    font-size: 1rem;
    border: 2px solid black;
  }

  .icon {
    font-size: 1.4rem;
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
  }

  .booker {
    margin-top: 1rem;
    padding: 0.8rem 1rem;
    z-index: 100;
    background-color: #d9d9d9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    border-radius: 50px;
    border: 2px solid black;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
  }

  h4 {
    margin: 0;
    font-weight: 400;
    cursor: pointer;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }

  #book-button {
    text-transform: uppercase;
    font-weight: bold;
  }

  .banner {
    padding: 1rem;
    background-color: ${props => props.theme.global.greyF4u};
    color: #ffffff;
    border-radius: 40px;
    margin-bottom: 7rem;
    margin-left: 2rem;
    margin-right: 2rem;
  }

  .categories,
  .recommendations {
    width: 100%;
  }

  .title-container {
    background-color: ${props => props.theme.global.redF4u};
    display: flex;
    gap: 20px;
    padding: 1rem;
    align-items: center;
    justify-content: space-between;
    .titulo-categoria {
      display: flex;
    }

    .filtro {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      span {
        font-size: 1rem;
        font-weight: bold;
        color: white;
      }
    }
    svg {
      font-size: 1.5rem;
      color: white;
    }

    select.select-categoria {
      font-size: 1rem;
      transition: color 0.6s;
      border-radius: 2rem;
      text-align: center;
      color: white;
      border: none;
      background-color: ${props => props.theme.global.redF4u};
    }
  }

  .title-container h2 {
    color: #ffffff;
    text-transform: uppercase;
  }

  .categories .products-container,
  .recommendations .products-container {
    margin: 5rem 2rem;
  }

  .categories .products-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    justify-content: end;
    align-items: center;
    gap: 2rem;
    @media (max-width: 768px) {
      grid-template-columns: repeat(1, 1fr);
      gap: 2rem;
    }
  }

  .recommendations .products-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5rem;
    justify-items: center; /* Centrar el contenido horizontalmente */
    align-items: center; /* Centrar el contenido verticalmente */
    flex-wrap: wrap;

    @media (max-width: 768px) {
      grid-template-columns: repeat(1, 1fr);
      gap: 2rem;
    }
  }

  .product {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .product img {
    width: 50%;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .product img,
  .product h3 {
    cursor: pointer;
    transition: 0.6s;
    text-align: center;
  }

  .product img:hover {
    transform: scale(1.02);
  }

  .img-logo {
    width: 40px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;

    button.enabled,
    button.active {
      background-color: ${props => props.theme.global.greyF4u};
      border: none;
      width: 40px; /* Cambio aquí para los botones de números de página */
      transition: background-color 0.6s;
      color: white;
      padding: 0.5rem;
      border-radius: 50%;
      font-size: 1rem;
      cursor: pointer;
      /* Estilos numero de pagina */

      &:hover {
        background-color: ${props => props.theme.global.redF4u};
      }
      @media (max-width: 768px) {
        width: 40px;
      }
    }

    button.disabled {
      background-color: grey;
      border: none;
      transition: background-color 0.6s;
      color: white;
      padding: 0.5rem;
      border-radius: 50%;
      font-size: 1rem;
      cursor: not-allowed;
      @media (max-width: 768px) {
        width: 40px;
      }
    }

    button.enabled:hover {
      transition: 0.1s;
      transform: scale(1.1);
    }

    button.active {
      background-color: ${props => props.theme.global.redF4u};
    }
  }
`

const SearchBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
  flex-wrap: wrap;
`
