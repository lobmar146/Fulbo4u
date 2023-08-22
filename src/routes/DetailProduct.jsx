import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams, Link } from 'react-router-dom'
import { BsFillArrowRightSquareFill } from 'react-icons/bs'
import { ElementosGlobales } from '../context/ElementosGlobales'
import ProductGallery from '../components/product/ProductGallery'

export default function DetailProduct() {
  const { productos, caracteristicas } = useContext(ElementosGlobales)
  const [productoPorId, setProductoPorId] = useState(null)

  const params = useParams()

  //esto deberia fetchearse a futturo

  useEffect(() => {
    //esto deberia ser la funcion de fetch, aca ni bien se monta el componente se hacen los siguientes pasos

    //obtengo el producto por id
    const foundProduct = productos.find(
      producto => producto.id === Number(params.id)
    )

    //seteo el producto
    setProductoPorId(foundProduct)
  }, [params.id, productos])

  const caracteristicasPorId = idCaracteristica => {
    return caracteristicas.find(
      caracteristica => caracteristica.id === idCaracteristica
    )
  }

  if (!productoPorId) {
    return <p>Cargando...</p> // Muestra un mensaje de carga mientras se obtiene el producto
  }

  return (
    <>
      <DetailProductWrapper>
        <h1>{productoPorId.name}</h1>
        <p>{productoPorId.description}</p>
        <div className='contenedor-volver'>
          <Link to={'/'} className='link'>
            <BsFillArrowRightSquareFill />
          </Link>
        </div>
        <h2>Galeria de Imagenes del Producto</h2>
        <ProductGallery images={productoPorId.image} />
        <h2>Caracteristicas del Producto</h2>

        {/* recorro las caracteristicas del producto y las mapeo */}
        <ul className='caracteristics-ul'>
          {productoPorId.caracteristics.map(caracteristicaId => {
            const caracteristica = caracteristicasPorId(caracteristicaId)
            return (
              <li key={caracteristicaId} className='caracteristics-li'>
                {caracteristica.emoji + ' ' + caracteristica.texto}
              </li>
            )
          })}
        </ul>
      </DetailProductWrapper>
    </>
  )
}

const DetailProductWrapper = styled.section`
  padding: 2rem 1rem;
  margin-bottom: 2rem;
  line-height: 1.2rem;
  min-height: 100vh; /* Cambio aquí */

  .contenedor-volver {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
  }

  .link {
    font-size: 40px;
    color: ${props => props.theme.global.greyF4u};
    transition: color 0.6s;
  }

  .link:hover {
    color: #000000;
  }

  ul.caracteristics-ul {
    display: flex;
    justify-content: space-around;
    align-items: space-between;
    text-align: center;
    list-style: none;
    gap: 0.5rem;
    font-size: 1.2rem;
    background-color: ${props => props.theme.global.lightGreyF4u} !important;
    border-radius: 2rem;
    padding: 1rem;
    font-weight: bolder;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
  }
  li.caracteristics-li {
    display: flex;
    gap: 0.5rem;
    background-color: ${props => props.theme.global.greyF4u};
    padding: 1rem 0.5rem;
    border-radius: 2rem;
    color: white;
  }
`
