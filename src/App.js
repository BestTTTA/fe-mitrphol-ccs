import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Listdata from './pages/Listdata';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Listdata" element={<Listdata />} />
          </Routes>
      </Router>
  );
}

export default App;
