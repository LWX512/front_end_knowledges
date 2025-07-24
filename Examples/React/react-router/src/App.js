// import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BrowserRouter, Routes, Route } from './router';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/about" element={<div>About</div>} />
                <Route path="/list" element={<div>list</div>} />
                <Route path="/hot" element={<div>hot</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
