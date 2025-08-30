import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages
import AnaSayfa from './pages/AnaSayfa';
import GirisYap from './pages/GirisYap';
import StokYönetimi from './pages/StokYönetimi';
import Uretim from './pages/Uretim';
import UretimAgaci from './pages/UretimAgaci';
import TestAPI from './pages/TestAPI';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AnaSayfa />} />
          <Route path="/giris" element={<GirisYap />} />
          <Route path="/stok-yonetimi" element={<StokYönetimi />} />
          <Route path="/uretim" element={<Uretim />} />
          <Route path="/uretim-agaci" element={<UretimAgaci />} />
          <Route path="/test-api" element={<TestAPI />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
