import React, { useState, useEffect, useRef, useContext } from 'react';
import * as Tone from 'tone';
import WaveSurfer from 'wavesurfer.js';
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import { useWavesurfer } from '@wavesurfer/react'
import { SamplerContext } from '../context/SamplerContext';

function Waveform() {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);

    const {
        player,
        blob,
        buffer,
    } = useContext(SamplerContext);

    useEffect(() => {
        if (blob) {
            // Initialiser WaveSurfer
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#ddd',
                progressColor: '#ff5500',
                cursorColor: '#ff5500',
                backend: 'MediaElement',
                plugins: [
                    Timeline.create({
                        container: '#wave-timeline',
                    }),
                ],
            });
            
            wavesurferRef.current.loadBlob(blob);

            //synch waveform with player
            player.sync().start();

            // Mettre à jour la forme d'onde pendant la lecture
            Tone.getTransport().scheduleRepeat(() => {
                const currentTime = Tone.getTransport().seconds;
                wavesurferRef.current.seekTo(currentTime / player.buffer.duration);
            }, 0.1);

            // Synchroniser le lecteur Tone.js avec le curseur de WaveSurfer
            wavesurferRef.current.on('seek', (progress) => {
                const newTime = progress * player.buffer.duration;
                Tone.getTransport().seconds = newTime;
                player.start(undefined, newTime);
            });
        }

        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }
        };
    }, [blob]);

    return (
        <div>
            <div ref={waveformRef} id="waveform"></div>
            <div id="wave-timeline"></div>
        </div>
    );
}

export default Waveform;