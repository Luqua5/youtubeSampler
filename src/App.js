import YoutubeInput from './components/YoutubeInput';
import SamplerPads from './components/SamplerPads';
import Waveform from './components/Waveform';
import { SamplerProvider } from './context/SamplerContext';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      <header className="relative bg-dark-800/50 backdrop-blur-md border-b border-primary/20 text-white py-6 shadow-2xl z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl font-bold text-white">
              YouTube <span className="text-primary-light">Sampler</span>
            </h1>
          </div>
        </div>
      </header>

      <SamplerProvider>
        <main className="relative flex-grow w-full max-w-7xl mx-auto my-8 px-4 z-10">
          <div className="bg-dark-800/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-primary/10 p-8 space-y-6">
            <YoutubeInput />
            <Waveform />
            <SamplerPads />
          </div>
        </main>
      </SamplerProvider>

      <footer className="relative bg-dark-800/50 backdrop-blur-md border-t border-primary/20 text-gray-400 text-center py-4 z-10">
        <p className="text-sm">
          Made by <span className="text-primary-light font-semibold">Luka Courmont</span>
        </p>
      </footer>
    </div>
  );
}

export default App;