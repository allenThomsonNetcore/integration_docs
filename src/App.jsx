import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrameworkPage from './pages/FrameworkPage';
import LandingPage from './pages/LandingPage';
import NavBar from './components/NavBar';
import ModulePage from './pages/ModulePage';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/android" element={<FrameworkPage framework="android" />} />
        <Route path="/ios" element={<FrameworkPage framework="ios" />} />
        <Route path="/flutter" element={<FrameworkPage framework="flutter" />} />
        <Route path="/reactnative" element={<FrameworkPage framework="reactnative" />} />
        <Route path=":framework/module/:moduleIdx/submodule/:submoduleIdx" element={<ModulePage />} />
        <Route path=":framework/module/:moduleIdx" element={<ModulePage />} />
      </Routes>
    </Router>
  );
}
export default App; 