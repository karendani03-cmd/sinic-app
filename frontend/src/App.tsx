import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/Toast';
import AprendeSINIC from './pages/AprendeSINIC';
import AprendeUML from './pages/AprendeUML';
import ModeloDatos from './pages/ModeloDatos';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen bg-gray-950">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/aprende-sinic" replace />} />
            <Route path="/aprende-sinic" element={<AprendeSINIC />} />
            <Route path="/aprende-uml"   element={<AprendeUML />} />
            <Route path="/modelo-datos"  element={<ModeloDatos />} />
            <Route path="*"              element={<Navigate to="/aprende-sinic" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
