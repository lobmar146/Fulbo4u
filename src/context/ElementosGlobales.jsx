import { createContext, useState, useMemo } from 'react'
import products from '../mocks/products.json'
import tags from '../mocks/tags.json'

export const ElementosGlobales = createContext({})

export default function ElementosGlobalesProvider(props) {
  const { children } = props
  const [logged, setLogged] = useState(false)
  const [productos, setProductos] = useState(products)
  const [caracteristicas, setCaracteristicas] = useState(tags)
  // Función para reorganizar el array de productos de manera aleatoria

  // Reorganizar los productos de manera aleatoria

  const shuffleArray = array => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const productosAleatorios = useMemo(
    () => shuffleArray(productos),
    [productos]
  )

  function agregarProducto(producto) {
    setProductos([...productos, producto])
  }

  function eliminarProducto(id) {
    setProductos(productos.filter(producto => producto.id !== id))
  }

  function cambiarLoggeo() {
    setLogged(!logged)
  }

  function agregarCaracteristica(caracteristica) {
    setCaracteristicas([...caracteristicas, caracteristica])
  }

  const valoresGlobales = {
    logged,
    productos,
    productosAleatorios,
    caracteristicas,
    agregarCaracteristica,
    cambiarLoggeo,
    agregarProducto,
    eliminarProducto
  }

  return (
    <ElementosGlobales.Provider value={valoresGlobales}>
      {children}
    </ElementosGlobales.Provider>
  )
}
