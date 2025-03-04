import { useMetronome } from "react-metronome-hook";
import click1 from "../assets/sounds/metronome.wav";
import click2 from "../assets/sounds/metronomeup.wav";
import { PiMetronome } from "react-icons/pi";
import { IconContext } from "react-icons";

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

  return (
    <div id="metronome">
      <button onClick={isTicking ? stopMetronome : startMetronome}>
        <IconContext.Provider value={{ size: "2em", color: "white" }}>
          <PiMetronome /> 
        </IconContext.Provider>
      </button>
    </div>
  );
};

export default Metronome;