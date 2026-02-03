import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SamplerContext } from '../context/SamplerContext';


function YouTubeInput() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
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
    if (!url.trim()) return;
    
    try {
      setLoading(true);
      setStatus('Converting...');
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
      setStatus('Ready to sample!');
      setLoading(false);

    } catch (error) {
      console.error(error);
      setStatus('Error loading audio');
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSample();
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-300 font-semibold mb-3 text-sm uppercase tracking-wide">
        YouTube URL
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-dark-700/50 border border-primary/30 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
        />
        <button
          onClick={handleSample}
          disabled={loading || !url.trim()}
          className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/50 font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              LOADING
            </span>
          ) : (
            'LOAD'
          )}
        </button>
      </div>
      {status && (
        <p className={`mt-3 text-sm font-medium ${status.includes('✅') ? 'text-green-400' : status.includes('❌') ? 'text-red-400' : 'text-secondary'}`}>
          {status}
        </p>
      )}
    </div>
  );
}

export default YouTubeInput;
