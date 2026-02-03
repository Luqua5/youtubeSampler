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
      waveColor: "#8B5CF6",
      progressColor: "#06B6D4",
      cursorColor: "#22D3EE",
      barWidth: 2,
      barGap: 1,
      barRadius: 3,
      height: 128,
      // Utiliser WebAudio backend pour avoir accès à decodedData
      backend: "WebAudio",
      plugins: [
        Timeline.create({
          container: "#wave-timeline",
          primaryColor: "#8B5CF6",
          secondaryColor: "#A78BFA",
          primaryFontColor: "#E5E7EB",
          secondaryFontColor: "#9CA3AF",
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
    <div className="mb-8">
      <label className="block text-gray-300 font-semibold mb-3 text-sm uppercase tracking-wide">
        Waveform
      </label>
      <div className="bg-dark-700/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6 shadow-xl">
        <div id="waveform" className="w-full rounded-lg overflow-hidden">
          <div ref={waveformRef}></div>
          <div id="wave-timeline" className="mt-2"></div>
        </div>
        <div className="mt-6">
          <div className="flex items-center gap-4">
            <label className="text-gray-400 text-sm font-medium">
              Zoom:
            </label>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={zoom}
              onChange={(e) => setZoom(parseInt(e.target.value))}
              className="flex-1 h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary"
              style={{
                background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${zoom/2}%, #1F2937 ${zoom/2}%, #1F2937 100%)`
              }}
            />
            <span className="text-gray-300 text-sm font-mono min-w-[60px] text-right">
              {zoom}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Waveform;