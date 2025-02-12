import React, { createContext, useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

export const SamplerContext = createContext();

export const SamplerProvider = ({ children }) => {
  const [slices, setSlices] = useState([]);
  const [recording, setRecording] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [pitch, setPitch] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [baseTempo, setBaseTempo] = useState(120);
  const [player, setPlayer] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [blob, setBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurfer = useRef(null);
  const timeoutRef = useRef(null);  

  return (
    <SamplerContext.Provider
      value={{
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
        setPlayer,
        buffer,
        setBuffer,
        blob,
        setBlob,
        isPlaying,
        setIsPlaying,
        wavesurfer,
        timeoutRef,
      }}
    >
      {children}
    </SamplerContext.Provider>
  );
};