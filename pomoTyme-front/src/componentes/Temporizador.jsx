import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faGear } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState, useEffect, useRef } from "react";
import AjustesContext from "./AjustesContext";
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';


const Temporizador = () => {
    const AjustesInformacion = useContext(AjustesContext);
    const [pausado, setpausado] = useState(true);
    const [tiempoRestante, settiempoRestante] = useState(0);
    const [modo, setmodo] = useState('estudio');
    const tiempoRestanteRef = useRef(tiempoRestante);
    const pausadoRef = useRef(pausado);
    const modoRef = useRef(modo);
    const [ciclosCompletados, setCiclosCompletados] = useState(0);
    const [temporizadorIntervalId, setTemporizadorIntervalId] = useState(null);
    const [cicloEnProgreso, setCicloEnProgreso] = useState(false);




    async function guardarSesionPomodoro(tiempoEstudio, tiempoDescanso) {
        const url = 'http://localhost:3000/api/pomodoros';
        const token = localStorage.getItem('token');
        const timeZone = 'Europe/Berlin'; // La zona horaria de Europa Central
    
        const fechaInicioLocal = new Date();
        const fechaInicioCET = utcToZonedTime(fechaInicioLocal, timeZone);
        const fechaInicio = fechaInicioCET.toISOString();
    
        // Calcula la fecha de finalización sumando la duración de la sesión al tiempo actual en CET
        const duracionSesion = tiempoEstudio + tiempoDescanso;
        const fechaFinLocal = new Date(Date.now() + duracionSesion * 60 * 1000);
        const fechaFinCET = utcToZonedTime(fechaFinLocal, timeZone);
        const fechaFin = fechaFinCET.toISOString();
    
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                tiempo_estudio: tiempoEstudio,
                tiempo_descanso: tiempoDescanso,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            })
        };
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }
    

    const reiniciarTemporizador = () => {
        setpausado(true);
        pausadoRef.current = true;
        setCiclosCompletados(0);
        setmodo("estudio");
        modoRef.current = "estudio";
        tiempoRestanteRef.current = AjustesInformacion.tiempoEstudio * 60;
        settiempoRestante(tiempoRestanteRef.current);
    };



    async function handleFinalizarSesion() {
        clearInterval(temporizadorIntervalId) // Limpia el temporizador antes de guardar la sesión
        await guardarSesionPomodoro(AjustesInformacion.tiempoEstudio, AjustesInformacion.tiempoDescanso);
        reiniciarTemporizador();
    }



    const AlertaReloj = () => {
        const audio = new Audio('src/assets/Alerta.mp3');
        audio.volume = 0.4;
        audio.play();
    };

    const tick = () => {
        console.log('Tick:', tiempoRestanteRef.current);
        tiempoRestanteRef.current--;
        settiempoRestante(tiempoRestanteRef.current);
    };

    const iniciarCiclo = () => {
        setCicloEnProgreso(true);
        setpausado(false);
        pausadoRef.current = false;
    };

    const pausarCiclo = () => {
        setpausado(true);
        pausadoRef.current = true;
    };

    useEffect(() => {
        const cambiarModo = () => {
            const modoActual = modoRef.current === 'estudio' ? 'descanso' : 'estudio';
            const tiempoActual = (modoActual === 'estudio' ? AjustesInformacion.tiempoEstudio : AjustesInformacion.tiempoDescanso) * 60;

            if (modoActual === 'estudio') {
                setCiclosCompletados(ciclosCompletados + 1);
            }

            setmodo(modoActual);
            modoRef.current = modoActual;
            settiempoRestante(tiempoActual);
            tiempoRestanteRef.current = tiempoActual;
            AlertaReloj();
        };

        tiempoRestanteRef.current = AjustesInformacion.tiempoEstudio * 60;
        settiempoRestante(tiempoRestanteRef.current);


        const temporizador = setInterval(() => {
            if (pausadoRef.current) {
                return;
            }
            if (tiempoRestanteRef.current === 0) {
                return cambiarModo()
            }

            tick()
        }, 1000)

        console.log('Temporizador creado:', temporizador);

        setTemporizadorIntervalId(temporizador)

        // Limpia el temporizador antes de guardar la sesión
        return () => {
            console.log('Temporizador limpiado:', temporizador);
            clearInterval(temporizador)
            setCicloEnProgreso(false)
        };
    }, [ciclosCompletados]);




    useEffect(() => {
        if (ciclosCompletados > 0) {
            handleFinalizarSesion();
        }
    }, [ciclosCompletados]);

    const totalPomodoro = modo === 'estudio' ? AjustesInformacion.tiempoEstudio * 60 : AjustesInformacion.tiempoDescanso * 60;
    const valorPomodoro = Math.round(tiempoRestante / totalPomodoro * 100);

    const minutosPomodoro = Math.floor(tiempoRestante / 60);
    let segundosPomodoro = tiempoRestante % 60;
    if (segundosPomodoro < 10) {
        segundosPomodoro = '0' + segundosPomodoro;
    }

    return (
        <>
            <CircularProgressbar className='circulo' value={valorPomodoro} text={`${minutosPomodoro}:${segundosPomodoro}`} styles={buildStyles({ textColor: 'white', pathColor: modo === 'estudio' ? 'rgba(113, 6, 6, 0.696)' : 'rgba(117, 244, 82, 0.696)', trailColor: 'rgba(250,250,250, .2)' })} />
            <section className='player'>
                {!cicloEnProgreso && pausado ?
                    <button onClick={iniciarCiclo} className='iconoPlayer'><FontAwesomeIcon className='iconoPlayer' size='6x' icon={faPlay} /></button>
                    : pausado ?
                        <button onClick={iniciarCiclo} className='iconoPlayer'><FontAwesomeIcon className='iconoPlayer' size='6x' icon={faPlay} /></button>
                        : <button onClick={pausarCiclo} className='iconoPlayer'><FontAwesomeIcon size='6x' icon={faStop} /></button>
                }
                <section className='ajustes'>
                    <button onClick={() => { AjustesInformacion.setmuestraAjustes(true) }} className='iconoAjustes'><FontAwesomeIcon size='5x' icon={faGear} /></button>
                </section>
            </section>
        </>
    );
}

export default Temporizador;