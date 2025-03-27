import './App.css'
import Header from './components/header/Header'
import { Routes, Route } from 'react-router-dom'
import Home from './routes/Home'
import DetailProduct from './routes/DetailProduct'
import Footer from './components/footer/Footer'
import ElementosGlobalesProvider from './context/ElementosGlobales'
import IniciarSesion from './routes/login/IniciarSesion'
import Registrarse from './routes/login/Registrarse'
import Administracion from './routes/administracion/Administracion'
import AgregarProducto from './routes/administracion/AgregarProducto'
import ListarProductos from './routes/administracion/ListarProductos'
import { ThemeProvider } from 'styled-components'
import AdministrarCaracteristicas from './routes/administracion/AdministrarCaracteristicas'
import AdministrarDatosPersonales from './routes/administracion/AdministrarDatosPersonales'
import AdministrarUsuarios from './routes/administracion/AdministrarUsuarios'
import AdministrarCategorias from './routes/administracion/AdministrarCategorias'
import ModalContainer from './components/modal/ModalContainer'
import ConfirmarReserva from './routes/reservas/ConfirmarReserva'
import VerMisReservas from './routes/reservas/VerMisReservas'
import { FavoritesProducts } from './routes/FavoritesProducts'
import { ModalVotingContainer } from './components/valoration/ModalVotingContainer'
import ResultadoBusqueda from './routes/reservas/ResultadoBusqueda'

const theme = {
  global: {
    redF4u: '#A92923',
    greyF4u: '#2D3142',
    lightGreyF4u: '#f4f4f4'
  },
  dark: {
    primary: '#000000',
    text: '#ffffff'
  },
  light: {
    primary: '#ffffff',
    text: '#000000'
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ElementosGlobalesProvider>
        <ModalContainer />
        <ModalVotingContainer />
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/product/:id' element={<DetailProduct />} />
            <Route path='/iniciarsesion' element={<IniciarSesion />} />
            <Route path='/registrarse' element={<Registrarse />} />
            <Route path='/administracion' element={<Administracion />} />
            <Route
              path='/administracion/agregarproducto'
              element={<AgregarProducto />}
            />
            <Route
              path='/administracion/listarproductos'
              element={<ListarProductos />}
            />
            <Route
              path='/administracion/administrarCaracteristicas'
              element={<AdministrarCaracteristicas />}
            />
            <Route
              path='/administracion/administrarDatosPersonales'
              element={<AdministrarDatosPersonales />}
            />
            <Route
              path='administracion/administrarUsuarios'
              element={<AdministrarUsuarios />}
            />
            <Route
              path='administracion/administrarCategorias'
              element={<AdministrarCategorias />}
            />
            <Route path='/productosFavoritos' element={<FavoritesProducts />} />
            <Route
              path='reservas/confirmarReserva/:id'
              element={<ConfirmarReserva />}
            />{' '}
            <Route
              path='reservas/VerMisReservas'
              element={<VerMisReservas />}
            />
            <Route
              path='reservas/ResultadoBusqueda'
              element={<ResultadoBusqueda />}
            />
          </Routes>
        </main>
        <Footer />
      </ElementosGlobalesProvider>
    </ThemeProvider>
  )
}

export default App
