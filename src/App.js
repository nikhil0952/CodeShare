
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Editorpage from './Editorpage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <div>
      <Toaster position=' top-right'></Toaster>
    </div>
    <BrowserRouter>
    <Routes>
      <Route path='/'  element={<Home/>}/>
      <Route path='/editor/:roomId/:username'  element={<Editorpage/>}/>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
