import React from "react";
import { useState, useEffect } from "react";
import {
    Col,
    Form,
    Button,
    ListGroup,
    ListGroupItem,
    Modal
} from "react-bootstrap";
import { faCheck, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Formulario = () => {
    const [item, setitem] = useState("");
    const [lista, setlista] = useState([]);
    const [categoria, setcategoria] = useState("normal");
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
    const [error, seterror] = useState("initialState")

    const opcionesCategorias = [
        { value: "Urgente", label: "Urgente" },
        { value: "Importante", label: "Importante" },
        { value: "Normal", label: "Normal" },
    ];

    const editaItem = (tarea) => {
        setTareaSeleccionada({ ...tarea, categoria: tarea.categoria || "" });
    };

    const marcaComoRealizada = (index) => {
        const nuevaLista = [...lista];
        nuevaLista[index] = { ...nuevaLista[index], realizada: true };
        setlista(nuevaLista);
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    };

    const getToken = () => {
        return localStorage.getItem('token');
    };

    const borraItem = async (x) => {
        const tareaId = lista[x].id;

        try {
            const response = await fetch(`http://localhost:3000/api/tareas/${tareaId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': getToken(),
                },
            });

            if (response.ok) {
                const nuevaLista = [...lista];
                nuevaLista.splice(x, 1);
                setlista(nuevaLista);
            } else {
                // Manejar errores de la solicitud
            }
        } catch (error) {
            // Manejar errores de red
        }
    };


    const listaItem = lista.map((x, index) => (
        <ListGroupItem
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            key={index}
            className="contenedorTareas"
        >
            <div style={{display:'flex', flexDirection:'row'}} className={`textoTarea${x.realizada ? " realizada" : ""}`}>
                <Col className="col-10">{x.descripcion}</Col>
                
            </div>
            <Col style={{color:'lightcoral'}}>{x.categoria}</Col>
            <div className="contenedorIconos">
                {x.realizada ? null : (
                    <Button
                        variant="link"
                        onClick={() => marcaComoRealizada(index)}
                    >
                    <FontAwesomeIcon icon={faCheck} style={{color: "#689df8",}} />
                    </Button>
                )}
                <Button
                    variant="link"
                    onClick={() => borraItem(index)}
                    className="borrar"
                >
                    <FontAwesomeIcon
                        style={{ color: "rgb(213, 64, 64)", cursor: "pointer" }}
                        icon={faTrash}
                    />
                </Button>
                <Button
                    variant="link"
                    onClick={() => editaItem(x)}
                    className="editar"
                >
                    <FontAwesomeIcon
                        style={{ color: "rgb(64, 153, 213)", cursor: "pointer" }}
                        icon={faPenToSquare}
                    />
                </Button>
            </div>
        </ListGroupItem>
    ));



    const getTareas = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/tareas', {
                headers: {
                    'x-auth-token': getToken(),
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Datos recibidos:", data.data);
                setlista(data.data);
            } else {
                // Manejar errores de la solicitud
            }
        } catch (error) {
            // Manejar errores de red
        }
    }



    const nuevoItem = async () => {
        if (item.trim() === "") {
            seterror("Tarea sin definir");
        } else if (!isAuthenticated()) {
            alert("No puedes añadir tareas sin registrarte!");
        } else {
            try {
                const response = await fetch("http://localhost:3000/api/tareas/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": getToken()
                    },
                    body: JSON.stringify({ descripcion: item, categoria })
                });

                const data = await response.json();

                if (response.ok) {
                    setlista([...lista, data.data]);
                } else {
                    // Manejar errores de la solicitud
                }
            } catch (error) {
                // Manejar errores de red
            }

            setitem("");
            seterror("");
        }
    };




    const editaTarea = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/tareas/${tareaSeleccionada.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': getToken(),
                },
                body: JSON.stringify({
                    descripcion: tareaSeleccionada.descripcion,
                    categoria: tareaSeleccionada.categoria
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const nuevaLista = lista.map((tarea) => tarea.id === tareaSeleccionada.id ? data.data : tarea);
                setlista(nuevaLista);
                setTareaSeleccionada(null);
            } else {
                // Manejar errores de la solicitud
            }
        } catch (error) {
            // Manejar errores de red
        }
    };

    useEffect(() => {
        getTareas();
    }, []);


    return (
        <>
            <div className="todo-contenedor">
                <Col style={{border:'none'}}>
                    <Form.Group className="mb-3 inputContenedor" controlId="formBasicEmail">
                        <Form.Control
                            className="inputContenedor"
                            type="text"
                            value={item}
                            onChange={(e) => setitem(e.target.value)}
                            placeholder="¿Que tareas realizaremos hoy?"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    nuevoItem();
                                    e.preventDefault();
                                }
                            }}
                        />
                        <Form.Select
                            className="inputCategoria"
                            value={categoria}
                            onChange={(e) => setcategoria(e.target.value)}
                        >
                            {opcionesCategorias.map((opcion) => (
                                <option  key={opcion.value} value={opcion.value}>
                                    {opcion.label}
                                </option>
                            ))}
                        </Form.Select>
                        <button
                            className="input-btn"
                            variant="success"
                            onClick={nuevoItem}
                        
                        >Añadir</button>
                    </Form.Group>

                </Col>
                <Col>
                    <ListGroup>
                        {listaItem}
                    </ListGroup>
                </Col>
                <Modal show={tareaSeleccionada !== null} onHide={() => setTareaSeleccionada(null)} >
                    <Modal.Header className="contenedorModal" closeButton>
                        <Modal.Title>Editar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="contenedorModal" >
                        <Form.Control
                            type="text"
                            value={tareaSeleccionada?.descripcion}
                            onChange={(e) => setTareaSeleccionada({ ...tareaSeleccionada, descripcion: e.target.value })}
                            className="inputModal"
                        />
                        <Form.Select
                            value={tareaSeleccionada?.categoria}
                            onChange={(e) => setTareaSeleccionada({ ...tareaSeleccionada, categoria: e.target.value })}
                        >
                            {opcionesCategorias.map((opcion) => (
                                <option key={opcion.value} value={opcion.value}>
                                    {opcion.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Modal.Body>
                    <Modal.Footer className="contenedorModal">
                        <Button className="editbutton" variant="link" onClick={() => setTareaSeleccionada(null)}>
                            Cancelar
                        </Button>
                        <Button className="editbutton" variant="link" onClick={() => editaTarea()}>
                            Guardar cambios
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </>
    );
};

export default Formulario;