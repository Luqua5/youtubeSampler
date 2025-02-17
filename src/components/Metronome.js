import { useMetronome } from "react-metronome-hook";
import click1 from "../assets/sounds/metronome.wav";
import click2 from "../assets/sounds/metronomeup.wav";

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
        {isTicking ? "Stop" : "Start"} Metronome
      </button>
    </div>
  );
};

export default Metronome;