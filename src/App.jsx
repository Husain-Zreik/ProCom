import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';

function App() {
  return (
    <BrowserRouter>
      {/* <div className="app"> */}
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Default Route */}
      </Routes>
      {/* </div> */}
    </BrowserRouter>
  );
}

export default App;
