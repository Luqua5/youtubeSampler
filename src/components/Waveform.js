import React, { useState, useEffect, useRef, useContext } from 'react';
import * as Tone from 'tone';
import WaveSurfer from 'wavesurfer.js';
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import { SamplerContext } from '../context/SamplerContext';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

function Waveform() {
    const waveformRef = useRef();

    const {
        player,
        blob,
        buffer,
        isPlaying,
        wavesurfer,
    } = useContext(SamplerContext);

    useEffect(() => {
        if(!blob) return;
        console.log('bitecontext');
        
        wavesurfer.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "violet",
          progressColor: "purple",
          backend: "MediaElement",
          plugins: [
            RegionsPlugin.create({
              dragSelection: true,
            }),
          ],
        });

        wavesurfer.current.loadBlob(blob);

        return () => wavesurfer.current.destroy();
    }, [blob]);

    useEffect(() => {
        /*
        Tone.getTransport().scheduleRepeat(() => {
            if(!isPlaying) return;
            console.log('bite2');
            console.log(isPlaying);
            const currentTime = Tone.getTransport().seconds;
            wavesurferRef.current.seekTo(currentTime / player.buffer.duration);
        }, 0.1);
        */
    }, [player, isPlaying]);

    return (
        <div>
            <div ref={waveformRef} id="waveform"></div>
            <div id="wave-timeline"></div>
        </div>
    );
}

export default Waveform;