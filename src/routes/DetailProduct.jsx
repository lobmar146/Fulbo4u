import React, { useContext } from 'react'
import styled from 'styled-components'
import { useParams, Link } from 'react-router-dom'
import { BsFillArrowRightSquareFill } from 'react-icons/bs'
import { ElementosGlobales } from '../context/ElementosGlobales'
import ProductGallery from '../components/product/ProductGallery'

export default function DetailProduct() {
  const { productos } = useContext(ElementosGlobales)

  const params = useParams()
  const productoPorId = productos.find(producto => producto.id == params.id)

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
        <ProductGallery
          images={[
            productoPorId.image,
            productoPorId.image,
            productoPorId.image,
            productoPorId.image,
            productoPorId.image
          ]}
        />
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
`
