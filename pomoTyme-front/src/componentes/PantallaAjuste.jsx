import React from "react"
import ReactSlider from "react-slider"
import { useContext } from "react"
import AjustesContext from "./AjustesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const PantallaAjuste = () => {
    const AjustesInformacion = useContext(AjustesContext);
    return (
        <>
            <div className="ajustesPantalla">
                <label>Work: {AjustesInformacion.tiempoEstudio}:00 </label>
                <ReactSlider className="slider"
                    thumbClassName={'thumb'}
                    trackClassName={'track'}
                    value={AjustesInformacion.tiempoEstudio}
                    onChange={newValue => AjustesInformacion.setTiempoEstudio(newValue)}
                    min={1}
                    max={120} />
                <label>Break: {AjustesInformacion.tiempoDescanso}:00 </label>
                <ReactSlider className="sliderVerde"
                    thumbClassName={'thumbVerde'}
                    trackClassName={'trackVerde'}
                    value={AjustesInformacion.tiempoDescanso}
                    onChange={newValue => AjustesInformacion.settiempoDescanso(newValue)}
                    min={1}
                    max={120} />
                    <button onClick={() => { AjustesInformacion.setmuestraAjustes(false) }} className='cerrarBoton'><FontAwesomeIcon style={{ marginRight: "10px" }} size="1x" icon={faCircleXmark} /></button>
            </div>
            
        </>
    )
}

export default PantallaAjuste