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
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-center mb-4">
          <input
            type="text"
            placeholder="Entrez une URL YouTube"
            value={url}
            onChange={handleInputChange}
            className="flex-1 border border-gray-300 rounded-md p-2 mb-2 sm:mb-0 sm:mr-2"
          />
          <button
            onClick={handleSample}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Enregistrer
          </button>
      </div>
      <p className="text-gray-600 text-sm">Status : {status}</p>
    </div>
  );
}

export default YouTubeInput;
