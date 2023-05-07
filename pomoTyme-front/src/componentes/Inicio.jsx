import { Col, Container, Row } from "react-bootstrap";
import PantallaAjuste from "./PantallaAjuste";
import Temporizador from "./Temporizador";
import { useState, useEffect } from "react";
import AjustesContext from "./AjustesContext";
import Formulario from "./to-do-list/Formulario";
import Pomochat from "./pomogpt/Pomochat";



const Inicio = () => {
  const [muestraAjustes, setmuestraAjustes] = useState(false);
  const [tiempoEstudio, setTiempoEstudio] = useState(45);
  const [tiempoDescanso, settiempoDescanso] = useState(15);

  return (
    <>
      <Container className="contenedorPrincipal" fluid>
        <Row className="contenedores">
          <Col md={6}>
            <Row className="justify-content-center align-items-center">
              <Col xs={12} md className="coltemporizador">
                <AjustesContext.Provider
                  value={{
                    muestraAjustes,
                    setmuestraAjustes,
                    tiempoEstudio,
                    tiempoDescanso,
                    setTiempoEstudio,
                    settiempoDescanso,
                  }}
                >
                  {muestraAjustes ? <PantallaAjuste /> : <Temporizador />}
                </AjustesContext.Provider>
              </Col>
            </Row>
          </Col>
          <Col md={6}>
            <Row>
              <Col xs={12} md className="contformulario mb-3 mb-md-0">
                <Formulario />
              </Col>
            </Row>
          </Col>
        </Row>

        <Container fluid className="contenedores3">
          <Row>
            <Col xs={12} md className="coltemporizador">
              <Pomochat />
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default Inicio;