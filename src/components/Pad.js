import React, { useState, useEffect, useContext } from 'react';
import * as Tone from 'tone';
import classNames from 'classnames';
import { SamplerContext } from '../context/SamplerContext';


function Pad({ slice, player, setSlices, slices, baseTempo }) {
  const { isPlaying, setIsPlaying } = useContext(SamplerContext);
  
  const playSlice = () => {
    if (!slice.attributed) return;
    console.log('plauSlice');

    // Annuler toute programmation précédente et arrêter le player
    Tone.getTransport().cancel();
    player.sync().stop();

    const offset = Math.max(parseFloat(slice.time), 0);
    const playbackRate = slice.tempo / baseTempo;
    player.playbackRate = playbackRate;

    const nextSliceIndex = slices.findIndex((s) => s.key === slice.key) + 1;
    const duration = nextSliceIndex < slices.length ? slices[nextSliceIndex].time - offset : undefined;

    if(Tone.getTransport().state !== 'started') {
      Tone.getTransport().start();
    }

    Tone.getTransport().start(undefined, offset,);

    // Démarrer la lecture synchronisée du player à l'offset, avec une durée si spécifiée
    player.sync().start(undefined, offset, duration);
    setIsPlaying(true);

    //turn to false after duration
    if (duration) {
      setTimeout(() => {
        setIsPlaying(false);
      }, duration * 1000);
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