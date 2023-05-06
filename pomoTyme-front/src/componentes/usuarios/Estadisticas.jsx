import { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import { utcToZonedTime } from 'date-fns-tz';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faGraduationCap} from "@fortawesome/free-solid-svg-icons";


const Estadisticas = () => {
  const [sesiones, setSesiones] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const timeZone = 'Europe/Berlin'; // La zona horaria de Europa Central


  const findTodayIndex = (days) => {
    const today = new Date();
    const todayString = new Date(today.toISOString());
    return days.findIndex(day => new Date(day).toDateString() === todayString.toDateString())
  };


  const nextDay = () => {
    const dias = Object.keys(estadisticas || {});
    setActiveIndex((activeIndex - 1 + dias.length) % dias.length);
  };

  const prevDay = () => {
    const dias = Object.keys(estadisticas || {});
    setActiveIndex((activeIndex + 1) % dias.length);
  };

  const obtenerSesiones = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch("http://localhost:3000/api/pomodoros", {
        headers: {
          'x-auth-token': token
        }
      });
      const data = await response.json();
      if (response.ok) {
        setSesiones(data.data);
      } else {
        // manejar errores de solicitud
      }
    } catch (error) {
      // manejar errores de red
    }
  };


  const calcularEstadisticas = () => {
    if (!sesiones) return;

    const obtenerDiaSemana = (fecha) => {
      const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const nombreDiaSemana = diasSemana[fecha.getDay()];

      return {
        fecha: fecha.toISOString().slice(0, 10),
        nombreDiaSemana: nombreDiaSemana,
      };
    };

    // Agrupar sesiones por día
    const sesionesPorDia = {};
    sesiones.forEach((sesion) => {
      const fecha = new Date(sesion.fecha_inicio);
      const dia = obtenerDiaSemana(fecha);
      if (!sesionesPorDia[dia.fecha]) {
        sesionesPorDia[dia.fecha] = [];
      }
      sesionesPorDia[dia.fecha].push(sesion);
    });

    // Calcular estadísticas por día
    const estadisticasPorDia = {};
    Object.keys(sesionesPorDia).forEach((dia) => {
      const sesionesDelDia = sesionesPorDia[dia];

      // Ejemplo de cálculo de tiempo total de estudio para el día
      const tiempoEstudioTotal = sesionesDelDia.reduce(
        (total, sesion) => total + sesion.tiempo_estudio,
        0
      );
      const tiempoEstudioHoras = Math.floor(tiempoEstudioTotal / 60);
      const tiempoEstudioMinutos = tiempoEstudioTotal % 60;

      // Ejemplo de cálculo de tiempo total de descanso para el día
      const tiempoDescansoTotal = sesionesDelDia.reduce(
        (total, sesion) => total + sesion.tiempo_descanso,
        0
      );
      const tiempoDescansoHoras = Math.floor(tiempoDescansoTotal / 60);
      const tiempoDescansoMinutos = tiempoDescansoTotal % 60;

      const hoy = new Date().toISOString().slice(0, 10);
      if (!estadisticasPorDia[hoy]) {
        estadisticasPorDia[hoy] = {
          nombreCorto: hoy,
          nombreDiaSemana: obtenerDiaSemana(new Date(hoy)).nombreDiaSemana,
          tiempoEstudioTotal: 0,
          tiempoEstudioHoras: 0,
          tiempoEstudioMinutos: 0,
          tiempoDescansoTotal: 0,
          tiempoDescansoHoras: 0,
          tiempoDescansoMinutos: 0,
        };
      }

      estadisticasPorDia[dia] = {
        nombreCorto: new Date(dia).toISOString(),
        nombreDiaSemana: obtenerDiaSemana(new Date(dia)).nombreDiaSemana,
        tiempoEstudioTotal,
        tiempoEstudioHoras,
        tiempoEstudioMinutos,
        tiempoDescansoTotal,
        tiempoDescansoHoras,
        tiempoDescansoMinutos,
      };
    });
    setEstadisticas(estadisticasPorDia);
  };


  useEffect(() => {
    obtenerSesiones();
  }, []);

  useEffect(() => {
    calcularEstadisticas();
  }, [sesiones]);

  useEffect(() => {
    if (estadisticas) {
      const dias = Object.keys(estadisticas);
      const todayIndex = findTodayIndex(dias);
      setActiveIndex(todayIndex !== -1 ? todayIndex : 0);
    }
  }, [estadisticas]);

  return (
    <Container className="pantallaEstadisticas">
    
      <Row>
        {estadisticas ? (
          <section className="contenedorEstadisticas">
            <Row>
              <section className="contenedorBotones">
              <Button variant="link"  className="botonEstadisticas" onClick={nextDay}>
                  {"<"}
                </Button>
                <Button  variant="link" className="botonEstadisticas" onClick={prevDay}>
                  {">"}
                </Button>        
              </section>
            </Row>
            <Row>
              <section className="contenedorFechas">
                <h3>{estadisticas[Object.keys(estadisticas)[activeIndex]].nombreDiaSemana}</h3>
                <p>{utcToZonedTime(estadisticas[Object.keys(estadisticas)[activeIndex]].nombreCorto, timeZone).toISOString().slice(0, 10)}</p>
              </section>
            </Row>
            <Row>
              <section className="contenedorInformacion" >
                <div>
                  <h2>Tiempo total de estudio <FontAwesomeIcon icon={faGraduationCap} /></h2>
                  <h4 style={{textAlign:'center', color:'orange'}}>
                    {estadisticas[Object.keys(estadisticas)[activeIndex]].tiempoEstudioTotal > 60
                      ? `${estadisticas[Object.keys(estadisticas)[activeIndex]].tiempoEstudioHoras} horas y ${estadisticas[Object.keys(estadisticas)[activeIndex]].tiempoEstudioMinutos} minutos`
                      : `${estadisticas[Object.keys(estadisticas)[activeIndex]].tiempoEstudioTotal} minutos`}
                  </h4>
                </div>
                <div>
                <h2>Tiempo total de descanso <FontAwesomeIcon icon={faBed} /></h2>
                  <h4 style={{textAlign:'center', color:'green'}}>
                    {estadisticas[Object.keys(estadisticas)[activeIndex]].tiempoDescansoTotal > 60
                      ? `${estadisticas[Object.keys(estadisticas)[activeIndex]].tiempoDescansoHoras} horas y ${estadisticas[Object.keys(estadisticas)[activeIndex]].tiempoDescansoMinutos} minutos`
                      : `${estadisticas[Object.keys(estadisticas)[activeIndex]].tiempoDescansoTotal} minutos`}
                  </h4>
                </div>
              </section>
            </Row>
          </section>
        ) : (
          <p>Actualmente no podemos cargar tus estadisticas, vuelve mas tarde</p>
        )}
      </Row>
    </Container>
  )
}


export default Estadisticas;