import SimLocalAnesthesia from "./SimLocalAnesthesia";
import "../css/style.css";

window.onload = () => {
    const sim = new SimLocalAnesthesia();
    sim.start();
};

