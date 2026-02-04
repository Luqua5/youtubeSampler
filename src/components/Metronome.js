import { useMetronome } from "react-metronome-hook";
import click1 from "../assets/sounds/metronome.wav";
import click2 from "../assets/sounds/metronomeup.wav";
import { PiMetronome } from "react-icons/pi";
import { IconContext } from "react-icons";
import { useEffect } from "react";

const Metronome = ({ tempo }) => {
  const {
    startMetronome,
    isTicking,
    stopMetronome,
    bpm,
    setBpm,
    setBeatsPerMeasure,
    setSounds
  } = useMetronome(tempo, 4, [click2, click1]);

  useEffect(() => {
    setBpm(tempo);
  }, [tempo, setBpm]);

  return (
    <div id="metronome">
      <button 
        onClick={isTicking ? stopMetronome : startMetronome}
        className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
          isTicking 
            ? 'bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/50 animate-pulse' 
            : 'bg-dark-700 hover:bg-dark-600 border border-primary/30'
        }`}
        title={isTicking ? "Stop metronome" : "Start metronome"}
      >
        <IconContext.Provider value={{ 
          size: "1.5em", 
          color: isTicking ? "white" : "#A78BFA",
          className: isTicking ? "animate-bounce-subtle" : ""
        }}>
          <PiMetronome /> 
        </IconContext.Provider>
      </button>
    </div>
  );
};

export default Metronome;