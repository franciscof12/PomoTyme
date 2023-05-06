import { Col, Container, Row } from "react-bootstrap";
import PantallaAjuste from "./PantallaAjuste";
import Temporizador from "./Temporizador";
import { useState} from "react";
import AjustesContext from "./AjustesContext";
import Formulario from "./to-do-list/Formulario";
import Pomochat from "./pomogpt/Pomochat";




const Inicio = () => {
    const [muestraAjustes, setmuestraAjustes] = useState(false);
    const [tiempoEstudio, setTiempoEstudio] = useState(45);
    const [tiempoDescanso, settiempoDescanso] = useState(15);

    return (
        <main>
          <Container fluid className="contenedores">
            <Row className="justify-content-center align-items-center">
              <Col xs={12} md={5} className="mb-3 mb-md-0 text-center">
                <img
                  src="imgtemporizador.png"
                  className="img-responsive img-temporizador"
                  alt="temporizador"
                />
              </Col>
              <Col xs={12} md className="coltemporizador">
                        <AjustesContext.Provider value={{
                            muestraAjustes,
                            setmuestraAjustes,
                            tiempoEstudio,
                            tiempoDescanso,
                            setTiempoEstudio,
                            settiempoDescanso,
                        }}>
                            {muestraAjustes ? <PantallaAjuste /> : <Temporizador />}
                        </AjustesContext.Provider>
                    </Col>
            </Row>
          </Container>
    
          <Container fluid className="contenedores2">
            <Row>
              <Col xs={12} md className="contformulario mb-3 mb-md-0">
                <Formulario />
              </Col>
              <Col xs={12} md={5} className="text-center">
                <img
                  src="pomolist.png"
                  className="img-responsive"
                  alt="temporizador"
                />
              </Col>
            </Row>
          </Container>
    
          <Container fluid className="contenedores3">
            <Row>
              <Col xs={12} md={5} className="mb-3 mb-md-0 text-center">
                <img
                  src="pomogpt.png"
                  className="img-responsive"
                  alt="temporizador"
                />
              </Col>
              <Col xs={12} md className="coltemporizador">
                <Pomochat />
              </Col>
            </Row>
          </Container>
        </main>
      );
    };
    
    export default Inicio;