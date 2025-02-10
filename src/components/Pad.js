import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import classNames from 'classnames';


function Pad({ slice, player, setSlices, slices, baseTempo }) {
  const playSlice = () => {
    if(!slice.attributed) return;
    const offset = parseFloat(slice.time);
    const playbackRate = slice.tempo / baseTempo;
    player.playbackRate = playbackRate;

    const nextSliceIndex = slices.findIndex((s) => s.key === slice.key) + 1;
    const duration = nextSliceIndex < slices.length ? slices[nextSliceIndex].time - offset : undefined;
    
    if(duration) {
        Tone.getTransport().start(undefined, offset, duration).stop('+' + duration);
    }else{
        Tone.getTransport().start(undefined, offset);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === slice.key) {
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
        'inline-block w-16 h-16 m-1 border-2 border-black rounded bg-white text-center leading-16 text-lg font-bold cursor-pointer shadow-md transition duration-200 transform',
        {
          'bg-red-500 translate-y-1': slice.active,
          'bg-white': !slice.active,
          'opacity-50': !slice.attributed,
        }
      )}
      onClick={playSlice}
    >
      {slice.key}
    </div>
  );
}

export default Pad;