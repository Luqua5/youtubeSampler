import './App.css';
import YoutubeInput from './components/YoutubeInput';
import SamplerPads from './components/SamplerPads';
import Waveform from './components/Waveform';
import {SamplerProvider} from './context/SamplerContext';

function App() {
  return (
    <div className="App">
      <h1>YouTube Sampler</h1>
      <SamplerProvider>
        <YoutubeInput/>
        <Waveform/>
        <SamplerPads/>
      </SamplerProvider>
    </div>
  );
}

export default App;
