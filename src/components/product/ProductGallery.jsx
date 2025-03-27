import React, { useState } from 'react'
import styled from 'styled-components'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const ProductGalleryContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`

const MainImage = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MainImageElement = styled.img`
  width: 50%;
  height: auto;
  display: block;
  cursor: pointer;
  &:hover {
    transform: scale(1.5);
    transition: 0.6s;
  }
`

const SecondaryImages = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    margin-left: 15%;
  }
`

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  align-items: center;
`

const SecondaryImageElement = styled.img`
  width: 70%;
  height: auto;
  display: block;
  cursor: pointer;
  &:hover {
    transform: scale(1.5);
    transition: 0.6s;
  }
`

const ViewMore = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  button {
    display: flex;
    align-items: center;

    font-size: 1rem;
    padding: 8px;
    color: white;
    background-color: ${props => props.theme.global.greyF4u};
    transition: color 0.6s;
    border-radius: 2rem;
  }

  button:hover {
    background-color: black;
    transition: 0.6s;
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`

const StyledCarousel = styled(Carousel)`
  width: 100%;

  /* contador del carrousel */
  .carousel .carousel-status {
    position: absolute;
    top: 0;
    right: 30px;
    font-size: 20px;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.9);
    color: #fff;
  }
  .carousel .slider-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .carousel .slide {
    background-color: transparent;
    box-shadow: black;
    display: flex;
    align-items: center;
  }

  .carousel .control-prev,
  .carousel .control-next {
    font-size: 24px;
    color: #ffffff;
    background-color: ${props => props.theme.global.greyF4u};
  }

  .carousel .control-prev:hover,
  .carousel .control-next:hover {
    color: black;
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => (props.show ? 'block' : 'none')};
  z-index: 1000;
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); */
  z-index: 1001;
  width: 40%;
  @media (max-width: 768px) {
    width: 80%;
  }

  button {
    margin-top: 1rem;
    border: white solid 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    padding: 8px;
    color: white;
    background-color: ${props => props.theme.global.greyF4u};
    transition: color 0.6s;
    border-radius: 2rem;
  }

  button:hover {
    background-color: black;
    transition: 0.6s;
  }
`

const ProductGallery = ({ images }) => {
  const [showCarousel, setShowCarousel] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0) // Indice de la foto

  const toggleCarousel = index => {
    setSelectedImageIndex(index) //seteamos que indice vamos a mostrar
    setShowCarousel(!showCarousel)
  }

  return (
    <>
      <section className='section-galeria'>
        <ProductGalleryContainer>
          <MainImage>
            <MainImageElement
              onClick={() => toggleCarousel(0)} // abrir carrousel con primera imagen
              src={images[0].url}
              alt='Imagen principal del producto'
            />
          </MainImage>
          <SecondaryImages>
            <ImageGrid>
              {images.slice(1).map((image, index) => (
                <SecondaryImageElement
                  key={index}
                  src={image.url}
                  alt={`Imagen secundaria ${index + 1}`}
                  onClick={() => toggleCarousel(index + 1)} // Abrir carrousel con la imagen que queremos
                />
              ))}
            </ImageGrid>

            <ModalOverlay show={showCarousel}>
              <ModalContent>
                <StyledCarousel
                  showThumbs={false}
                  selectedItem={selectedImageIndex}
                >
                  {images.map((image, index) => (
                    <div key={index}>
                      <img src={image.url} alt={`Imagen ${index}`} />
                    </div>
                  ))}
                </StyledCarousel>
                <button onClick={() => setShowCarousel(false)}>Cerrar</button>
              </ModalContent>
            </ModalOverlay>
          </SecondaryImages>
        </ProductGalleryContainer>
        <ViewMore>
          {' '}
          <button onClick={() => toggleCarousel(0)}>Ver más</button>
        </ViewMore>
      </section>
    </>
  )
}

export default ProductGallery
