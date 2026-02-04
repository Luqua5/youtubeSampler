import React, { useState, useEffect, useContext, useRef } from 'react';
import classNames from 'classnames';
import { SamplerContext } from '../context/SamplerContext';


function Pad({ slice, setSlices, slices, baseTempo }) {
  const { regionsRef, setIsPlaying, wavesurfer, timeoutRef, recording, isOneShot, tempo } = useContext(SamplerContext);
  
  const audioSourceRef = useRef(null);
  
  const playSlice = () => {
    if (!slice.attributed) return;

    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }

    const playbackRate = tempo / baseTempo;
    console.log('playbackRate', playbackRate);
    
    // Trouver la région correspondante
    const region = regionsRef.current.getRegions().find(r => r.id === slice.idRegion);
    
    if (region) {
        // Jouer directement la région
        wavesurfer.current.setPlaybackRate(playbackRate);
        region.play();
        setIsPlaying(true);
        
        if(isOneShot){
          const nextSliceIndex = slices.findIndex((s) => s.key === slice.key) + 1;
          const duration = nextSliceIndex < slices.length ? slices[nextSliceIndex].time - slice.time : undefined;

          if (duration) {
            const adjustedDuration = (duration * 1000) / playbackRate;
            console.log('adjustedDuration', adjustedDuration);
            console.log('region duration', region.start, region.end);
            timeoutRef.current = setTimeout(() => {
                setIsPlaying(false);
                wavesurfer.current.pause();
            }, adjustedDuration);
          }
        }
    } else {
        // Fallback si pas de région (ne devrait pas arriver)
        wavesurfer.current.setPlaybackRate(playbackRate);
        setIsPlaying(true);
        wavesurfer.current.setTime(slice.time);
        wavesurfer.current.play();

        if(isOneShot){
            const nextSliceIndex = slices.findIndex((s) => s.key === slice.key) + 1;
            const duration = nextSliceIndex < slices.length ? slices[nextSliceIndex].time - slice.time : undefined;

            if (duration) {
                const adjustedDuration = (duration * 1000) / playbackRate;
                timeoutRef.current = setTimeout(() => {
                    setIsPlaying(false);
                    wavesurfer.current.pause();
                }, adjustedDuration);
            }
        }
    }
  };

  const stopSlice = () => {
    if(!isOneShot){
        setIsPlaying(false);
        wavesurfer.current.pause();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {        
        if (e.key === slice.key && slice.attributed && !recording && !slice.active) {
            playSlice();
            const updatedSlices = slices.map((s) =>
              s.key === slice.key ? { ...s, active: true } : s 
            );
            setSlices(updatedSlices);
        }
    };

    const handleKeyUp = (e) => {
        if (e.key === slice.key && !recording) {
            stopSlice();
            const updatedSlices = slices.map((s) =>
              s.key === slice.key ? { ...s, active: false } : s
            );
            setSlices(updatedSlices);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [slices, recording, slice.key, setSlices]);

  // Cleanup à la destruction du composant
  useEffect(() => {
    return () => {
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);

  return (
    <div
      className={classNames(
        "w-16 h-16 flex items-center justify-center border-2 rounded-xl cursor-pointer font-bold text-lg transition-all transform duration-200 shadow-lg",
        {
          "bg-gradient-to-br from-primary to-secondary text-white border-primary-light shadow-primary/50 scale-110 animate-pulse": slice.active,
          "bg-gradient-to-br from-dark-700 to-dark-600 text-gray-300 border-primary/30 hover:border-primary hover:scale-105 hover:shadow-primary/30": !slice.active && slice.attributed,
          "bg-dark-800/50 text-gray-600 border-gray-700 opacity-40 cursor-not-allowed": !slice.attributed,
        }
      )}
      onClick={playSlice}
    >
      <span className="uppercase font-mono">{slice.key}</span>
    </div>
  );
}

export default Pad;