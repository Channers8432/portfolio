/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import RobloxPage from './pages/RobloxPage';
import EngineeringPage from './pages/EngineeringPage';
import TranslationPage from './pages/TranslationPage';
import LeavingCertPage from './pages/LeavingCertPage';
import PastWorkPage from './pages/PastWorkPage';
import ClothingPage from './pages/ClothingPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-primary text-text-default selection:bg-brand-default selection:text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roblox" element={<RobloxPage />} />
            <Route path="/past-work" element={<PastWorkPage />} />
          </Routes>
        </main>

        <footer className="border-t border-border-default py-12 mt-20">
          <div className="max-w-[96%] mx-auto px-4 flex flex-col items-center md:items-start gap-6">
            <div className="text-text-secondary text-sm text-center md:text-left">
              © {new Date().getFullYear()} Billy Chan. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
