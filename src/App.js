import YoutubeInput from './components/YoutubeInput';
import SamplerPads from './components/SamplerPads';
import Waveform from './components/Waveform';
import { SamplerProvider } from './context/SamplerContext';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 text-white py-4 shadow">
        <h1 className="text-center text-4xl font-bold">YouTube Sampler</h1>
      </header>
      <SamplerProvider>
        <main className="flex-grow max-w-4xl mx-auto my-8 p-8 bg-gray-800 shadow-lg rounded-lg">
          <YoutubeInput />
          <Waveform />
          <SamplerPads />
        </main>
      </SamplerProvider>
      <footer className="bg-gray-800 text-white text-center py-3">
        Luka Courmont - 2025
      </footer>
    </div>
  );
}

export default App;