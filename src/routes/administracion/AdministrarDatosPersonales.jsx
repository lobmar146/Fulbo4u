import React, { useContext, useEffect, useState } from "react";
import { getFirestore, collection, doc, updateDoc } from "firebase/firestore";
import { app, db } from "../../firebase";
import { ElementosGlobales } from "../../context/ElementosGlobales";
import { SectionAdministracion } from "./Administracion";
import styled from "styled-components";
import toast, { Toaster } from "react-hot-toast";

export default function AdministrarDatosPersonales() {
  const firestore = getFirestore(app);
  const { userData, setUserData } = useContext(ElementosGlobales);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userData) {
      setNombre(userData.nombre);
      setTelefono(userData.telefono);
      setEmail(userData.correo);
    }
  }, [userData]);

  const handleModificar = async (e) => {
    const idToast = toast.loading("Por favor espere...", {
      style: {
        "font-size": "1.5rem",
      },
    });
    e.preventDefault();
    try {
      if (userData) {
        const docId = userData.uid; // Assuming "uid" is the document ID
        const docRef = doc(db, "usuarios", docId);

        await updateDoc(docRef, {
          nombre: nombre,
          telefono: telefono,
          correo: email,
        });
        setUserData({
          ...userData,
          nombre: nombre,
          telefono: telefono,
          correo: email,
        });

        console.log("Documento modificado con éxito");
        toast.success("Usuario modificado con exito.", { id: idToast });
      }
    } catch (error) {
      console.error("Error al modificar el documento:", error);
      toast.error("¡Algo fue mal!", { id: idToast });
    }
  };

  return (
    <SectionAdministracion>
      <div className="desktop">
        <h2>Administrar datos personales</h2>
        <Form onSubmit={handleModificar}>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            name="telefono"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Modificar</button>
        </Form>
      </div>
      <div className="mobile content">
        <h1>
          Por favor, ingresa en un dispotivo de escritorio para administrar el
          sitio
        </h1>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </SectionAdministracion>
  );
}

const Form = styled.form`
  height: calc(100vh - 248px);
  font-size: 1.5rem;
  margin: 0rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  //estilos para los errores

  p.requisitos-input {
    span {
      color: ${(props) => props.theme.global.greyF4u};
      font-size: 1rem;
      font-weight: bolder;
    }
    color: ${(props) => props.theme.global.redF4u};
    font-size: 1rem;
    font-weight: bolder;
  }

  input {
    font-size: 1.5rem;
    border-radius: 0.1rem;
  }
  /* botones del form */
  button,
  select {
    font-size: 2rem;
    border: white solid 1px;

    font-size: 1rem;
    padding: 8px;
    color: white;
    background-color: ${(props) => props.theme.global.greyF4u};
    border-radius: 2rem;
    transition: all 0.6s;
  }

  button {
    cursor: pointer;
    padding: 15px 30px;
  }

  button:hover {
    background-color: #000000;
  }

  /* contenedor que tiene el select y el boton */

  .contenedor-agregar-caracteristica {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  /* contenedor del mensaje de caracteristicas */
  .message-caracteristicas {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
const ImagePreview = styled.div`
  display: flex;
  gap: 3rem;
  margin-top: 10px;
`;

const Image = styled.img`
  max-width: 100px;
  max-height: 100px;
  border: 1px solid black;
`;
// estilos caracteristicas
const SelectedCaracteristicasContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;

const SelectedCaracteristica = styled.div`
  display: flex;
  align-items: center;
  color: white;
  background-color: ${(props) => props.theme.global.greyF4u};
  transition: color 0.6s;
  border-radius: 2rem;
`;

const RemoveButton = styled.button`
  background-color: ${(props) => props.theme.global.redF4u} !important;
  color: white;
  border: none !important;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 0.5rem;
  padding: 0.25rem;
  font-size: 1rem;
`;
export const ContenedorRecuadro = styled.div`
  background-color: ${(props) => props.theme.global.lightGreyF4u} !important;
  border-radius: 2rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;

  gap: 1rem;
`;
