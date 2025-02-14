import React, { useState, useEffect, useContext, useRef } from 'react';
import classNames from 'classnames';
import { SamplerContext } from '../context/SamplerContext';


function Pad({ slice, setSlices, slices, baseTempo }) {
  const { isPlaying, setIsPlaying, wavesurfer, timeoutRef } = useContext(SamplerContext);
  
  const playSlice = () => {
    if (!slice.attributed) return;

    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }

    const playbackRate = slice.tempo / baseTempo;
    console.log('playbackRate', playbackRate);
    
    wavesurfer.current.setPlaybackRate(playbackRate);

    const nextSliceIndex = slices.findIndex((s) => s.key === slice.key) + 1;
    const duration = nextSliceIndex < slices.length ? slices[nextSliceIndex].time - slice.time : undefined;

    setIsPlaying(true);

    console.log('duration', duration);

    wavesurfer.current.seekTo(slice.time / wavesurfer.current.getDuration());
    wavesurfer.current.play();

    //turn to false after duration
    if (duration) {
        timeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
        console.log('pause', slice.key);
        wavesurfer.current.pause();
      }, (duration*1000)*(1/playbackRate));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === slice.key && slice.attributed) {
      playSlice();
      const updatedSlices = slices.map((s) =>
        s.key === slice.key ? { ...s, active: true } : s 
      );
      setSlices(updatedSlices);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === slice.key) {
      const updatedSlices = slices.map((s) =>
        s.key === slice.key ? { ...s, active: false } : s
      );
      setSlices(updatedSlices);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [slices]);

  return (
    <div
      className={classNames(
        "w-16 h-16 flex items-center justify-center border-2 rounded cursor-pointer font-bold transition transform duration-200",
        {
          "bg-red-500 text-white": slice.active,
          "bg-white text-black": !slice.active,
          "opacity-50": !slice.attributed,
        }
      )}
      onClick={playSlice}
    >
      {slice.key}
    </div>
  );
}

export default Pad;