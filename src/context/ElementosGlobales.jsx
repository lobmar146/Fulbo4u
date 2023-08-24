import { createContext, useState, useMemo } from 'react'
import { useEffect } from 'react'

import products from '../mocks/products.json'
import tags from '../mocks/tags.json'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc
} from 'firebase/firestore'
import { app } from '../firebase'

export const ElementosGlobales = createContext({})

export default function ElementosGlobalesProvider(props) {
  const { children } = props
  const [logged, setLogged] = useState(false)
  const [productos, setProductos] = useState(products)
  const [caracteristicas, setCaracteristicas] = useState(tags)

  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState({ uid: '', email: '', rol: '' })
  const firestore = getFirestore(app)

  async function getUserData(uid) {
    const docuRef = doc(firestore, `usuarios/${uid}`)
    const docuCifrada = await getDoc(docuRef)
    const userData = docuCifrada.data()
    return userData
  }

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
        setUserData(null)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      getUserData(user.uid)
        .then(userData => {
          setUserData({
            ...userData,
            uid: user.uid
          })
          console.log('userData final', userData)
        })
        .catch(error => {
          console.log('Error fetching user data:', error)
        })
    }
  }, [user])
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
    user,
    userData,
    setUserData,
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
