import { BrowserRouter } from 'react-router-dom';
import Services from './pages/Services/Services';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="main-content">
        <Home />
        <Services />
      </div>
    </BrowserRouter>
  );
}

export default App;
