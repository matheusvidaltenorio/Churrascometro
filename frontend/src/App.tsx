import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ResultsPage } from './pages/ResultsPage';
import { SharePage } from './pages/SharePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/calcular" element={<CalculatorPage />} />
      <Route path="/resultado" element={<ResultsPage />} />
      <Route path="/share/:token" element={<SharePage />} />
    </Routes>
  );
}

export default App;
