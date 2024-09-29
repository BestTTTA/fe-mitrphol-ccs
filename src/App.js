import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Listdata from './pages/Listdata';
import TestGeo from './pages/TestGeo';
import './index.css';  // Import the Tailwind CSS file

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Listdata" element={<Listdata />} />
              <Route path="/TestGeo" element={<TestGeo/>} />
          </Routes>
      </Router>
  );
}

export default App;
