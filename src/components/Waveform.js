import React, { useEffect, useRef, useContext, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import { SamplerContext } from '../context/SamplerContext';

function Waveform() {
  const waveformRef = useRef(null);
  const { blob, wavesurfer, slices, recording, regionsRef } = useContext(SamplerContext);
  const [zoom, setZoom] = useState(0); // Zoom initial

  useEffect(() => {
    if (!blob) return;
    
    regionsRef.current = RegionsPlugin.create();

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "violet",
      progressColor: "purple",
      backend: "MediaElement",
      plugins: [
        Timeline.create({
          container: "#wave-timeline",
          primaryColor: "#444",
          secondaryColor: "#888",
          primaryFontColor: "#444",
          secondaryFontColor: "#888",
        }),
        regionsRef.current,
      ],
    });
    
    wavesurfer.current.loadBlob(blob);

    return () => wavesurfer.current.destroy();
  }, [blob, wavesurfer]);

  // Appliquer le zoom à WaveSurfer
  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.zoom(zoom);
    }
  }, [zoom, wavesurfer]);

  return (
    <div className="mb-6">
      <div id="waveform" className="w-full h-40 bg-stone-950 rounded-md">
        <div ref={waveformRef}></div>
        <div id="wave-timeline" className="mt-2"></div>
      </div>
      <div className="mt-4 px-4">
        <input
          type="range"
          min="0"
          max="200"
          step="10"
          value={zoom}
          onChange={(e) => setZoom(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
}

export default Waveform;