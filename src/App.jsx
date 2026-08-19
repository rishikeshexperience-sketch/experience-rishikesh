import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Discover from './pages/Discover';
import MoodMap from './pages/MoodMap';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Experience from './pages/Experience';
import Booking from './pages/Booking';
import CafeLogin from './pages/CafeLogin';
import CafeDashboard from './pages/CafeDashboard';
import Admin from './pages/Admin';
import 'leaflet/dist/leaflet.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/map" element={<MoodMap />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/e/:catId/:slug" element={<Experience />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/cafe-login" element={<CafeLogin />} />
        <Route path="/cafe-dashboard" element={<CafeDashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <BottomNav />
    </BrowserRouter>
  );
}
