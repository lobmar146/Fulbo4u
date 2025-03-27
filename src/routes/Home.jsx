//calendario
import { subDays } from 'date-fns'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
const fechaMinima = subDays(new Date(), 1)
import { useContext, useState, useRef, useEffect } from 'react'
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

import jugadores from '../assets/jugadores.png'
import logo from '../assets/Futbol4u-logo.svg'

import toast, { Toaster } from 'react-hot-toast'
import TextToSpeachButton from '../components/accesibilidad/TextToSpeechButton'
import WhatsAppButton from '../components/whatsapp/Whatsappbutton'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  //navegador
  const navigate = useNavigate()
  //estado para useRef
  const categoryProductsContainerRef = useRef(null)
  const recommendationProductsContainerRef = useRef(null)
  //estado que hace aparecer el buscador de fecha
  const [buscarDisponibilidadFecha, setBuscarDisponibilidadFecha] =
    useState(false)
  const [buscarHorasDisponibles, setBuscarHorasDisponibles] = useState(false) //estado de la barra de busqueda
  const [selectedHour, setSelectedHour] = useState('08:00 a 10:00 hs') //estado de la hora seleccionada
  //estados de las barra de busqueda
  const [highlightedIndex, setHighlightedIndex] = useState(-1) // Inicialmente no se resalta ningún elemento
  const [panelAbierto, setPanelAbierto] = useState('panelCerrado') // Inicialmente el panel está cerrado
  const productsPerPage = 10

  const {
    productos,
    productosAleatorios,
    user,
    categorias,
    favorites,
    cantFavorites,
    setModalMessage,
    fechaReservaSeleccionada,
    horaReservaSeleccionada,
    setFechaReservaSeleccionada,
    setHoraReservaSeleccionada,
    searchedName,
    setSearchedName
  } = useContext(ElementosGlobales)

  const [currentPagerRecomendation, setCurrentPageRecomendation] = useState(1)
  const [currentPagerCategory, setCurrentPagerCategory] = useState(1)
  const [filtroCategoria, setFiltroCategoria] = useState('todos')

  const filtroCategoriaChange = e => {
    setCurrentPagerCategory(1)
    setFiltroCategoria(e.target.value)
    console.log(filtroCategoria)
  }

  const categoriaSeleccionada = categorias.find(
    categoria => categoria.name === filtroCategoria
  )

  const productosFiltrados = productos.filter(producto => {
    if (categoriaSeleccionada) {
      return producto.category.id === categoriaSeleccionada.id
    } else {
      return true // No se aplican filtros si no hay categoría seleccionada
    }
  })

  //Al comenzar desde current page, se multiplica por la cantidad de productos por pagina
  // Como productos por page es 10, la primera pagina termina va a terminar en el 10
  // Como la pagina 1 termina en el 10, el primer producto de la pagina 2 es el 11
  // Y asi suceivamente
  const indexOfLastProductRecomendation =
    currentPagerRecomendation * productsPerPage

  const indexOfFirstProductRecomendation =
    indexOfLastProductRecomendation - productsPerPage

  const indexOfLastProducCategory = currentPagerCategory * productsPerPage

  const indexOfFirstProductCategory =
    indexOfLastProducCategory - productsPerPage

  const handlePageChangeRecomendation = direction => {
    if (direction === 'prev' && currentPagerRecomendation > 1) {
      setCurrentPageRecomendation(currentPagerRecomendation - 1)
    } else if (
      direction === 'next' &&
      indexOfLastProductRecomendation < productosAleatorios.length
    ) {
      setCurrentPageRecomendation(currentPagerRecomendation + 1)
    }

    // Mantén el scroll en la parte superior del contenedor de productos
    if (recommendationProductsContainerRef.current) {
      recommendationProductsContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const handlePageChangeCategory = direction => {
    if (direction === 'prev' && currentPagerCategory > 1) {
      setCurrentPagerCategory(currentPagerCategory - 1)
    } else if (
      direction === 'next' &&
      indexOfLastProducCategory < productos.length
    ) {
      setCurrentPagerCategory(currentPagerCategory + 1)
    }

    // Mantén el scroll en la parte superior del contenedor de productos
    if (categoryProductsContainerRef.current) {
      categoryProductsContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  //agrega un arreglo los numeros de pagina para despues poder ponerlos en el paginador con un map
  const generatePageNumbersRecomendation = () => {
    const pageNumbers = []
    for (let i = 1; i <= totalPagesRecomendation; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  const generatePageNumbersCategory = () => {
    const pageNumbers = []
    for (let i = 1; i <= totalPagesCategory; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  const currentProducts = productosAleatorios.slice(
    indexOfFirstProductRecomendation,
    indexOfLastProductRecomendation
  )

  const currentProductsCategory = productosFiltrados.slice(
    indexOfFirstProductCategory,
    indexOfLastProducCategory
  )
  //Total de productos, y cantidad total de paginas
  const totalProductsRecomendation = productosAleatorios.length
  const totalPagesRecomendation = Math.ceil(
    totalProductsRecomendation / productsPerPage
  )

  const totalProductsCategory = productosFiltrados.length
  const totalPagesCategory = Math.ceil(totalProductsCategory / productsPerPage)
  // estados del buscador
  const [searchText, setSearchText] = useState('')
  const [idSearchTextProduct, setIdSearchTextProduct] = useState(0)
  const [selectedDate, setSelectedDate] = useState('')
  const [suggestions, setSuggestions] = useState([])
  // Fechas que deseas desactivar (en formato JavaScript Date)
  const enabledDates = [
    new Date('2023-09-05'),
    new Date('2023-09-08'),
    new Date('2023-09-15'),
    new Date('2023-09-16'),
    new Date('2023-09-23'),
    new Date('2023-09-24')
  ]

  // Función para desactivar fechas

  const isDateDisabled = date => {
    const today = new Date()
    enabledDates.push(today)
    // Verifica si la fecha está en la lista de fechas desactivadas
    return enabledDates.some(
      disabledDate =>
        date.getFullYear() === disabledDate.getFullYear() &&
        date.getMonth() === disabledDate.getMonth() &&
        date.getDate() === disabledDate.getDate()
    )
  }

  //validar campo producto de la reservas
  const validarProducto = () => {
    //validar que el producto exista
    if (searchText === '') {
      toast.error(`Debe ingresar un producto para buscar fechas disponibles`, {
        style: { 'font-size': '1.5rem' }
      })
    } else {
      toast.success(
        `Mostrando fechas disponibles para el elemento ${searchText}`
      )
      setBuscarDisponibilidadFecha(true)
    }
  }
  const validarFecha = () => {
    if (selectedDate === '') {
      toast.error(`Debe seleccionar una fecha`, {
        style: { 'font-size': '1.5rem' }
      })
    } else {
      toast.success(
        `Mostrando horarios disponibles para el día ${selectedDate} `,
        {
          style: { 'font-size': '1.5rem' }
        }
      )

      setBuscarHorasDisponibles(true)
    }
  }
  // Función para manejar cambios en el campo de búsqueda
  // Función para manejar cambios en el campo de búsqueda
  const handleSearchChange = e => {
    const value = e.target.value
    setSearchText(value)

    // Filtrar productos que coincidan con el texto de búsqueda o mostrar todos si no hay búsqueda
    const matchingProducts = value
      ? productos.filter(product =>
          product.name.toLowerCase().includes(value.toLowerCase())
        )
      : []
    //abre o cierrra el panel segun si hay texto en la barrade busqueda

    // Actualizar las sugerencias
    setSuggestions(matchingProducts)
    // Restablece la posición resaltada
    setHighlightedIndex(-1)
  }

  const handleKeyDown = e => {
    if (suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault() // Evita el desplazamiento del cursor en el campo de entrada
      setHighlightedIndex(prevIndex => {
        const nextIndex =
          prevIndex + 1 >= suggestions.length ? 0 : prevIndex + 1
        setSearchText(suggestions[nextIndex].name) // Actualiza el searchText
        setIdSearchTextProduct(suggestions[nextIndex]?.id || 0)
        return nextIndex
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault() // Evita el desplazamiento del cursor en el campo de entrada
      setHighlightedIndex(prevIndex => {
        const nextIndex =
          prevIndex - 1 < 0 ? suggestions.length - 1 : prevIndex - 1
        setSearchText(suggestions[nextIndex].name) // Actualiza el searchText
        setIdSearchTextProduct(suggestions[nextIndex]?.id || 0)
        return nextIndex
      })
    } else if (e.key === 'Enter') {
      // Aquí puedes manejar la selección del elemento resaltado
      if (highlightedIndex !== -1) {
        // Realiza alguna acción cuando se presiona Enter en un elemento resaltado
        console.log(`Seleccionado: ${suggestions[highlightedIndex].name}`)
        setSuggestions([])
      }
    }
  }

  const handleMouseEnter = index => {
    // Resalta el elemento al pasar el mouse sobre él
    setHighlightedIndex(index)
  }

  const handleMouseLeave = () => {
    // Quita el resaltado al sacar el mouse de la lista
    setHighlightedIndex(-1)
  }

  useEffect(() => {
    setModalMessage('para darle favorito a un producto')
  }, [])

  const buscarReservas = () => {
    if (selectedDate) {
      const day = selectedDate.getDate()
      const month = selectedDate.getMonth() + 1
      const year = selectedDate.getFullYear()

      const addLeadingZero = value => {
        return value < 10 ? `0${value}` : value
      }

      const formattedDate = `${addLeadingZero(year)}-${addLeadingZero(
        month
      )}-${day}`

      setFechaReservaSeleccionada(formattedDate)
    } else {
      setFechaReservaSeleccionada(selectedDate)
    }

    setHoraReservaSeleccionada(selectedHour)
    setSearchedName(searchText)
    // console.log('id del producto ', idSearchTextProduct)
    // console.log(fechaReservaSeleccionada)
    // console.log(horaReservaSeleccionada)
    // console.log(searchedName)
    navigate('/reservas/ResultadoBusqueda')
  }
  return (
    <SectionHome>
      <div className='title-container'>
        <div className='titulo-categoria'>
          <img src={logo} alt='logo futbol jugador' className='img-logo' />
          <h2>Busca y reserva tu Producto</h2>
          <TextToSpeachButton textToSpeak='Busca y reserva tu Producto' />
        </div>
      </div>
      {/* Section del buscador */}
      <section className='searcher'>
        {user && !user.emailVerified && (
          <VertifiqueSuCuenta>
            Verifique su cuenta para tener mas funcionalidades
            {toast(' Verifique su cuenta para tener mas funcionalidades', {
              icon: '📧',
              style: {
                'font-size': '1.5rem'
              }
            })}
          </VertifiqueSuCuenta>
        )}

        <SearchBar>
          <div className='search'>
            <AiOutlineSearch className='icon' />
            <div className='buscar-fechas'>
              <input
                type='text'
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                alt='Buscador de productos'
              />
              {/* <button onClick={() => validarProducto()} className='button'>
                Ver disponibilidad
              </button> */}
            </div>
            {suggestions.length > 0 && ( // Agrega esta condición
              <ul className='suggestions'>
                {suggestions.map((product, index) => (
                  <li
                    key={product.id}
                    className={index === highlightedIndex ? 'highlighted' : ''}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                      setSearchText(product.name)
                      setSuggestions([])
                    }}
                  >
                    <img
                      width={30}
                      src={`${product.images[0].url}`}
                      alt='imagen de búsqueda de producto'
                    />
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* {buscarDisponibilidadFecha && ( */}
          <div className='booker'>
            <label htmlFor='datePicker'>Selecciona una fecha:</label>
            <DatePicker
              id='datePicker'
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              filterDate={date => date >= fechaMinima}
            />
            {/* <button onClick={() => validarFecha()} className='button'>
              {' '}
              Buscar
            </button> */}
          </div>
          {/* )} */}
          {/* {buscarHorasDisponibles && ( */}
          <div className='booker'>
            <label htmlFor='selectorHora'>Selecciona una hora:</label>
            {/* //un seleect con las siguientes opciones : 08:00 a 10:00 hs,
                  10:00 a 12:00 hs, 12:00 a 14:00 hs, 14:00 a 16:00 hs, 16:00 a
                  18:00 hs, 18:00 a 20:00 hs */}
            <select
              value={selectedHour}
              onChange={e => setSelectedHour(e.target.value)}
            >
              <option value='08:00 a 10:00 hs'>08:00 a 10:00 hs</option>
              <option value='10:00 a 12:00 hs'>10:00 a 12:00 hs</option>
              <option value='12:00 a 14:00 hs'>12:00 a 14:00 hs</option>
              <option value='14:00 a 16:00 hs'>14:00 a 16:00 hs</option>
              <option value='16:00 a 18:00 hs'>16:00 a 18:00 hs</option>
            </select>
            <button onClick={() => buscarReservas()} className='button'>
              Buscar disponibilidad
            </button>
          </div>
          {/* )} */}
        </SearchBar>
        {/* Banner pasa a ser parte del home */}
        <div className='banner'>
          <h2>
            Bienvenidos a nuestra plataforma de reserva de canchas de fútbol y
            suministros deportivos! Aquí encontrarás todo lo que necesitas para
            disfrutar al máximo del hermoso juego del fútbol.
          </h2>
          <TextToSpeachButton
            textToSpeak='Bienvenidos a nuestra plataforma de reserva de canchas de fútbol y
            suministros deportivos! Aquí encontrarás todo lo que necesitas para
            disfrutar al máximo del hermoso juego del fútbol.'
          />
        </div>
      </section>
      {console.log(productos.length)}
      {productos.length === 0 || categorias.length === 0 ? (
        <h1>Cargando...</h1>
      ) : (
        <>
          {/* Seccion categorias */}
          <section className='categories' ref={categoryProductsContainerRef}>
            <div className='title-container'>
              <div className='titulo-categoria'>
                <img
                  src={logo}
                  alt='logo futbol jugador'
                  className='img-logo'
                />
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
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.name}>
                      {categoria.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='products-container'>
              {console.log(currentProductsCategory)}

              {currentProductsCategory.map(producto => (
                <Product
                  key={producto.id}
                  id={producto.id}
                  name={producto.name}
                  shortDescription={producto.short_detail}
                  image={
                    producto.images &&
                    producto.images.length > 0 &&
                    producto.images[0].url
                  }
                  isFavorito={
                    user && cantFavorites > 0
                      ? favorites.some(
                          favProductId => favProductId === producto.id
                        )
                      : false
                  }
                />
              ))}
            </div>

            <div className='pagination'>
              <button
                className={currentPagerCategory === 1 ? 'disabled' : 'enabled'}
                onClick={() => handlePageChangeCategory('prev')}
                disabled={currentPagerCategory === 1}
              >
                <AiOutlineArrowLeft></AiOutlineArrowLeft>
              </button>
              {generatePageNumbersCategory().map(pageNumber => (
                <button
                  key={pageNumber}
                  className={
                    (currentPagerCategory === pageNumber
                      ? 'active'
                      : 'enabled') + ' page-number'
                  }
                  onClick={() => {
                    setCurrentPagerCategory(pageNumber)
                    // Mantén el scroll en la parte superior del contenedor de productos
                    if (categoryProductsContainerRef.current) {
                      categoryProductsContainerRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      })
                    }
                  }}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className={
                  currentProductsCategory.length !== productsPerPage ||
                  indexOfLastProducCategory >= productosFiltrados.length
                    ? 'disabled'
                    : 'enabled'
                }
                onClick={() => handlePageChangeCategory('next')}
                disabled={
                  currentProductsCategory.length !== productsPerPage ||
                  indexOfLastProducCategory >= productosFiltrados.length
                }
              >
                {' '}
                <AiOutlineArrowRight></AiOutlineArrowRight>
              </button>
            </div>
          </section>
          {/* recomendaciones  */}
          <section
            className='recommendations'
            ref={recommendationProductsContainerRef}
          >
            <div className='title-container'>
              <div className='titulo-categoria'>
                <img
                  src={logo}
                  alt='logo futbol jugador'
                  className='img-logo'
                />
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
                  shortDescription={producto.short_detail}
                  image={
                    producto.images &&
                    producto.images.length > 0 &&
                    producto.images[0].url
                  }
                  isFavorito={
                    user && cantFavorites > 0
                      ? favorites.some(
                          favProductId => favProductId === producto.id
                        )
                      : false
                  }
                />
              ))}
            </div>
            <div className='pagination'>
              <button
                className={
                  currentPagerRecomendation === 1 ? 'disabled' : 'enabled'
                }
                onClick={() => handlePageChangeRecomendation('prev')}
                disabled={currentPagerRecomendation === 1}
              >
                <AiOutlineArrowLeft></AiOutlineArrowLeft>
              </button>
              {generatePageNumbersRecomendation().map(pageNumber => (
                <button
                  key={pageNumber}
                  className={
                    (currentPagerRecomendation === pageNumber
                      ? 'active'
                      : 'enabled') + ' page-number'
                  }
                  onClick={() => {
                    if (recommendationProductsContainerRef.current) {
                      console.log('efecto')
                      recommendationProductsContainerRef.current.scrollIntoView(
                        {
                          behavior: 'smooth',
                          block: 'start'
                        }
                      )
                    }
                    setCurrentPageRecomendation(pageNumber)
                  }}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className={
                  currentProducts.length !== productsPerPage ||
                  indexOfLastProductRecomendation >= productosAleatorios.length
                    ? 'disabled'
                    : 'enabled'
                }
                onClick={() => handlePageChangeRecomendation('next')}
                disabled={
                  currentProducts.length !== productsPerPage ||
                  indexOfLastProductRecomendation >= productosAleatorios.length
                }
              >
                {' '}
                <AiOutlineArrowRight></AiOutlineArrowRight>
              </button>
            </div>
          </section>
        </>
      )}
      <WhatsAppButton phoneNumber='5491127164470' />
      <Toaster position='top-center' reverseOrder={false} />
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
  .buscar-fechas {
    display: flex;
  }
  .button {
    font-size: 2rem;
    border: white solid 1px;

    font-size: 1rem;
    padding: 8px;
    color: white;
    background-color: ${props => props.theme.global.greyF4u};
    transition: color 0.6s;
    border-radius: 2rem;
    border: none;
    cursor: pointer;
  }
  .suggestions {
    position: absolute;
    max-height: 200px; /* Establece la altura máxima deseada */
    overflow-y: auto; /* Agrega una barra de desplazamiento vertical si es necesario */
    border: 1px solid #ccc;
    background-color: #e0e0e0;
    width: 100%;
    z-index: 1000; /* Asegúrate de que las sugerencias estén en la parte superior */
    border-radius: 1rem;
    border: 2px solid ${props => props.theme.global.greyF4u};
  }
  .suggestions li {
    padding: 0.5rem;
    cursor: pointer;
    transition: 0.6s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .suggestions li.highlighted {
    color: white;
    background-color: ${props => props.theme.global.greyF4u};
    font-weight: bold; /* Cambia el estilo de fuente según tus preferencias */
    /* Agrega cualquier otro estilo que desees para el elemento resaltado */
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
    gap: 0.5rem;
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
    display: flex;
    padding: 1rem;
    background-color: ${props => props.theme.global.greyF4u};
    align-items: center;
    gap: 0.5rem;
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
    background-color: ${props => props.theme.global.greyF4u};
    display: flex;
    gap: 20px;
    padding-left: 2rem;
    padding-right: 4rem;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .titulo-categoria {
      display: flex;
      gap: 0.5rem;
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
      padding: 0.5rem;
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
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`
const VertifiqueSuCuenta = styled.p`
  color: white;
  background-color: ${props => props.theme.global.redF4u};
  border: 2px solid white;
  border-style: dotted;
  padding: 1rem;
`
