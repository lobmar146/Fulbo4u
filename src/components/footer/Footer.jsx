import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { AiFillInstagram } from 'react-icons/ai'
import { BsTwitter, BsFacebook, BsYoutube } from 'react-icons/bs'
import { FaTiktok } from 'react-icons/fa'
import logo from '../../assets/Futbol4u-logo.svg'

export default function Footer() {
  const [year, setYear] = useState(0)

  const updateYear = () => {
    let date = new Date()
    let fullYear = date.getFullYear()
    setYear(fullYear)
  }

  useEffect(() => {
    updateYear()
  }, [])

  return (
    <>
      <StyleFooter>
        <ContendorLogosCopyright>
          <ContenedorRedesCopyrigth>
            <ContenedorLogos>
              <AiFillInstagram size='2rem' />
              <BsTwitter size='2rem' />
              <BsFacebook size='2rem' />
              <BsYoutube size='2rem' />
              <FaTiktok size='2rem' />
            </ContenedorLogos>
            <p>© Copyright All rights reserved {year}</p>
          </ContenedorRedesCopyrigth>
          <img className='logo' src={logo} alt='logo' />
        </ContendorLogosCopyright>
      </StyleFooter>
    </>
  )
}
const StyleFooter = styled.footer`
  align-items: center;
  background-color: ${props => props.theme.global.greyF4u};
  color: white;
  display: flex;
  height: 8.5rem;
  justify-content: start;
  z-index: 1000;
`
const ContendorLogosCopyright = styled.div`
  display: flex;
  margin-left: 2rem;
  gap: 3rem;
  align-items: center;
  .logo {
    width: 100%;
    height: 3.5rem;
  }
  @media (max-width: 768px) {
    gap: 1rem;
  }
`
const ContenedorLogos = styled.div`
  display: flex;
  gap: 1.5rem;
`
const ContenedorRedesCopyrigth = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

// realizar cambios en footer11
