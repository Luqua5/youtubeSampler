import React, { useEffect, useState, useContext } from 'react';
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

      const blob = response.data;
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      setBuffer(audioBuffer);
      setBlob(blob);
      setStatus('converted');


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
