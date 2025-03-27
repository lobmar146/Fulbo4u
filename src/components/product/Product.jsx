import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { ElementosGlobales } from '../../context/ElementosGlobales'
import { db } from '../../firebase'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import TextToSpeechButton from '../accesibilidad/TextToSpeechButton'

export const Product = props => {
  const { id, name, shortDescription, image, isFavorito } = props
  const [isFavorite, setIsFavorite] = useState(isFavorito)

  useEffect(() => {
    setIsFavorite(isFavorito)
  }, [isFavorito])

  const navigate = useNavigate()
  const { addFavorite, removeFavorite, user, setShowModal } =
    useContext(ElementosGlobales)

  const handleNavigation = () => {
    navigate(`/product/${id}`)
  }

  const handleToggleFavorite = async e => {
    e.stopPropagation()

    if (user) {
      const userDocRef = doc(db, 'usuarios', user.uid)

      try {
        if (isFavorite) {
          removeFavorite(id)
          await updateDoc(userDocRef, {
            productosFavoritos: arrayRemove(id)
          })
        } else {
          addFavorite(id)
          await updateDoc(userDocRef, {
            productosFavoritos: arrayUnion(id)
          })
        }
        setIsFavorite(!isFavorite)
      } catch (error) {
        console.error('Error al actualizar el documento:', error)
      }
    } else {
      setShowModal(true)
    }
  }

  return (
    <ProductWrapper onClick={handleNavigation}>
      <img src={image} alt='' />
      <div className='content'>
        <h2>{name}</h2>
        <p>{shortDescription}</p>
      </div>
      <FavoriteWrapper onClick={handleToggleFavorite}>
        {isFavorite ? (
          <AiFillHeart size='2rem' className='icon' />
        ) : (
          <AiOutlineHeart size='2rem' className='icon' />
        )}
      </FavoriteWrapper>
      <TextToSpeechButton textToSpeak={name + shortDescription} />
    </ProductWrapper>
  )
}

const ProductWrapper = styled.div`
  background-color: #e5e5e5;
  width: 100%;
  height: auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  transition: 0.6s;
  text-decoration: none;
  color: #000000;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 50%;
    padding: 1rem;

    @media (max-width: 768px) {
      width: 30%;
    }
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

const FavoriteWrapper = styled.div`
  position: absolute;
  top: 21px;
  right: 53px;

  @media (min-width: 768px) {
    top: 42px;
    right: 71px;
  }

  .icon {
    color: ${props => props.theme.global.redF4u};
  }
`
