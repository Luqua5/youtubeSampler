import React, { useState, useRef, useEffect, useContext } from 'react';
import Pad from './Pad';
import Metronome from './Metronome';
import { SamplerContext } from '../context/SamplerContext';
import { analyze } from 'web-audio-beat-detector';

const azertyKeys = [
  ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
  ['w', 'x', 'c', 'v', 'b', 'n']
];

const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`

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
    buffer,
    wavesurfer,
    regionsRef,
    isOneShot,
    setIsOneShot,
    setIsPlaying,
    isPlaying
  } = useContext(SamplerContext);

  const handlePauseStart = async () => {
    if (wavesurfer.current) {
      if (isPlaying) {
        wavesurfer.current.pause();
        setIsPlaying(false);
      } else {
        wavesurfer.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleRecording = () => {
    setRecording(!recording);
  };

  const addSlice = (key, time) => {
    const region = regionsRef.current.addRegion({
      start: wavesurfer.current.getCurrentTime(),
      color: randomColor(),
    });
    const id = Math.random().toString(36).substr(2, 9);
    const newSlice = {id, key, time : time, active: false, tempo, pitch, attributed: true, idRegion : region.id };
    setSlices([...slices, newSlice]);
    console.log('newSlice', newSlice);

    region.on('update-end', () => {
      const updatedTime = region.start;
      setSlices(prevSlices => {
        const updatedSlices = prevSlices.map(s =>
          s.id === id ? { ...s, time: updatedTime } : s
        );
        console.log('updatedSlices', updatedSlices);
        return updatedSlices;
      });
    });
    
  };

  const clearPads = () => {
    setSlices([]);
    setStartTime(null);
    regionsRef.current.clearRegions();
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
  
  const handleOneShot = () => {
    setIsOneShot(!isOneShot);
  }

  const increaseTempo = () => {
    setTempo(tempo + 1);
  }

  const decreaseTempo = () => {
    setTempo(tempo - 1);
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (recording) {
        addSlice(e.key, wavesurfer.current.getCurrentTime());
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
    if (buffer) {
      getBPM(buffer);
    }
  }, [buffer]);

  useEffect(() => {
    console.log('Recording changed:', recording);
  }, [recording]);

  return (
    <div className="p-4 bg-gray-700 rounded-md shadow">
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        {/* Bouton record */}
        <button
          onClick={handleRecording}
          className={`flex items-center justify-center w-12 h-12 rounded-l-md focus:outline-none ${
            recording ? "bg-red-800 hover:bg-red-700" : "bg-red-600 hover:bg-red-500"
          }`}
        >
          <div className="w-6 h-6 bg-white rounded-full"></div>
        </button>
        {/* Bouton Play/Pause collé */}
        <button
          onClick={handlePauseStart}
          className="bg-green-700 text-white px-4 py-2 rounded-r-md hover:bg-green-600 flex items-center justify-center"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-5.197-3.034A1 1 0 008 9.034v5.932a1 1 0 001.555.832l5.197-3.034a1 1 0 000-1.664z" />
            </svg>
          )}
        </button>
        {/* Bouton Clear pads */}
        <button onClick={clearPads} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500">
          Clear pads
        </button>
        {/* Bouton One-shot / Hold */}
        <button onClick={handleOneShot} className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600">
          {isOneShot ? "One-shot" : "Hold"}
        </button>
        <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-md w-fit">
          <div className="relative">
            <input
              type="number"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="border border-gray-600 rounded-md p-1 w-20 no-spinner bg-gray-800 text-white"
            />
            <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center pr-2 gap-0">
              <button onClick={increaseTempo} className="text-gray-400 hover:text-gray-200">
                ▲
              </button>
              <button onClick={decreaseTempo} className="text-gray-400 hover:text-gray-200">
                ▼
              </button>
            </div>
          </div>
          <div className='flex flex-col'>
            <button onClick={doubleTempo} className="text-white">
              x2
            </button>
            <button onClick={halfTempo} className="text-white">
              1/2
            </button>
          </div>
        </div>
        <Metronome tempo={tempo} />
      </div>
      <div className="keyboard">
        {azertyKeys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2 mb-2">
            {row.map((key) => {
              const slice = slices.find((s) => s.key === key);
              return (
                <Pad
                  key={key}
                  slice={slice || { key, time: 0, active: false, tempo, pitch, attributed: false }}
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