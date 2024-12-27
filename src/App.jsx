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
    <BrowserRouter>
      <NavBar />
      <div className="main-content">
        <Home />
        <NewArrivals />
        <AboutUs />
        <Services />
        <ContactUs />
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
