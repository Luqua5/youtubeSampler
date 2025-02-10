import React, { useEffect, useState, useContext } from 'react';
import * as Tone from "tone";
import axios from 'axios';
import { SamplerContext } from '../context/SamplerContext';


function YouTubeInput() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('converting');
  
  const {
    player,
    setPlayer,
    buffer,
    setBuffer,
    blob,
    setBlob,
  } = useContext(SamplerContext);

  const handleInputChange = (e) => setUrl(e.target.value);

  const handleSample = async () => {
    try {
      const videoUrl = url.split('&')[0];
      const response = await axios.get(`http://localhost:3001/convert`, {
        params: { url: videoUrl },
        responseType: 'blob',
      });
      Tone.start();
      const blob = response.data;
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = Tone.getContext().rawContext;
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      setBuffer(buffer);
      setBlob(blob);
      
      const player = new Tone.Player(buffer).toDestination();
      setStatus('converted');
      //player.start();
      setPlayer(player);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Entre une URL YouTube"
        value={url}
        onChange={handleInputChange}
      />
      <button onClick={handleSample}>
        Enregistrer
      </button>
      <p>status : {status}</p>
    </div>
  );
}

export default YouTubeInput;
