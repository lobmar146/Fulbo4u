import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import pelota from '../../assets/pelota.png'

export const Product = props => {
  const { id, name, shortDescription, image } = props
  return (
    <ProductWrapper to={`/product/${id}`}>
      <img src={image} alt='' />
      <div className='content'>
        <h2>{name}</h2>
        <p>{shortDescription}</p>
      </div>
    </ProductWrapper>
  )
}

const ProductWrapper = styled(Link)`
  background-color: #e5e5e5;
  width: 100%;
  height: auto;
  border-radius: 3%;
  display: flex;
  align-items: center;
  transition: 0.6s;
  text-decoration: none;
  color: #000000;

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 50%;
    padding: 1rem;
  }

  .content {
    width: 60%;
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
  }
`
