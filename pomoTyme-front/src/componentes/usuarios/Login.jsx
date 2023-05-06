import "./registros.css";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap"
import { useState } from "react"


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, seterror] = useState("");
    const [usuarioNoEncontrado, setusuarioNoEncontrado] = useState(false);

    const enviaEmail = (e) => {
        setEmail(e.target.value);
    }

    const enviaPassword = (e) => {
        setPassword(e.target.value);
    }

    const enviaFormulario = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3000/api/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });


        const data = await response.json();

        if (data.ok) {
            console.log("Login exitoso");
            setusuarioNoEncontrado("false")
            //Guardo el token del usuario en localstorage
            localStorage.setItem("token", data.token);
            //Redirecciono al usuario a la pagina principal
            window.location.href = "/";
        } else {
            seterror('Usuario no encontrado')
            setusuarioNoEncontrado(true)
        }
    };


    return (
        <Container fluid className="contenedorLOGIN">
            <Card className="cartaForm">
                <Form className="contenedorFormLogin" >
                    <Form.Group className=" datos" controlId="formBasicEmail">
                        <Form.Label style={{ color: 'black' }}>Correo electronico</Form.Label>
                        <Form.Control onChange={enviaEmail} type="email" />
                    </Form.Group>
                    <Form.Group className=" datos" controlId="formBasicContraseña">
                        <Form.Label style={{ color: 'black' }}>Contraseña</Form.Label>
                        <Form.Control onChange={enviaPassword} type="password" />
                    </Form.Group>
                    <Container style={{ display: 'grid', placeItems: 'center' }}>
                        <p style={{ display: usuarioNoEncontrado ? 'block' : 'none', gridArea: '1/1' }}>{error}, por favor <a href="/register">Registrate</a></p>
                        <Button onClick={enviaFormulario} className="botonLogin" variant="primary" type="submit">
                            Iniciar sesion
                        </Button>
                    </Container>
                </Form>
            </Card>
        </Container>
    )
}
export default Login