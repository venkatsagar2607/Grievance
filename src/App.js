import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Auth/Signup';
import Signin from './Auth/Signin';
import Home from './Pages/Home';
import Footer from './FOOTER/Footer';
import Dashboard from './Pages/Dashboard';
import Profile from 'Pages/Profile';
import Contact from './Pages/Contact'
import Nav from './Navigation/Navigate';
import About from 'Pages/About';
import Feature from './Pages/Feature';
import Admin from './Admin/Admin';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/Signup' element={<Signup />}></Route>
          <Route path='/Signin' element={<Signin />}></Route>
          <Route path='/' element={<Home />}></Route>
          <Route path='/Footer' element={<Footer />}></Route>
          <Route path='/Dashboard' element={<Dashboard />}></Route>
          <Route path='/Profile' element={<Profile />}></Route>
          <Route path='/Contact' element={<Contact />}></Route>
          <Route path='/Nav' element={<Nav />}></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/feature' element={<Feature />}></Route>
          <Route path='/admin' element={<Admin />}></Route>
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
