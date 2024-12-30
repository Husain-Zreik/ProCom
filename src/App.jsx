import { BrowserRouter } from 'react-router-dom';
import Services from './pages/Services/Services';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';
import NewArrivals from './pages/NewArrivals/NewArrivals';
import AboutUs from './pages/AboutUs/AboutUs';
import ContactUs from './pages/ContactUs/ContactUs';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="main-content">
      <div className="main-content-container">
        <BrowserRouter>
          <NavBar />
          <Home />
          <AboutUs />
          <NewArrivals />
          <Services />
          <ContactUs />
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
