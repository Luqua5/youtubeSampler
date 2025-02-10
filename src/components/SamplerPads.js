import React, { useState, useRef, useEffect, useContext } from 'react';
import * as Tone from 'tone';
import Pad from './Pad';
import { SamplerContext } from '../context/SamplerContext';
import { analyze } from 'web-audio-beat-detector';

const azertyKeys = [
  ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
  ['w', 'x', 'c', 'v', 'b', 'n']
];

function SamplerPads() {
  const {
    slices,
    setSlices,
    recording,
    setRecording,
    tempo,
    setTempo,
    pitch,
    setPitch,
    startTime,
    setStartTime,
    baseTempo,
    setBaseTempo,
    player,
    buffer,
  } = useContext(SamplerContext);

  const startRecording = async () => {
    if (player) {
      await Tone.start();
      Tone.getTransport().start(undefined, 0);
      setRecording(true);
      setStartTime(Tone.now());
    }
  };

  const stopRecording = () => {
    setRecording(false);
    Tone.getTransport().stop();
  };

  const addSlice = (key, time) => {
    console.log('addSlice', key, time);
    
    const relativeTime = startTime ? time - startTime : 0;
    const newSlice = { key, time : relativeTime, active: false, tempo, pitch, attributed: true };
    setSlices([...slices, newSlice]);
  };

  const clearPads = () => {
    setSlices([]);
    setStartTime(null);
  };

  const getBPM = async () => {
    const bpm = await analyze(buffer);
    setTempo(parseInt(bpm));
    setBaseTempo(parseInt(bpm));
  }

  const doubleTempo = () => {
    setTempo(tempo * 2);
  }

  const halfTempo = () => {
    setTempo(tempo / 2);
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log('handleKeyDown', e.key);
      
      if (recording) {
        addSlice(e.key, Tone.now());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [recording, slices]);

  useEffect(() => {
    slices.forEach((slice) => {
      slice.tempo = tempo;
      slice.pitch = pitch;
    });
    setSlices([...slices]);
  }, [pitch, tempo]);

  useEffect(() => {
    if (player) {
      getBPM(player._buffer);
    }
  }, [player]);

  return (
    <div>
      <h2>Sampler Pads</h2>
      <button onClick={startRecording}>Record sample - </button>
      <button onClick={stopRecording}>Stop recording - </button>
      <button onClick={clearPads}>Clear pads</button>
      <div>
        <label>
          Tempo:
          <input
            type="number"
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
          />
          <button onClick={doubleTempo}>x2</button>
          <button onClick={halfTempo}>x0.5</button>
        </label>
        <label>
          Pitch:
          <input
            type="number"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
          />
        </label>
      </div>
      <div className="keyboard">
        {azertyKeys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-2">
            {row.map((key) => {
              const slice = slices.find((s) => s.key === key);
              return (
                <Pad
                  key={key}
                  slice={slice || { key, time: 0, active: false, tempo, pitch, attributed: false }}
                  player={player}
                  setSlices={setSlices}
                  slices={slices}
                  baseTempo={baseTempo}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SamplerPads;