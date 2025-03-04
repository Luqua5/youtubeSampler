import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SamplerContext } from '../context/SamplerContext';


function YouTubeInput() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  
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
      <div className="flex">
          <input
            type="text"
            placeholder="Entrez une URL YouTube"
            value={url}
            onChange={handleInputChange}
            className="flex-1 border border-gray-700 rounded-l-md p-2 mb-2 sm:mb-0 bg-gray-700 text-white"
          />
          <button
            onClick={handleSample}
            className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark font-bold"
          >
            LOAD
          </button>
      </div>
      <p className="text-gray-600 text-sm">Status : {status}</p>
    </div>
  );
}

export default YouTubeInput;
