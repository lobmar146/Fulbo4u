import React, { useState, useEffect, useContext } from 'react'
import { ElementosGlobales } from '../context/ElementosGlobales'
import { Product } from '../components/product/Product'
import styled from 'styled-components'
import logo from '../assets/Futbol4u-logo.svg'

export const FavoritesProducts = () => {
  const { favorites, productos } = useContext(ElementosGlobales);
  const [localFavorites, setLocalFavorites] = useState(favorites);

  const favoritesProdcuts = productos.filter(product =>
    favorites.includes(product.id)
  )

  const toggleFavorite = productId => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId]

    setLocalFavorites(updatedFavorites);
  };

  useEffect(() => {
    setLocalFavorites(favorites)
  }, [favorites])

  return (
    <SectionFavoritos>
      <div className='title-container'>
        <div className='titulo-categoria'>
          <img src={logo} alt='logo futbol jugador' className='img-logo' />
          <h2>Tus productos favoritos: </h2>
        </div>
      </div>
      <FavProductsWrapper>
        {favoritesProdcuts.length > 0 ? (
          favoritesProdcuts.map(product => (
            <Product
              key={product.id}
              id={product.id}
              name={product.name}
              shortDescription={product.short_detail}
              image={product.images[0].url}
              isFavorito={localFavorites.includes(product.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <span>¡No tienes productos favoritos!</span>
        )}
      </FavProductsWrapper>
    </SectionFavoritos>
  )
}
const SectionFavoritos = styled.section`
  min-height: 100vh;

  .img-logo {
    width: 40px;
  }
  .title-container {
    background-color: ${props => props.theme.global.greyF4u};
    display: flex;
    gap: 20px;
    padding-left: 2rem;
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
`
const FavProductsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  padding: 1rem;

  span {
    font-size: 25px;
    text-align: center;
  }

  @media (min-width: 768px) {
    padding: 2rem;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;

    span {
      font-size: 35px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`
