import { createContext, useState, useMemo } from "react";
import { useEffect } from "react";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { app } from "../firebase";
import { toast, Toaster } from "react-hot-toast";

export const ElementosGlobales = createContext({});

export default function ElementosGlobalesProvider(props) {
  const { children } = props;
  const [logged, setLogged] = useState(false);
  const [productos, setProductos] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ uid: "", email: "", rol: "" });
  const firestore = getFirestore(app);
  const [showModal, setShowModal] = useState(false);

  //ESTADOS Y FUNCIONES DE FAVORITOS
  const [favorites, setFavorites] = useState([]);
  const cantFavorites = favorites.length;

  function addFavorite(item) {
    const newFavorites = [...favorites, item];
    setFavorites(newFavorites);
  }

  function removeFavorite(itemId) {
    const updatedFavorites = favorites.filter(
      (favoriteId) => favoriteId !== itemId
    );
    setFavorites(updatedFavorites);
  }

  //USEEFFECT DE FAVORITOS
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoritesProducts");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    if (cantFavorites > 0) {
      localStorage.setItem("favoritesProducts", JSON.stringify(favorites));
    } else {
      localStorage.removeItem("favoritesProducts");
    }
  }, [favorites]);

  //estado que indica que se cargaron los productos de la bbdd
  const [productosCargados, setProductosCargados] = useState(false);

  async function getUserData(uid) {
    const docuRef = doc(firestore, `usuarios/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    const userData = docuCifrada.data();
    return userData;
  }

  const getCategoriasNOTOAST = async () => {
    try {
      const response = await fetch("http://18.208.174.132:8080/api/category");
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.log("Error fetching tags:", error);
    }
  };

  const getCategorias = async () => {
    const idToast = toast.loading("Actualizando el listado de categorias", {
      style: {
        "font-size": "1.5rem",
      },
    });
    try {
      const response = await fetch("http://18.208.174.132:8080/api/category");
      const data = await response.json();
      setCategorias(data);
      toast.success("Listado de categorias actualizado", { id: idToast });
    } catch (error) {
      console.log("Error fetching tags:", error);
    }
  };

  const getProductos = async () => {
    const idToast2 = toast.loading("Actualizando la lista de productos", {
      style: {
        "font-size": "1.5rem",
      },
    });
    try {
      const response = await fetch(
        "http://18.208.174.132:8080/api/products/listar"
      );
      const data = await response.json();
      setProductos(data);
      setProductosCargados(true); // Marcar los productos como cargados
      toast.success("Lista de productos actualizada", { id: idToast2 });
    } catch (error) {
      console.log("Error fetching products:", error);
      if (error.name === "TypeError") {
        toast.error(
          `Ha sucedido un error conectando con la base de datos. Por favor, intentalo nuevamente`,
          {
            id: idToast2,
          }
        );
      }
    }
  };

  const getCaracteristicas = async () => {
    const idToast = toast.loading(
      "Actualizando el listado de caracteristicas",
      {
        style: {
          "font-size": "1.5rem",
        },
      }
    );
    try {
      const response = await fetch(
        "http://18.208.174.132:8080/api/caracteristicas"
      );
      const data = await response.json();
      setCaracteristicas(data);
      toast.success("Listado de caracteristicas actualizado", { id: idToast });
    } catch (error) {
      console.log("Error fetching tags:", error);
    }
  };

  const getCaracteristicasNOTOAST = async () => {
    try {
      const response = await fetch(
        "http://18.208.174.132:8080/api/caracteristicas"
      );
      const data = await response.json();
      setCaracteristicas(data);
    } catch (error) {
      console.log("Error fetching tags:", error);
    }
  };

  //hacer con use memo para que no se ejecute cada vez que se renderiza

  useEffect(() => {
    getProductos()
      .then(() => {
        setProductosCargados(true); // Marcar los productos como cargados
      })
      .catch((error) => {
        console.log("Error fetching products:", error);
      });
    getCaracteristicasNOTOAST()
      .then(() => {
        console.log(caracteristicas);
      })
      .catch((error) => {
        console.log("Error fetching tags:", error);
      });
    getCategoriasNOTOAST()
      .then(() => {
        console.log("categorias: ", categorias);
      })
      .catch((error) => {
        console.log("Error fetching tags:", error);
      });
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      getUserData(user.uid)
        .then((userData) => {
          setUserData({
            ...userData,
            uid: user.uid,
          });
          console.log("userData final", userData);
        })
        .catch((error) => {
          console.log("Error fetching user data:", error);
        });
    }
  }, [user]);
  // Reorganizar los productos de manera aleatoria

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const productosAleatorios = useMemo(() => {
    if (productosCargados) {
      return shuffleArray(productos);
    }
    return [];
  }, [productosCargados, productos]);

  function agregarProducto(producto) {
    setProductos([...productos, producto]);
  }

  function eliminarProducto(id) {
    const aux = productos.filter((producto) => producto.id !== id);
    setProductos(aux);
  }

  function cambiarLoggeo() {
    setLogged(!logged);
  }

  function agregarCaracteristica(caracteristica) {
    setCaracteristicas([...caracteristicas, caracteristica]);
  }

  function eliminarCaracteristica(id) {
    const aux = caracteristicas.filter(
      (caracteristica) => caracteristica.id !== id
    );
    setCaracteristicas(aux);
  }

  const valoresGlobales = {
    logged,
    productos,
    productosAleatorios,
    caracteristicas,
    user,
    userData,
    categorias,
    favorites,
    cantFavorites,
    showModal,
    setUserData,
    agregarCaracteristica,
    eliminarCaracteristica,
    cambiarLoggeo,
    agregarProducto,
    eliminarProducto,
    getCaracteristicas,
    getProductos,
    getCategoriasNOTOAST,
    getCategorias,
    addFavorite,
    removeFavorite,
    setShowModal,
  };

  return (
    <ElementosGlobales.Provider value={valoresGlobales}>
      {children}
    </ElementosGlobales.Provider>
  );
}
