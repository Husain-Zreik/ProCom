import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Content from './pages/Content';

function App() {
  return (
    <BrowserRouter>
      <div className="main-content">
        <div className="main-content-container">
          <NavBar />
          <Routes>
            <Route path="/" element={<Content />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
