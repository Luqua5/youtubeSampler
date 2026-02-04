import React, { useState, useRef, useEffect, useContext } from 'react';
import Pad from './Pad';
import Metronome from './Metronome';
import { SamplerContext } from '../context/SamplerContext';
import { analyze } from 'web-audio-beat-detector';

const keyboardLayouts = {
  azerty: [
    ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
    ['w', 'x', 'c', 'v', 'b', 'n']
  ],
  qwerty: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n']
  ],
  qwertz: [
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö'],
    ['y', 'x', 'c', 'v', 'b', 'n']
  ]
};

const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`

function SamplerPads() {
  const [keyboardLayout, setKeyboardLayout] = useState('azerty');
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
        const playbackRate = tempo / baseTempo;
        wavesurfer.current.setPlaybackRate(playbackRate);
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
    <div className="bg-dark-700/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-gray-300 font-semibold text-sm uppercase tracking-wide">
          Sample Pads
        </label>
        
        <div className="flex gap-2">
          {Object.keys(keyboardLayouts).map((layout) => (
            <button
              key={layout}
              onClick={() => setKeyboardLayout(layout)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all duration-300 ${
                keyboardLayout === layout
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/50'
                  : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600 hover:text-gray-200 border border-primary/20'
              }`}
            >
              {layout}
            </button>
          ))}
        </div>
      </div>
      
      {/* Control Panel */}
      <div className="flex flex-wrap gap-3 mb-6 items-center bg-dark-800/50 p-4 rounded-xl border border-primary/10">
        {/* Record & Play/Pause group */}
        <div className="flex rounded-xl overflow-hidden shadow-lg">
          <button
            onClick={handleRecording}
            className={`flex items-center justify-center w-14 h-14 transition-all duration-300 ${
              recording 
                ? "bg-red-600 hover:bg-red-500 animate-pulse" 
                : "bg-red-500/80 hover:bg-red-500"
            }`}
            title={recording ? "Stop recording" : "Start recording"}
          >
            <div className={`${recording ? 'w-4 h-4 rounded-sm' : 'w-6 h-6 rounded-full'} bg-white transition-all duration-300`}></div>
          </button>
          
          <button
            onClick={handlePauseStart}
            className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 hover:from-green-500 hover:to-green-400 flex items-center justify-center transition-all duration-300"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Clear & Mode buttons */}
        <button 
          onClick={clearPads} 
          className="bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg border border-primary/20 transform hover:scale-105"
        >
          Clear
        </button>
        
        <button 
          onClick={handleOneShot} 
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 ${
            isOneShot 
              ? 'bg-primary hover:bg-primary-dark text-white border border-primary-light hover:shadow-primary/50' 
              : 'bg-dark-700 hover:bg-dark-600 text-white border border-primary/30'
          }`}
        >
          {isOneShot ? "One-shot" : "Loop"}
        </button>

        {/* Tempo Control */}
        <div className="flex items-center gap-3 bg-dark-900/80 px-4 py-2 rounded-xl border border-primary/20 shadow-lg">
          <span className="text-gray-400 text-sm font-medium">BPM:</span>
          <div className="relative">
            <input
              type="number"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="no-spinner border border-primary/30 rounded-lg p-2 w-20 bg-dark-700 text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <div className="absolute inset-y-0 right-2 flex flex-col justify-center gap-0.5">
              <button 
                onClick={increaseTempo} 
                className="text-primary hover:text-primary-light transition-colors"
              >
                <svg className="w-3 h-3 rotate-180" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
              <button 
                onClick={decreaseTempo} 
                className="text-primary hover:text-primary-light transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>
          </div>
          <div className='flex gap-1'>
            <button 
              onClick={doubleTempo} 
              className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary-light rounded-md text-xs font-bold transition-all"
            >
              ×2
            </button>
            <button 
              onClick={halfTempo} 
              className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary-light rounded-md text-xs font-bold transition-all"
            >
              ÷2
            </button>
          </div>
        </div>

        {/* Metronome */}
        <div className="ml-auto">
          <Metronome tempo={tempo} />
        </div>
      </div>

      {/* Keyboard Pads */}
      <div className="keyboard space-y-3">
        {keyboardLayouts[keyboardLayout].map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
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