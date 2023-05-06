import "./registros.css";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap"
import { useState } from "react"
const Register = () => {
    const [email, setEmail] = useState("");
    const [nombre, setName] = useState("");
    const [password, setPassword] = useState("");


    const enviaEmail = (e) => {
        setEmail(e.target.value);
    }

    const enviaName = (e) => {
        setName(e.target.value);
    }

    const enviaPassword = (e) => {
        setPassword(e.target.value);
    }

    const enviaRegistro = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3000/api/usuarios/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, nombre, password }),
        });

        const data = await response.json();

        if (data.ok) {
            console.log("Registro exitoso")
            window.location.href = "/login";

        } else {
            console.log("Error en el registro:", data.error);
            // Manejar el error en el registro, por ejemplo, mostrar un mensaje de error al usuario
        }
    }



    return (
        <Container className="contenedorLOGIN">
            <Card className="cartaForm">
                <Form onSubmit={enviaRegistro} className="contenedorFormLogin" >
                    <Row>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label style={{ color: 'black' }}>Correo electronico</Form.Label>
                            <Form.Control required onChange={enviaEmail} type="email"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicNombre">
                            <Form.Label style={{ color: 'black' }}>Nombre</Form.Label>
                            <Form.Control required onChange={enviaName} type="text" />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3" controlId="formBasicContraseña">
                            <Form.Label style={{ color: 'black' }}>Contraseña</Form.Label>
                            <Form.Control required onChange={enviaPassword} type="password" />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Container style={{ display: 'grid', placeItems: 'center' }}>
                            <Button className="botonLogin" variant="primary" type="submit">
                                Registrate
                            </Button>
                        </Container>
                    </Row>
                </Form>
            </Card>
        </Container>
    )
}
export default Register