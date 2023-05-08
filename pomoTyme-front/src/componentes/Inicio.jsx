import { Col, Container, Row } from "react-bootstrap";
import PantallaAjuste from "./PantallaAjuste";
import Temporizador from "./Temporizador";
import { useState, useEffect } from "react";
import AjustesContext from "./AjustesContext";
import Formulario from "./to-do-list/Formulario";
import Pomochat from "./pomogpt/Pomochat";

const Inicio = (props) => {
  const [muestraAjustes, setmuestraAjustes] = useState(false);
  const [tiempoEstudio, setTiempoEstudio] = useState(45);
  const [tiempoDescanso, settiempoDescanso] = useState(15);
  const [tiempoRestante, settiempoRestante] = useState(0);

  const onTiempoRestanteChange = (tiempoRestante) => {
    settiempoRestante(tiempoRestante);
  };

  const minutosRestantes = Math.floor(tiempoRestante / 60);
  const segundosRestantes = tiempoRestante % 60;

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
                  {muestraAjustes ? (
                    <PantallaAjuste />
                  ) : (
                    <Temporizador onTiempoRestanteChange={onTiempoRestanteChange} />
                  )}
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
          <h3 style={{marginBottom: '15px'}}>
            PomoTimer: Animo! aun quedan {minutosRestantes} minutos restantes
          </h3>
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
